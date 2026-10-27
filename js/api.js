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
    return this.clientFallback(type, query);
  },

  async callGeminiDirect(type, query, apiKey) {
    let prompt = "";
    if (type === "phrase") {
      prompt = `你是一位專門設計「YouTube English Podcast 1314」風格的專業美式英語口說教練。用戶想要學習英語片語：「${query}」。請為此片語生成最道地、自然、適合跟讀的學習資料。請以繁體中文回答，並輸出純 JSON 格式：{"text":"${query}","type":"phrase","translation":"繁中翻譯","explanation":"Podcast 1314 風格的語境剖析","pronunciation":"發音與連音口訣","sentence":"Podcast風格生活化實用例句","sentence_translation":"例句繁中翻譯","dialogue":[{"speaker":"A","line":"A的自然對話","translation":"A的翻譯"},{"speaker":"B","line":"B的真實回覆","translation":"B的翻譯"}],"shadowing_tips":"跟讀建議"}`;
    } else if (type === "word") {
      prompt = `你是一位專業美語口說教學專家。用戶想要學習單字：「${query}」。用戶明確需求：【請簡單造句】，必須是日常生活高頻、口語化、簡單好讀、非常適合跟讀的句子（6-12字），不要複雜長難句！請以繁體中文回答，並輸出純 JSON 格式：{"text":"${query}","type":"word","pos":"詞性","phonetic":"KK音標或IPA","translation":"繁中解釋","sentence":"生活日常超實用的簡單造句","sentence_translation":"簡單造句繁中翻譯","alternative_sentence":"另一個簡單例句","alternative_translation":"另一個例句翻譯","shadowing_tips":"口說發音重點"}`;
    } else {
      return null;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      let clean = rawText.trim();
      if (clean.startsWith("```json")) clean = clean.slice(7);
      else if (clean.startsWith("```")) clean = clean.slice(3);
      if (clean.endsWith("```")) clean = clean.slice(0, -3);
      return JSON.parse(clean.trim());
    }
    return null;
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
