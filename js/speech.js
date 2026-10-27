/**
 * EchoShadow 1314 - Web Speech API & Shadowing Loop Engine
 * Precision TTS, karaoke-style word highlighting, loop playback with shadowing intervals.
 */

class ShadowingSpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
    this.rate = 0.9;
    this.pitch = 1.0;
    this.repeatCount = 3; // 1, 3, 5, 10, or Infinity
    this.intervalSeconds = 2.0; // Shadowing pause between repetitions
    
    // Playback state
    this.isPlaying = false;
    this.isPaused = false;
    this.isIntervalWaiting = false;
    this.currentIteration = 0;
    this.currentText = "";
    this.currentUtterance = null;
    this.intervalTimer = null;
    
    // Callbacks
    this.onStateChange = null;
    this.onProgress = null; // (currentLoop, totalLoops)
    this.onIntervalCountdown = null; // (secondsRemaining)
    this.onWordBoundary = null; // (charIndex, charLength)
    this.onSentenceFinish = null;
    this.onVoicesLoaded = null;

    // Multi-Item Playlist Loop State (Requirement 3)
    this.playlist = [];
    this.playlistIndex = 0;
    this.isPlaylistMode = false;
    this.playlistTransitionTimer = null;
    this.onPlaylistItemChange = null; // (item, index, total)

    this.initVoices();
  }

  initVoices() {
    const updateVoices = () => {
      const allVoices = this.synth ? this.synth.getVoices() : [];
      if (!allVoices || allVoices.length === 0) return false;

      // Filter English voices case-insensitively
      this.voices = allVoices.filter(v => {
        const lang = (v.lang || "").toLowerCase().replace(/_/g, "-");
        return lang.startsWith("en");
      });

      if (this.voices.length === 0) {
        this.voices = allVoices; // Fallback to all system voices
      }

      // Default prefer natural/neural US voices (Google US, Jenny, Samantha, Natural)
      if (!this.selectedVoice && this.voices.length > 0) {
        const preferred = this.voices.find(v => {
          const l = (v.lang || "").toLowerCase();
          const n = (v.name || "").toLowerCase();
          return (l.includes("en-us") || l.includes("en_us")) &&
                 (n.includes("natural") || n.includes("google") || n.includes("jenny") || n.includes("samantha") || n.includes("aria") || n.includes("guy"));
        }) || this.voices.find(v => (v.lang || "").toLowerCase().includes("en-us")) || this.voices[0];
        
        this.selectedVoice = preferred;
      }

      if (this.onVoicesLoaded) {
        this.onVoicesLoaded(this.voices, this.selectedVoice);
      }
      return true;
    };

    // Attempt immediate load
    updateVoices();

    // Listen to onvoiceschanged (standard)
    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.onvoiceschanged = () => {
        updateVoices();
      };

      // Periodic retry for Chrome Android & Safari where onvoiceschanged may delay or fail to fire
      let retries = 0;
      const timer = setInterval(() => {
        retries++;
        const loaded = updateVoices();
        if (loaded || retries >= 12) {
          clearInterval(timer);
        }
      }, 250);
    }
  }

  getAvailableVoices() {
    if (this.synth) {
      const all = this.synth.getVoices();
      if (all && all.length > 0) {
        const en = all.filter(v => (v.lang || "").toLowerCase().replace(/_/g, "-").startsWith("en"));
        this.voices = en.length > 0 ? en : all;
      }
    }
    return this.voices;
  }

  setVoiceByName(name) {
    if (!name) return false;
    const found = this.voices.find(v => v.name === name);
    if (found) {
      this.selectedVoice = found;
      return true;
    }
    return false;
  }

  setRate(rate) {
    this.rate = parseFloat(rate);
  }

  setInterval(seconds) {
    this.intervalSeconds = parseFloat(seconds);
  }

  setRepeatCount(count) {
    this.repeatCount = count === "inf" ? Infinity : parseInt(count, 10);
  }

  // ==========================================
  // PLAYLIST SHADOWING LOOP (Requirement 3)
  // ==========================================
  playPlaylist(items, options = {}) {
    if (!items || items.length === 0) return;
    this.stop();
    this.playlist = items.slice();
    this.playlistIndex = 0;
    this.isPlaylistMode = true;
    this._playPlaylistItem(0, options);
  }

  _playPlaylistItem(index, options = {}) {
    if (index < 0 || index >= this.playlist.length) {
      this.isPlaylistMode = false;
      this.stop();
      return;
    }

    this.playlistIndex = index;
    const item = this.playlist[index];
    
    // Determine shadowing text: prefer sentence, fallback to text / query / phrase / word
    const textToPlay = item.sentence || item.text || item.query || item.phrase || item.word || "";
    
    if (this.onPlaylistItemChange) {
      this.onPlaylistItemChange(item, this.playlistIndex, this.playlist.length);
    }

    this.play(textToPlay, {
      ...options,
      isFromPlaylist: true
    });
  }

  nextPlaylistItem() {
    if (!this.isPlaylistMode || this.playlist.length === 0) return;
    clearTimeout(this.playlistTransitionTimer);
    const nextIdx = this.playlistIndex + 1;
    if (nextIdx < this.playlist.length) {
      this._playPlaylistItem(nextIdx);
    } else {
      // Loop back to first item
      this._playPlaylistItem(0);
    }
  }

  prevPlaylistItem() {
    if (!this.isPlaylistMode || this.playlist.length === 0) return;
    clearTimeout(this.playlistTransitionTimer);
    const prevIdx = this.playlistIndex - 1;
    if (prevIdx >= 0) {
      this._playPlaylistItem(prevIdx);
    } else {
      this._playPlaylistItem(this.playlist.length - 1);
    }
  }

  _startPlaylistTransition() {
    this.isIntervalWaiting = true;
    this._notifyState();

    if (this.onIntervalCountdown) {
      this.onIntervalCountdown(1.5);
    }

    clearTimeout(this.playlistTransitionTimer);
    this.playlistTransitionTimer = setTimeout(() => {
      this.nextPlaylistItem();
    }, 1500);
  }

  play(text, options = {}) {
    if (!text || text.trim() === "") return;

    // Stop current speech
    if (!options.isFromPlaylist) {
      this.stop();
    } else {
      clearInterval(this.intervalTimer);
      clearTimeout(this.playlistTransitionTimer);
      if (this.synth) this.synth.cancel();
    }

    this.currentText = text.trim();
    if (options.rate !== undefined) this.rate = options.rate;
    if (options.repeatCount !== undefined) this.repeatCount = options.repeatCount;
    if (options.interval !== undefined) this.intervalSeconds = options.interval;

    this.isPlaying = true;
    this.isPaused = false;
    this.currentIteration = 1;

    this._notifyState();
    this._speakCurrentIteration();
  }

  _speakCurrentIteration() {
    if (!this.isPlaying) return;

    if (this.onProgress) {
      this.onProgress(this.currentIteration, this.repeatCount);
    }

    // Cancel anything pending in synth
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(this.currentText);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
      utterance.lang = this.selectedVoice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }

    // Word boundary event for Karaoke highlighting
    utterance.onboundary = (event) => {
      if (event.name === "word" && this.onWordBoundary) {
        this.onWordBoundary(event.charIndex, event.charLength || 5);
      }
    };

    utterance.onstart = () => {
      this._notifyState();
    };

    utterance.onend = () => {
      if (!this.isPlaying) return;

      if (this.onSentenceFinish) {
        this.onSentenceFinish(this.currentIteration, this.repeatCount);
      }

      // Check if we should repeat this sentence
      if (this.currentIteration < this.repeatCount || this.repeatCount === Infinity) {
        this._startShadowingInterval();
      } else {
        // Finished all loops for current sentence
        if (this.isPlaylistMode && this.playlist.length > 0) {
          // Playlist mode: pause briefly and advance to next item!
          this._startPlaylistTransition();
        } else {
          this.stop();
        }
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech error:", e);
      if (this.isPlaying) {
        if (this.isPlaylistMode) {
          this._startPlaylistTransition();
        } else {
          this.stop();
        }
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  _startShadowingInterval() {
    this.isIntervalWaiting = true;
    this._notifyState();

    let timeLeft = this.intervalSeconds;
    if (this.onIntervalCountdown) {
      this.onIntervalCountdown(timeLeft);
    }

    const stepMs = 100;
    const startTime = Date.now();
    const totalMs = this.intervalSeconds * 1000;

    clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(this.intervalTimer);
        return;
      }

      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(0, totalMs - elapsed);
      const remainingSec = (remainingMs / 1000).toFixed(1);

      if (this.onIntervalCountdown) {
        this.onIntervalCountdown(parseFloat(remainingSec));
      }

      if (remainingMs <= 0) {
        clearInterval(this.intervalTimer);
        this.isIntervalWaiting = false;
        this.currentIteration += 1;
        this._speakCurrentIteration();
      }
    }, stepMs);
  }

  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.isPaused = true;
      if (this.isIntervalWaiting) {
        clearInterval(this.intervalTimer);
      } else {
        this.synth.pause();
      }
      this._notifyState();
    }
  }

  resume() {
    if (this.isPlaying && this.isPaused) {
      this.isPaused = false;
      if (this.isIntervalWaiting) {
        this._startShadowingInterval();
      } else {
        this.synth.resume();
      }
      this._notifyState();
    }
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.isIntervalWaiting = false;
    clearInterval(this.intervalTimer);
    clearTimeout(this.playlistTransitionTimer);
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.onWordBoundary) {
      this.onWordBoundary(-1, 0); // Clear highlight
    }
    this._notifyState();
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else if (this.isPlaylistMode && this.playlist.length > 0) {
      this._playPlaylistItem(this.playlistIndex);
    } else if (this.currentText) {
      this.play(this.currentText);
    }
  }

  _notifyState() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        isIntervalWaiting: this.isIntervalWaiting,
        currentIteration: this.currentIteration,
        repeatCount: this.repeatCount,
        rate: this.rate,
        interval: this.intervalSeconds,
        isPlaylistMode: this.isPlaylistMode,
        playlistIndex: this.playlistIndex,
        playlistTotal: this.playlist ? this.playlist.length : 0
      });
    }
  }
}

// Global instance
window.shadowEngine = new ShadowingSpeechEngine();
