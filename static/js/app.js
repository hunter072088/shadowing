/**
 * EchoShadow 1314 - Main Application Controller
 * Handles tabs, user input, AI generation, player integration, favorites, and PWA mobile installation.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // App state
  const state = {
    currentTab: "phrase",
    activeItem: null, // current phrase or word being practiced
    activePlaybackText: "",
    activeTargetElement: null,
    settings: {
      rate: 0.9,
      interval: 2.0,
      repeatCount: 3,
      voiceName: "",
      apiKey: ""
    },
    history: [],
    historyFilter: "all", // 'all' | 'fav' | 'phrase' | 'word'
    podcastFilter: {
      category: "all",
      level: "all",
      search: ""
    }
  };

  // DOM Elements
  const tabs = document.querySelectorAll(".nav-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const settingsModal = document.getElementById("settings-modal");
  const settingsBtn = document.getElementById("open-settings-btn");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const saveSettingsBtn = document.getElementById("save-settings-btn");

  // Mobile modal elements
  const mobileModal = document.getElementById("mobile-modal");
  const openMobileBtn = document.getElementById("open-mobile-modal-btn");
  const closeMobileBtn = document.getElementById("close-mobile-btn");
  const ackMobileBtn = document.getElementById("ack-mobile-btn");
  const mobileQrArea = document.getElementById("mobile-qr-area");

  // Load settings and history
  state.settings = await API.getSettings();
  state.history = await API.getHistory();

  // Apply settings to speech engine
  window.shadowEngine.setRate(state.settings.rate);
  window.shadowEngine.setInterval(state.settings.interval);
  window.shadowEngine.setRepeatCount(state.settings.repeatCount);

  // Initialize Speech Voices
  window.shadowEngine.onVoicesLoaded = (voices, selected) => {
    populateVoiceSelects(voices, selected);
  };

  function populateVoiceSelects(voices, selected) {
    const voiceSelect = document.getElementById("settings-voice-select");
    if (!voiceSelect) return;
    voiceSelect.innerHTML = "";
    voices.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      if (selected && selected.name === v.name) {
        opt.selected = true;
      } else if (state.settings.voiceName && state.settings.voiceName === v.name) {
        opt.selected = true;
        window.shadowEngine.setVoiceByName(v.name);
      }
      voiceSelect.appendChild(opt);
    });
  }

  // Set up Speech Engine Callbacks
  const waveCanvas = document.getElementById("audio-wave-canvas");
  const waveCtx = waveCanvas ? waveCanvas.getContext("2d") : null;
  let waveAnimId = null;

  window.shadowEngine.onStateChange = (playbackState) => {
    updatePlayerUI(playbackState);
  };

  window.shadowEngine.onProgress = (current, total) => {
    const progressBadge = document.getElementById("player-loop-status");
    if (progressBadge) {
      const totalStr = total === Infinity ? "∞" : total;
      progressBadge.innerHTML = `<span class="pulse-dot"></span> 第 <strong>${current}</strong> / ${totalStr} 遍跟讀中`;
    }
  };

  window.shadowEngine.onIntervalCountdown = (secondsRemaining) => {
    const countdownEl = document.getElementById("player-countdown");
    if (countdownEl) {
      if (secondsRemaining > 0) {
        countdownEl.style.display = "flex";
        countdownEl.innerHTML = `🗣️ <strong>跟讀時間：</strong> 請大聲跟讀模仿 (${secondsRemaining}s)`;
        countdownEl.classList.add("counting");
      } else {
        countdownEl.style.display = "none";
        countdownEl.classList.remove("counting");
      }
    }
  };

  window.shadowEngine.onWordBoundary = (charIndex, charLength) => {
    highlightKaraoke(charIndex, charLength);
  };

  // Canvas Wave Animation
  function startWaveform() {
    if (!waveCanvas || !waveCtx) return;
    let step = 0;
    function draw() {
      waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
      const width = waveCanvas.width;
      const height = waveCanvas.height;
      const mid = height / 2;
      const bars = 36;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const factor = Math.sin(step * 0.15 + i * 0.4) * 0.5 + 0.5;
        const barHeight = window.shadowEngine.isPlaying && !window.shadowEngine.isIntervalWaiting
          ? 6 + factor * (height - 12)
          : 4;
        
        const x = i * barWidth + barWidth * 0.2;
        const y = mid - barHeight / 2;
        
        // Gradient color
        const grad = waveCtx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, "#818cf8");
        grad.addColorStop(1, "#38bdf8");
        waveCtx.fillStyle = grad;
        waveCtx.beginPath();
        waveCtx.roundRect(x, y, barWidth * 0.6, barHeight, 3);
        waveCtx.fill();
      }
      step++;
      waveAnimId = requestAnimationFrame(draw);
    }
    cancelAnimationFrame(waveAnimId);
    draw();
  }
  startWaveform();

  // Tab Switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      switchTab(target);
    });
  });

  function switchTab(tabName) {
    state.currentTab = tabName;
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabName));
    tabPanes.forEach(p => p.classList.toggle("active", p.id === `tab-${tabName}`));

    if (tabName === "podcast") {
      renderPodcastCards();
    } else if (tabName === "history") {
      renderHistoryList();
    }
  }

  // ==========================================
  // REQUIREMENT 1: PHRASE SHADOWING (片語跟讀)
  // ==========================================
  const phraseInput = document.getElementById("phrase-input");
  const phraseGenBtn = document.getElementById("phrase-gen-btn");
  const phraseResultArea = document.getElementById("phrase-result-area");
  const favPhraseBtn = document.getElementById("fav-phrase-btn");

  // Quick phrase recommendation tags
  document.querySelectorAll(".quick-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      phraseInput.value = tag.dataset.text;
      handlePhraseGenerate();
    });
  });

  phraseGenBtn.addEventListener("click", handlePhraseGenerate);
  phraseInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handlePhraseGenerate();
  });

  async function handlePhraseGenerate() {
    const query = phraseInput.value.trim();
    if (!query) {
      phraseInput.focus();
      return;
    }

    setLoading(phraseGenBtn, true, "AI 解析造句中...");
    try {
      const data = await API.generate("phrase", query, state.settings.apiKey);
      setLoading(phraseGenBtn, false, "✨ 開始 AI 解析與造句");
      renderPhraseResult(data);

      // Check if item was previously favorited
      const prevFav = state.history.find(h => h.text.toLowerCase() === data.text.toLowerCase());
      const isFav = prevFav ? !!prevFav.favorite : false;

      // Save to history
      const historyItem = {
        id: "p_" + Date.now(),
        type: "phrase",
        text: data.text,
        translation: data.translation,
        sentence: data.sentence,
        favorite: isFav,
        timestamp: Date.now()
      };
      await API.saveHistory(historyItem);
      state.history = await API.getHistory();
      updateFavBtnUI(favPhraseBtn, isFav);
    } catch (e) {
      setLoading(phraseGenBtn, false, "✨ 開始 AI 解析與造句");
      console.error(e);
      alert("解析生成失敗，請稍後重試。");
    }
  }

  function renderPhraseResult(item) {
    state.activeItem = item;
    phraseResultArea.style.display = "block";
    phraseResultArea.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Populate data
    document.getElementById("res-phrase-title").textContent = item.text;
    document.getElementById("res-phrase-translation").textContent = item.translation || "";
    document.getElementById("res-phrase-explanation").textContent = item.explanation || "";
    document.getElementById("res-phrase-pronunciation").textContent = item.pronunciation || "";
    
    // Example sentence
    const sentEl = document.getElementById("res-phrase-sentence");
    sentEl.textContent = item.sentence || "";
    sentEl.dataset.fulltext = item.sentence || "";
    document.getElementById("res-phrase-sent-trans").textContent = item.sentence_translation || "";

    // Check favorite status
    const isFav = state.history.some(h => h.text.toLowerCase() === item.text.toLowerCase() && h.favorite);
    updateFavBtnUI(favPhraseBtn, isFav);

    // Dialogue
    const dialogueContainer = document.getElementById("res-phrase-dialogue");
    dialogueContainer.innerHTML = "";
    if (item.dialogue && Array.isArray(item.dialogue)) {
      item.dialogue.forEach(d => {
        const bubble = document.createElement("div");
        bubble.className = `dialogue-bubble speaker-${d.speaker.toLowerCase()}`;
        bubble.innerHTML = `
          <div class="speaker-tag">${d.speaker === 'A' ? '🎙️ Host / A' : '🎧 Guest / B'}</div>
          <div class="bubble-text" data-text="${escapeHtml(d.line)}">${escapeHtml(d.line)}</div>
          <div class="bubble-trans">${escapeHtml(d.translation)}</div>
          <button class="mini-play-btn" title="跟讀此單句" data-text="${escapeHtml(d.line)}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> 跟讀此句
          </button>
        `;
        bubble.querySelector(".mini-play-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          startShadowingTarget(d.line, bubble.querySelector(".bubble-text"));
        });
        dialogueContainer.appendChild(bubble);
      });
    }

    if (item.shadowing_tips) {
      document.getElementById("res-phrase-tips").textContent = item.shadowing_tips;
      document.getElementById("res-phrase-tips-box").style.display = "flex";
    } else {
      document.getElementById("res-phrase-tips-box").style.display = "none";
    }

    // Default load main sentence into player
    startShadowingTarget(item.sentence, sentEl);
  }

  // Favorite toggle for Phrase
  if (favPhraseBtn) {
    favPhraseBtn.addEventListener("click", async () => {
      if (!state.activeItem) return;
      const isFav = await API.toggleFavorite(state.activeItem.id, state.activeItem.text, {
        id: state.activeItem.id || "p_" + Date.now(),
        type: "phrase",
        text: state.activeItem.text,
        translation: state.activeItem.translation,
        sentence: state.activeItem.sentence,
        favorite: true,
        timestamp: Date.now()
      });
      state.history = await API.getHistory();
      updateFavBtnUI(favPhraseBtn, isFav);
    });
  }

  // ==========================================
  // REQUIREMENT 2: WORD SHADOWING (單字簡單造句)
  // ==========================================
  const wordInput = document.getElementById("word-input");
  const wordGenBtn = document.getElementById("word-gen-btn");
  const wordResultArea = document.getElementById("word-result-area");
  const favWordBtn = document.getElementById("fav-word-btn");

  document.querySelectorAll(".quick-word-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      wordInput.value = tag.dataset.text;
      handleWordGenerate();
    });
  });

  wordGenBtn.addEventListener("click", handleWordGenerate);
  wordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleWordGenerate();
  });

  async function handleWordGenerate() {
    const query = wordInput.value.trim();
    if (!query) {
      wordInput.focus();
      return;
    }

    setLoading(wordGenBtn, true, "AI 簡單造句中...");
    try {
      const data = await API.generate("word", query, state.settings.apiKey);
      setLoading(wordGenBtn, false, "⚡ AI 簡單造句 & 重複聽播");
      renderWordResult(data);

      const prevFav = state.history.find(h => h.text.toLowerCase() === data.text.toLowerCase());
      const isFav = prevFav ? !!prevFav.favorite : false;

      // Save to history
      const historyItem = {
        id: "w_" + Date.now(),
        type: "word",
        text: data.text,
        translation: data.translation,
        sentence: data.sentence,
        favorite: isFav,
        timestamp: Date.now()
      };
      await API.saveHistory(historyItem);
      state.history = await API.getHistory();
      updateFavBtnUI(favWordBtn, isFav);
    } catch (e) {
      setLoading(wordGenBtn, false, "⚡ AI 簡單造句 & 重複聽播");
      console.error(e);
      alert("生成失敗，請稍後重試。");
    }
  }

  function renderWordResult(item) {
    state.activeItem = item;
    wordResultArea.style.display = "block";
    wordResultArea.scrollIntoView({ behavior: "smooth", block: "nearest" });

    document.getElementById("res-word-title").textContent = item.text;
    document.getElementById("res-word-pos").textContent = item.pos || "";
    document.getElementById("res-word-phonetic").textContent = item.phonetic || "";
    document.getElementById("res-word-translation").textContent = item.translation || "";

    const sentEl = document.getElementById("res-word-sentence");
    sentEl.textContent = item.sentence || "";
    sentEl.dataset.fulltext = item.sentence || "";
    document.getElementById("res-word-sent-trans").textContent = item.sentence_translation || "";

    // Check favorite status
    const isFav = state.history.some(h => h.text.toLowerCase() === item.text.toLowerCase() && h.favorite);
    updateFavBtnUI(favWordBtn, isFav);

    // Alternative sentence
    const altBox = document.getElementById("res-word-alt-box");
    if (item.alternative_sentence) {
      altBox.style.display = "block";
      const altSentEl = document.getElementById("res-word-alt-sent");
      altSentEl.textContent = item.alternative_sentence;
      altSentEl.dataset.fulltext = item.alternative_sentence;
      document.getElementById("res-word-alt-trans").textContent = item.alternative_translation || "";

      document.getElementById("play-alt-sent-btn").onclick = () => {
        startShadowingTarget(item.alternative_sentence, altSentEl);
      };
    } else {
      altBox.style.display = "none";
    }

    if (item.shadowing_tips) {
      document.getElementById("res-word-tips").textContent = item.shadowing_tips;
      document.getElementById("res-word-tips-box").style.display = "flex";
    } else {
      document.getElementById("res-word-tips-box").style.display = "none";
    }

    // Default load simple sentence into player
    startShadowingTarget(item.sentence, sentEl);
  }

  // Favorite toggle for Word
  if (favWordBtn) {
    favWordBtn.addEventListener("click", async () => {
      if (!state.activeItem) return;
      const isFav = await API.toggleFavorite(state.activeItem.id, state.activeItem.text, {
        id: state.activeItem.id || "w_" + Date.now(),
        type: "word",
        text: state.activeItem.text,
        translation: state.activeItem.translation,
        sentence: state.activeItem.sentence,
        favorite: true,
        timestamp: Date.now()
      });
      state.history = await API.getHistory();
      updateFavBtnUI(favWordBtn, isFav);
    });
  }

  function updateFavBtnUI(btn, isFav) {
    if (!btn) return;
    btn.classList.toggle("is-fav", !!isFav);
    const starEl = btn.querySelector(".fav-star");
    const textEl = btn.querySelector(".fav-text");
    if (starEl) starEl.textContent = isFav ? "★" : "⭐";
    if (textEl) textEl.textContent = isFav ? "已在我的最愛" : "加入最愛";
  }

  // ==========================================
  // REQUIREMENT 3: PODCAST 1314 PHRASES HUB
  // ==========================================
  const podcastCardsGrid = document.getElementById("podcast-cards-grid");
  const podcastSearch = document.getElementById("podcast-search");
  const refreshRecommendBtn = document.getElementById("refresh-recommend-btn");

  // Category filters
  document.querySelectorAll(".category-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.podcastFilter.category = pill.dataset.category;
      renderPodcastCards();
    });
  });

  // Level filters
  document.querySelectorAll(".level-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".level-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.podcastFilter.level = pill.dataset.level;
      renderPodcastCards();
    });
  });

  if (podcastSearch) {
    podcastSearch.addEventListener("input", (e) => {
      state.podcastFilter.search = e.target.value.toLowerCase().trim();
      renderPodcastCards();
    });
  }

  if (refreshRecommendBtn) {
    refreshRecommendBtn.addEventListener("click", () => {
      refreshRecommendBtn.classList.add("rotating");
      setTimeout(() => {
        refreshRecommendBtn.classList.remove("rotating");
        PODCAST_1314_PHRASES.sort(() => Math.random() - 0.5);
        renderPodcastCards();
      }, 300);
    });
  }

  function renderPodcastCards() {
    if (!podcastCardsGrid) return;
    podcastCardsGrid.innerHTML = "";

    const filtered = PODCAST_1314_PHRASES.filter(p => {
      const matchCat = state.podcastFilter.category === "all" || p.category === state.podcastFilter.category;
      const matchLevel = state.podcastFilter.level === "all" || p.level === state.podcastFilter.level;
      const matchSearch = !state.podcastFilter.search || 
        p.text.toLowerCase().includes(state.podcastFilter.search) || 
        p.translation.toLowerCase().includes(state.podcastFilter.search) ||
        p.explanation.toLowerCase().includes(state.podcastFilter.search);
      return matchCat && matchLevel && matchSearch;
    });

    if (filtered.length === 0) {
      podcastCardsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>沒有找到符合條件的片語，試試搜尋其他關鍵字或切換類別！</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const isFav = state.history.some(h => h.text.toLowerCase() === item.text.toLowerCase() && h.favorite);
      const card = document.createElement("div");
      card.className = "podcast-card";
      card.innerHTML = `
        <div class="card-header">
          <span class="card-category-badge">${item.category}</span>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="card-level-badge level-${item.level.toLowerCase()}">${item.level}</span>
            <button class="card-fav-btn ${isFav ? 'is-fav' : ''}" title="${isFav ? '點擊取消最愛' : '加入我的最愛'}" data-text="${escapeHtml(item.text)}">
              ${isFav ? '★' : '☆'}
            </button>
          </div>
        </div>
        <div class="card-title">${escapeHtml(item.text)}</div>
        <div class="card-translation">${escapeHtml(item.translation)}</div>
        <p class="card-explanation">${escapeHtml(item.explanation)}</p>
        <div class="card-sentence-box">
          <div class="card-sentence-text">"${escapeHtml(item.sentence)}"</div>
          <div class="card-sentence-trans">${escapeHtml(item.sentence_translation)}</div>
        </div>
        <div class="card-footer">
          <button class="shadow-now-btn" data-id="${item.id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            🎧 立即跟讀
          </button>
          <button class="quick-play-btn" title="快速聆聽例句" data-sentence="${escapeHtml(item.sentence)}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </div>
      `;

      // Favorite click on podcast card
      const favBtn = card.querySelector(".card-fav-btn");
      favBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newFav = await API.toggleFavorite(item.id, item.text, {
          id: item.id,
          type: "phrase",
          text: item.text,
          translation: item.translation,
          sentence: item.sentence,
          favorite: true,
          timestamp: Date.now()
        });
        favBtn.classList.toggle("is-fav", newFav);
        favBtn.textContent = newFav ? "★" : "☆";
        favBtn.title = newFav ? "點擊取消最愛" : "加入我的最愛";
        state.history = await API.getHistory();
      });

      // Card action 1: Switch to Phrase tab & launch full shadowing
      card.querySelector(".shadow-now-btn").addEventListener("click", () => {
        switchTab("phrase");
        phraseInput.value = item.text;
        renderPhraseResult(item);
      });

      // Card action 2: Quick play in place
      card.querySelector(".quick-play-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        window.shadowEngine.play(item.sentence, { repeatCount: 1 });
      });

      podcastCardsGrid.appendChild(card);
    });
  }

  // ==========================================
  // NOTEBOOK & FAVORITES (需求 1 升級)
  // ==========================================
  const historyList = document.getElementById("history-list");
  const clearHistoryBtn = document.getElementById("clear-history-btn");

  // History sub-filter pills
  document.querySelectorAll(".history-filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".history-filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.historyFilter = pill.dataset.filter;
      renderHistoryList();
    });
  });

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", async () => {
      if (confirm("確定要清除所有學習記錄嗎？（收藏也會被清空）")) {
        await API.deleteHistory();
        state.history = [];
        renderHistoryList();
      }
    });
  }

  function renderHistoryList() {
    if (!historyList) return;
    historyList.innerHTML = "";

    // Count statistics
    const totalCount = state.history.length;
    const favCount = state.history.filter(h => h.favorite).length;
    const phraseCount = state.history.filter(h => h.type === "phrase").length;
    const wordCount = state.history.filter(h => h.type === "word").length;

    const countAllEl = document.getElementById("count-all");
    const countFavEl = document.getElementById("count-fav");
    const countPhraseEl = document.getElementById("count-phrase");
    const countWordEl = document.getElementById("count-word");
    const statsBar = document.getElementById("history-stats-bar");

    if (countAllEl) countAllEl.textContent = totalCount;
    if (countFavEl) countFavEl.textContent = favCount;
    if (countPhraseEl) countPhraseEl.textContent = phraseCount;
    if (countWordEl) countWordEl.textContent = wordCount;
    if (statsBar) {
      statsBar.innerHTML = `共 <strong>${totalCount}</strong> 筆 • 🎧 片語 <strong>${phraseCount}</strong> 篇 • 🔤 單字 <strong>${wordCount}</strong> 個 • ⭐ 最愛 <strong>${favCount}</strong> 筆`;
    }

    // Filter items based on active sub-tab
    let filteredHistory = state.history;
    if (state.historyFilter === "fav") {
      filteredHistory = state.history.filter(h => h.favorite);
    } else if (state.historyFilter === "phrase") {
      filteredHistory = state.history.filter(h => h.type === "phrase");
    } else if (state.historyFilter === "word") {
      filteredHistory = state.history.filter(h => h.type === "word");
    }

    if (filteredHistory.length === 0) {
      let emptyMsg = "尚無學習記錄，趕快輸入片語或單字開始練習吧！";
      if (state.historyFilter === "fav") {
        emptyMsg = "目前還沒有加入「我的最愛」的片語或單字，點擊任何卡片上的 ⭐ 即可收藏！";
      } else if (state.historyFilter === "phrase") {
        emptyMsg = "目前尚無片語記錄，前往「片語跟讀」或「Podcast 1314 精選庫」展開練習吧！";
      } else if (state.historyFilter === "word") {
        emptyMsg = "目前尚無單字記錄，前往「單字簡單造句」輸入單字開始跟讀！";
      }

      historyList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${state.historyFilter === 'fav' ? '⭐' : '📖'}</div>
          <p>${emptyMsg}</p>
        </div>
      `;
      return;
    }

    filteredHistory.forEach(item => {
      const card = document.createElement("div");
      const isPhrase = item.type === "phrase";
      card.className = `history-card ${isPhrase ? 'type-phrase' : 'type-word'}`;
      const isFav = !!item.favorite;

      card.innerHTML = `
        <div class="history-badge ${isPhrase ? 'badge-phrase' : 'badge-word'}">
          ${isPhrase ? '🎧 片語' : '🔤 單字'}
        </div>
        <div class="history-content">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="history-title">${escapeHtml(item.text)}</span>
            <button class="card-fav-btn ${isFav ? 'is-fav' : ''}" title="${isFav ? '取消最愛' : '加入最愛'}">
              ${isFav ? '★' : '☆'}
            </button>
          </div>
          <div class="history-trans">${escapeHtml(item.translation || '')}</div>
          <div class="history-sent">"${escapeHtml(item.sentence || '')}"</div>
        </div>
        <div class="history-actions">
          <button class="history-play-btn" title="立即跟讀">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            跟讀
          </button>
          <button class="history-del-btn" title="刪除此筆">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      `;

      // Favorite toggle inside history card
      card.querySelector(".card-fav-btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        await API.toggleFavorite(item.id, item.text);
        state.history = await API.getHistory();
        renderHistoryList();
      });

      card.querySelector(".history-play-btn").addEventListener("click", () => {
        if (isPhrase) {
          switchTab("phrase");
          phraseInput.value = item.text;
          handlePhraseGenerate();
        } else {
          switchTab("word");
          wordInput.value = item.text;
          handleWordGenerate();
        }
      });

      card.querySelector(".history-del-btn").addEventListener("click", async () => {
        await API.deleteHistory(item.id);
        state.history = await API.getHistory();
        renderHistoryList();
      });

      historyList.appendChild(card);
    });
  }

  // ==========================================
  // MOBILE CONNECT & INSTALL MODAL (需求 3)
  // ==========================================
  if (openMobileBtn && mobileModal) {
    openMobileBtn.addEventListener("click", async () => {
      mobileModal.classList.add("open");
      if (mobileQrArea) {
        mobileQrArea.innerHTML = "<div style='color:#94a3b8;font-size:14px;padding:20px;text-align:center;'>正在取得本機 Wi-Fi 網址...</div>";
        const netInfo = await API.getNetworkInfo();
        mobileQrArea.innerHTML = createQRCodeSVG(netInfo.network_url, 180);
      }
    });
  }

  if (closeMobileBtn && mobileModal) {
    closeMobileBtn.addEventListener("click", () => {
      mobileModal.classList.remove("open");
    });
  }

  if (ackMobileBtn && mobileModal) {
    ackMobileBtn.addEventListener("click", () => {
      mobileModal.classList.remove("open");
    });
  }

  // ==========================================
  // CORE SHADOWING PLAYER INTEGRATION
  // ==========================================
  const playBtn = document.getElementById("player-play-btn");
  const stopBtn = document.getElementById("player-stop-btn");
  const rateSelect = document.getElementById("player-speed-select");
  const repeatSelect = document.getElementById("player-repeat-select");
  const intervalSelect = document.getElementById("player-interval-select");
  const playPhraseOnlyBtn = document.getElementById("play-phrase-only-btn");
  const playSentenceBtn = document.getElementById("play-sentence-btn");
  const playDialogueAllBtn = document.getElementById("play-dialogue-all-btn");

  if (rateSelect) {
    rateSelect.value = state.settings.rate;
    rateSelect.addEventListener("change", (e) => {
      const speed = parseFloat(e.target.value);
      window.shadowEngine.setRate(speed);
    });
  }

  if (repeatSelect) {
    repeatSelect.value = state.settings.repeatCount;
    repeatSelect.addEventListener("change", (e) => {
      window.shadowEngine.setRepeatCount(e.target.value);
    });
  }

  if (intervalSelect) {
    intervalSelect.value = state.settings.interval;
    intervalSelect.addEventListener("change", (e) => {
      window.shadowEngine.setInterval(parseFloat(e.target.value));
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (window.shadowEngine.isPlaying) {
        if (window.shadowEngine.isPaused) {
          window.shadowEngine.resume();
        } else {
          window.shadowEngine.pause();
        }
      } else {
        if (state.activePlaybackText) {
          startShadowingTarget(state.activePlaybackText, state.activeTargetElement);
        } else if (state.activeItem && state.activeItem.sentence) {
          startShadowingTarget(state.activeItem.sentence);
        }
      }
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      window.shadowEngine.stop();
    });
  }

  if (playPhraseOnlyBtn) {
    playPhraseOnlyBtn.addEventListener("click", () => {
      if (state.activeItem) {
        const textEl = document.getElementById("res-phrase-title");
        startShadowingTarget(state.activeItem.text, textEl);
      }
    });
  }

  if (playSentenceBtn) {
    playSentenceBtn.addEventListener("click", () => {
      if (state.activeItem && state.activeItem.sentence) {
        const sentEl = document.getElementById("res-phrase-sentence");
        startShadowingTarget(state.activeItem.sentence, sentEl);
      }
    });
  }

  if (playDialogueAllBtn) {
    playDialogueAllBtn.addEventListener("click", () => {
      if (state.activeItem && state.activeItem.dialogue) {
        const fullDialogue = state.activeItem.dialogue.map(d => `${d.speaker}: ${d.line}`).join(". ");
        startShadowingTarget(fullDialogue);
      }
    });
  }

  // Word specific buttons
  const playWordOnlyBtn = document.getElementById("play-word-only-btn");
  const playWordSentBtn = document.getElementById("play-word-sent-btn");

  if (playWordOnlyBtn) {
    playWordOnlyBtn.addEventListener("click", () => {
      if (state.activeItem) {
        const wordEl = document.getElementById("res-word-title");
        startShadowingTarget(state.activeItem.text, wordEl);
      }
    });
  }

  if (playWordSentBtn) {
    playWordSentBtn.addEventListener("click", () => {
      if (state.activeItem && state.activeItem.sentence) {
        const sentEl = document.getElementById("res-word-sentence");
        startShadowingTarget(state.activeItem.sentence, sentEl);
      }
    });
  }

  function startShadowingTarget(text, targetEl = null) {
    if (!text) return;
    state.activePlaybackText = text;
    state.activeTargetElement = targetEl;

    // Reset karaoke styling on old elements
    document.querySelectorAll(".karaoke-word").forEach(w => w.classList.remove("active-word"));

    if (targetEl) {
      wrapKaraokeWords(targetEl, text);
    }

    const currentTextDisplay = document.getElementById("player-current-text");
    if (currentTextDisplay) {
      currentTextDisplay.textContent = text;
    }

    window.shadowEngine.play(text);
  }

  function wrapKaraokeWords(el, text) {
    const words = text.split(/(\s+)/);
    el.innerHTML = "";
    let curIndex = 0;
    words.forEach(part => {
      if (part.trim() === "") {
        el.appendChild(document.createTextNode(part));
        curIndex += part.length;
      } else {
        const span = document.createElement("span");
        span.className = "karaoke-word";
        span.textContent = part;
        span.dataset.start = curIndex;
        span.dataset.end = curIndex + part.length;
        el.appendChild(span);
        curIndex += part.length;
      }
    });
  }

  function highlightKaraoke(charIndex, charLength) {
    if (!state.activeTargetElement || charIndex < 0) {
      document.querySelectorAll(".karaoke-word").forEach(w => w.classList.remove("active-word"));
      return;
    }

    const spans = state.activeTargetElement.querySelectorAll(".karaoke-word");
    spans.forEach(span => {
      const start = parseInt(span.dataset.start, 10);
      const end = parseInt(span.dataset.end, 10);
      if (charIndex >= start && charIndex <= end + 1) {
        span.classList.add("active-word");
      } else {
        span.classList.remove("active-word");
      }
    });
  }

  function updatePlayerUI(playbackState) {
    if (!playBtn) return;
    const playIcon = playBtn.querySelector(".play-icon");
    const pauseIcon = playBtn.querySelector(".pause-icon");

    if (playbackState.isPlaying && !playbackState.isPaused) {
      if (playIcon) playIcon.style.display = "none";
      if (pauseIcon) pauseIcon.style.display = "block";
      playBtn.classList.add("playing");
    } else {
      if (playIcon) playIcon.style.display = "block";
      if (pauseIcon) pauseIcon.style.display = "none";
      playBtn.classList.remove("playing");
    }

    const indicator = document.getElementById("player-mode-indicator");
    if (indicator) {
      if (playbackState.isPlaying) {
        if (playbackState.isIntervalWaiting) {
          indicator.textContent = "跟讀停頓中 (請模仿跟讀)";
          indicator.className = "player-status-badge status-waiting";
        } else {
          indicator.textContent = "母語音檔播放中 (仔細聆聽)";
          indicator.className = "player-status-badge status-playing";
        }
      } else {
        indicator.textContent = "準備就緒 (點擊播放開始跟讀)";
        indicator.className = "player-status-badge status-idle";
      }
    }
  }

  // ==========================================
  // VOICE RECORDER & AUDIO COMPARISON
  // ==========================================
  const micRecordBtn = document.getElementById("mic-record-btn");
  const playMyVoiceBtn = document.getElementById("play-my-voice-btn");
  const playNativeAgainBtn = document.getElementById("play-native-again-btn");
  const recordStatusText = document.getElementById("record-status-text");

  if (micRecordBtn) {
    micRecordBtn.addEventListener("click", async () => {
      if (window.voiceRecorder.isRecording) {
        window.voiceRecorder.stopRecording();
      } else {
        await window.voiceRecorder.startRecording();
      }
    });
  }

  if (playMyVoiceBtn) {
    playMyVoiceBtn.addEventListener("click", () => {
      window.voiceRecorder.playRecorded();
    });
  }

  if (playNativeAgainBtn) {
    playNativeAgainBtn.addEventListener("click", () => {
      if (state.activePlaybackText) {
        window.shadowEngine.play(state.activePlaybackText, { repeatCount: 1 });
      }
    });
  }

  window.voiceRecorder.onRecordStateChange = (recState) => {
    if (!micRecordBtn) return;
    if (recState.isRecording) {
      micRecordBtn.classList.add("recording");
      micRecordBtn.innerHTML = `
        <span class="recording-pulse"></span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="6" width="12" height="12"></rect></svg>
        結束錄音
      `;
      if (recordStatusText) recordStatusText.textContent = "🔴 正在錄音中，請跟讀說話...";
    } else {
      micRecordBtn.classList.remove("recording");
      micRecordBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        🎙️ 錄製我的跟讀
      `;
      if (recState.hasAudio) {
        if (recordStatusText) recordStatusText.textContent = "✅ 錄音完成！可點擊下方對比聽原音與您的發音：";
        if (playMyVoiceBtn) playMyVoiceBtn.style.display = "inline-flex";
        if (playNativeAgainBtn) playNativeAgainBtn.style.display = "inline-flex";
      }
    }
  };

  // ==========================================
  // SETTINGS MODAL
  // ==========================================
  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener("click", () => {
      const apiKeyInput = document.getElementById("settings-api-key");
      const rateInput = document.getElementById("settings-rate-input");
      const intervalInput = document.getElementById("settings-interval-input");
      const repeatInput = document.getElementById("settings-repeat-input");

      if (apiKeyInput) apiKeyInput.value = state.settings.apiKey || "";
      if (rateInput) rateInput.value = state.settings.rate;
      if (intervalInput) intervalInput.value = state.settings.interval;
      if (repeatInput) repeatInput.value = state.settings.repeatCount;

      settingsModal.classList.add("open");
    });
  }

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.remove("open");
    });
  }

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", async () => {
      const apiKeyInput = document.getElementById("settings-api-key");
      const voiceSelect = document.getElementById("settings-voice-select");
      const rateInput = document.getElementById("settings-rate-input");
      const intervalInput = document.getElementById("settings-interval-input");
      const repeatInput = document.getElementById("settings-repeat-input");

      const newSettings = {
        apiKey: apiKeyInput ? apiKeyInput.value.trim() : "",
        voiceName: voiceSelect ? voiceSelect.value : "",
        rate: rateInput ? parseFloat(rateInput.value) : 0.9,
        interval: intervalInput ? parseFloat(intervalInput.value) : 2.0,
        repeatCount: repeatInput ? repeatInput.value : 3
      };

      state.settings = await API.saveSettings(newSettings);
      window.shadowEngine.setRate(newSettings.rate);
      window.shadowEngine.setInterval(newSettings.interval);
      window.shadowEngine.setRepeatCount(newSettings.repeatCount);
      if (newSettings.voiceName) {
        window.shadowEngine.setVoiceByName(newSettings.voiceName);
      }

      settingsModal.classList.remove("open");
      alert("設定已儲存！");
    });
  }

  // Voice test button in settings
  const testVoiceBtn = document.getElementById("test-voice-btn");
  if (testVoiceBtn) {
    testVoiceBtn.addEventListener("click", () => {
      const voiceSelect = document.getElementById("settings-voice-select");
      if (voiceSelect) {
        window.shadowEngine.setVoiceByName(voiceSelect.value);
      }
      window.shadowEngine.play("Welcome to EchoShadow 1314! Let's practice English shadowing together.", { repeatCount: 1 });
    });
  }

  // Global Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

    if (e.code === "Space") {
      e.preventDefault();
      if (playBtn) playBtn.click();
    } else if (e.key === "Escape") {
      window.shadowEngine.stop();
    }
  });

  // Utilities
  function setLoading(btn, loading, text) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = text;
    btn.classList.toggle("loading", loading);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Auto-load recommended phrases on launch
  renderPodcastCards();
});
