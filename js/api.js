/**
 * EchoShadow 1314 - API Client & Data Storage
 * Communicates with backend server and handles smart offline fallbacks.
 */

const API = {
  baseUrl: "",

  async generate(type, query, apiKey = "") {
    // If on GitHub Pages or API key is provided, try direct Gemini API
    if (apiKey) {
      try {
        const directRes = await this.callGeminiDirect(type, query, apiKey);
        if (directRes) return directRes;
      } catch (err) {
        console.warn("Direct Gemini API error, falling back:", err);
      }
    }

    // Only try local backend if NOT on static github.io
    const isGitHubPages = window.location.hostname.endsWith("github.io");
    if (!isGitHubPages) {
      try {
        const res = await fetch(`${this.baseUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, query, apiKey })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn("Backend API unavailable, using client-side smart generation engine:", e);
      }
    }

    // Client-side fallback: works 100% on GitHub Pages with zero latency
    return await this.clientFallback(type, query);
  },

  /**
   * Real-time free translation engine (Google Translate endpoint with CORS *)
   */
  async translateText(text, targetLang = "zh-TW") {
    if (!text || !text.trim()) return "";
    const clean = text.trim();

    // 1. Check built-in quick dictionary
    if (typeof getBuiltinTranslation === "function") {
      const builtin = getBuiltinTranslation(clean);
      if (builtin) return builtin;
    }

    // 2. Fetch live translation
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&dt=bd&q=${encodeURIComponent(clean)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data[0] && Array.isArray(data[0])) {
          const trans = data[0].map(part => (part && part[0]) ? part[0] : "").join("").trim();
          if (trans && trans.toLowerCase() !== clean.toLowerCase()) {
            return trans;
          }
        }
      }
    } catch (e) {
      console.warn("Live translation error, falling back to local dictionary:", e);
    }

    // 3. Fallback
    return (typeof getBuiltinTranslation === "function" ? getBuiltinTranslation(clean) : "") || clean;
  },

  /**
   * Fetch dictionary phonetic and part-of-speech
   */
  async fetchDictionaryInfo(word) {
    const clean = word.trim().toLowerCase();
    const result = {
      phonetic: `/${clean}/`,
      pos: "常用單字",
      example: ""
    };

    // 1. Check COMMON_WORDS_DB
    if (typeof COMMON_WORDS_DB !== "undefined") {
      const found = COMMON_WORDS_DB.find(w => w.word.toLowerCase() === clean);
      if (found) {
        return {
          phonetic: found.phonetic || result.phonetic,
          pos: found.pos || result.pos,
          example: found.sentence || ""
        };
      }
    }

    // 2. Fetch from free dictionary API
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]) {
          const entry = data[0];
          if (entry.phonetic) {
            result.phonetic = entry.phonetic;
          } else if (entry.phonetics && entry.phonetics.length > 0) {
            const withText = entry.phonetics.find(p => p.text);
            if (withText) result.phonetic = withText.text;
          }

          if (entry.meanings && entry.meanings.length > 0) {
            const m = entry.meanings[0];
            if (m.partOfSpeech) {
              const posMap = {
                "noun": "n. 名詞",
                "verb": "v. 動詞",
                "adjective": "adj. 形容詞",
                "adverb": "adv. 副詞",
                "pronoun": "pron. 代名詞",
                "preposition": "prep. 介系詞",
                "conjunction": "conj. 連接詞",
                "interjection": "interj. 感嘆詞"
              };
              result.pos = posMap[m.partOfSpeech.toLowerCase()] || `${m.partOfSpeech}.`;
            }

            if (m.definitions && m.definitions.length > 0) {
              const defWithEx = m.definitions.find(d => d.example);
              if (defWithEx && defWithEx.example) {
                result.example = defWithEx.example;
              }
            }
          }
        }
      }
    } catch (e) {
      // Ignore network timeout
    }

    return result;
  },

  async clientFallback(type, query) {
    const q = (query || "").trim();
    const qLower = q.toLowerCase();

    if (type === "phrase") {
      // 1. Check curated database first
      if (typeof PODCAST_1314_PHRASES !== "undefined") {
        const found = PODCAST_1314_PHRASES.find(p => p.text.toLowerCase() === qLower);
        if (found) {
          return { ...found, type: "phrase" };
        }
      }

      // 2. Fetch real-time accurate translation
      let translation = await this.translateText(q);
      if (!translation || translation.toLowerCase() === qLower) {
        translation = (typeof getBuiltinTranslation === "function" ? getBuiltinTranslation(q) : "") || `「${q}」`;
      }

      // 3. Generate contextually natural sentence & dialogue
      let sentence = "";
      if (/^(can|could|would|should|do|does|did|is|are|how|what|why|where)\b/i.test(q)) {
        sentence = `${q}? Sure, please feel free to ask anytime.`;
      } else {
        sentence = `It really makes a huge difference whenever you learn to ${q} in daily conversations.`;
      }
      let sentenceTrans = await this.translateText(sentence);
      if (!sentenceTrans || sentenceTrans.includes(q)) {
        sentenceTrans = `在日常生活中，只要學會自然地說出「${translation}」，真的會帶來很大的不同。`;
      }

      const lineA = `Have you ever heard native speakers say "${q}" in casual chats?`;
      const lineB = `Absolutely! It simply means "${translation}". It's super natural and common!`;
      let lineATrans = await this.translateText(lineA);
      let lineBTrans = await this.translateText(lineB);

      return {
        text: q,
        type: "phrase",
        translation: translation,
        explanation: `在美式日常會話與 English Podcast 1314 中，「${q}」是非常實用道地的生活口語（${translation}），常出現在朋友閒聊或輕鬆對話中，能讓你的英文口語聽起來更加流暢自然。`,
        pronunciation: `注意片語意群連讀，將「${q}」作為一個流暢音群吐出，尾音保持放鬆。`,
        sentence: sentence,
        sentence_translation: sentenceTrans,
        dialogue: [
          { speaker: "A", line: lineA, translation: lineATrans || `你有聽過母語人士在聊天時說 "${q}" 嗎？` },
          { speaker: "B", line: lineB, translation: lineBTrans || `當然！意思就是「${translation}」，非常自然常見！` }
        ],
        shadowing_tips: "跟讀時注意句子的節奏感（Rhythm），強調實詞，弱讀介詞與冠詞。"
      };
    } else if (type === "word") {
      // 1. Check curated common words DB first
      if (typeof COMMON_WORDS_DB !== "undefined") {
        const foundWord = COMMON_WORDS_DB.find(w => w.word.toLowerCase() === qLower);
        if (foundWord) {
          return {
            text: foundWord.word,
            type: "word",
            pos: foundWord.pos,
            phonetic: foundWord.phonetic,
            translation: foundWord.translation,
            sentence: foundWord.sentence,
            sentence_translation: foundWord.sentence_translation,
            alternative_sentence: foundWord.alternative_sentence,
            alternative_translation: foundWord.alternative_translation,
            shadowing_tips: foundWord.shadowing_tips
          };
        }
      }

      // 2. Fetch real translation and dictionary info
      let translation = await this.translateText(q);
      if (!translation || translation.toLowerCase() === qLower) {
        translation = (typeof getBuiltinTranslation === "function" ? getBuiltinTranslation(q) : "") || `「${q}」`;
      }

      const dictInfo = await this.fetchDictionaryInfo(q);
      const pos = dictInfo.pos || "常用單字";
      const phonetic = dictInfo.phonetic || `/${q}/`;

      // 3. Craft simple, short, high-frequency sentences (6-12 words)
      let sentence = dictInfo.example;
      if (!sentence) {
        if (pos.includes("動詞") || pos.includes("v.")) {
          sentence = `I try to ${q} as much as possible every day.`;
        } else if (pos.includes("形容詞") || pos.includes("adj.")) {
          sentence = `She is always very ${q} whenever we work together.`;
        } else if (pos.includes("名詞") || pos.includes("n.")) {
          sentence = `This is a very important ${q} that we should discuss.`;
        } else {
          sentence = `Could you tell me more about ${q}?`;
        }
      }

      let sentenceTrans = await this.translateText(sentence);
      if (!sentenceTrans || sentenceTrans.includes(q)) {
        sentenceTrans = `你能多跟我分享一些關於「${translation}」的事情嗎？`;
      }

      const altSentence = `Practice saying '${q}' out loud to build muscle memory.`;
      let altTrans = await this.translateText(altSentence);
      if (!altTrans) {
        altTrans = `大聲開口練習說出「${translation}」，訓練口腔肌肉記憶。`;
      }

      return {
        text: q,
        type: "word",
        pos: pos,
        phonetic: phonetic,
        translation: translation,
        sentence: sentence,
        sentence_translation: sentenceTrans,
        alternative_sentence: altSentence,
        alternative_translation: altTrans,
        shadowing_tips: "【簡單造句練習】這是一個短而清晰的高頻口語句，請隨音檔反覆跟讀 3~5 遍，訓練舌頭肌肉記憶。"
      };
    }

    return { error: "Unknown type" };
  },

  async getHistory() {
    let items = [];
    try {
      const res = await fetch(`${this.baseUrl}/api/history`);
      if (res.ok) {
        items = await res.json();
      }
    } catch (e) {
      console.warn("Could not load history from server, reading localStorage:", e);
    }
    if (!items || items.length === 0) {
      const local = localStorage.getItem("echoshadow_history");
      items = local ? JSON.parse(local) : [];
    }

    // Auto-repair corrupt or placeholder translations in historical cache
    if (Array.isArray(items) && items.length > 0) {
      let changed = false;
      items.forEach(h => {
        const trans = (h.translation || "").trim();
        const isCorruptOrPlaceholder = !trans || trans.includes("???") || /^「.*」$/.test(trans) || trans.includes("（道地美式日常口語）");
        if (isCorruptOrPlaceholder && typeof getBuiltinTranslation === "function") {
          const builtin = getBuiltinTranslation(h.text);
          if (builtin) {
            h.translation = builtin;
            changed = true;
          }
        }
      });
      if (changed) {
        localStorage.setItem("echoshadow_history", JSON.stringify(items));
      }
    }
    return items;
  },

  async saveHistory(item) {
    try {
      await fetch(`${this.baseUrl}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
    } catch (e) {
      console.warn("Could not save to server, saving to localStorage:", e);
    }
    // Always sync with localStorage
    let local = await this.getHistory();
    const idx = local.findIndex(h => h.id === item.id || h.text.toLowerCase() === item.text.toLowerCase());
    if (idx >= 0) {
      local[idx] = item;
    } else {
      local.unshift(item);
    }
    local = local.slice(0, 200);
    localStorage.setItem("echoshadow_history", JSON.stringify(local));
    return local;
  },

  async toggleFavorite(id, text, item = null) {
    try {
      const res = await fetch(`${this.baseUrl}/api/history/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text, item })
      });
      if (res.ok) {
        const data = await res.json();
        // Update local cache
        let local = await this.getHistory();
        const found = local.find(h => (id && h.id === id) || (text && h.text.toLowerCase() === text.toLowerCase()));
        if (found) {
          found.favorite = data.favorite;
        } else if (item) {
          item.favorite = true;
          local.unshift(item);
        }
        localStorage.setItem("echoshadow_history", JSON.stringify(local));
        return data.favorite;
      }
    } catch (e) {
      console.warn("Could not toggle favorite on server, using localStorage:", e);
    }
    // Fallback in localStorage
    let local = await this.getHistory();
    const found = local.find(h => (id && h.id === id) || (text && h.text.toLowerCase() === text.toLowerCase()));
    let newStatus = true;
    if (found) {
      found.favorite = !found.favorite;
      newStatus = found.favorite;
    } else if (item) {
      item.favorite = true;
      local.unshift(item);
    }
    localStorage.setItem("echoshadow_history", JSON.stringify(local));
    return newStatus;
  },

  async getNetworkInfo() {
    try {
      const res = await fetch(`${this.baseUrl}/api/network-info`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Could not load network info from server:", e);
    }
    return {
      port: 8765,
      local_ip: window.location.hostname || "localhost",
      network_url: window.location.origin,
      local_url: "http://localhost:8765"
    };
  },

  async deleteHistory(id) {
    try {
      await fetch(`${this.baseUrl}/api/history?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
    } catch (e) {
      console.warn("Could not delete on server:", e);
    }
    let local = await this.getHistory();
    local = local.filter(h => String(h.id) !== String(id));
    localStorage.setItem("echoshadow_history", JSON.stringify(local));
    return local;
  },

  async getSettings() {
    try {
      const res = await fetch(`${this.baseUrl}/api/settings`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Could not load settings from server:", e);
    }
    const local = localStorage.getItem("echoshadow_settings");
    return local ? JSON.parse(local) : {
      rate: 0.9,
      interval: 2.0,
      repeatCount: 3,
      voiceName: "",
      apiKey: ""
    };
  },

  async saveSettings(settings) {
    try {
      await fetch(`${this.baseUrl}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
    } catch (e) {
      console.warn("Could not save settings to server:", e);
    }
    localStorage.setItem("echoshadow_settings", JSON.stringify(settings));
    return settings;
  }
};
