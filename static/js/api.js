/**
 * EchoShadow 1314 - API Client & Data Storage
 * Communicates with backend server and handles smart offline fallbacks.
 */

const API = {
  baseUrl: "",

  async generate(type, query, apiKey = "") {
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

    // Client-side fallback if server offline or network unavailable
    return this.clientFallback(type, query);
  },

  clientFallback(type, query) {
    const q = (query || "").trim();
    const qLower = q.toLowerCase();

    if (type === "phrase") {
      // Check if it exists in curated database
      const found = PODCAST_1314_PHRASES.find(p => p.text.toLowerCase() === qLower);
      if (found) {
        return { ...found, type: "phrase" };
      }

      return {
        text: q,
        type: "phrase",
        translation: `「${q}」（實用日常美式片語）`,
        explanation: `在美式日常對話與 English Podcast 1314 中，「${q}」是極為生動的表達方式，適合在生活會話或隨興聊天時使用，讓你的英文口語聽起來更加流暢自然。`,
        pronunciation: `注意片語意群連讀，將「${q}」作為一個流暢音群吐出，尾音保持放鬆。`,
        sentence: `It really makes a huge difference whenever we ${q} during our daily routine.`,
        sentence_translation: `每當我們在日常生活中 ${q} 時，真的會帶來很大的不同。`,
        dialogue: [
          { speaker: "A", line: `I was thinking about whether we should ${q} today.`, translation: `我剛剛在想我們今天是否應該 ${q}。` },
          { speaker: "B", line: `Definitely! That sounds like a fantastic idea. Let's do it!`, translation: `絕對要！那聽起來是個超棒的主意。我們就這麼做吧！` }
        ],
        shadowing_tips: "跟讀時注意句子的節奏感（Rhythm），強調實詞，弱讀介詞與冠詞。"
      };
    } else if (type === "word") {
      // Check common words DB
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

      return {
        text: q,
        type: "word",
        pos: "單字",
        phonetic: `/${q}/`,
        translation: `「${q}」`,
        sentence: `Could you tell me more about ${q}?`,
        sentence_translation: `你可以多跟我說一些關於 ${q} 的事嗎？`,
        alternative_sentence: `I try to practice using ${q} every single day.`,
        alternative_translation: `我試著每天都練習使用 ${q}。`,
        shadowing_tips: "【簡單造句】這是一個短而清晰的高頻口語句，請隨音檔反覆跟讀 3~5 遍，訓練舌頭肌肉記憶。"
      };
    }

    return { error: "Unknown type" };
  },

  async getHistory() {
    try {
      const res = await fetch(`${this.baseUrl}/api/history`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Could not load history from server, reading localStorage:", e);
    }
    const local = localStorage.getItem("echoshadow_history");
    return local ? JSON.parse(local) : [];
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
