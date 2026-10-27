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

    this.initVoices();
  }

  initVoices() {
    const updateVoices = () => {
      const allVoices = this.synth.getVoices();
      // Filter English voices
      this.voices = allVoices.filter(v => v.lang.startsWith("en"));
      if (this.voices.length === 0) {
        this.voices = allVoices; // fallback
      }

      // Default prefer US English natural/neural voices
      if (!this.selectedVoice && this.voices.length > 0) {
        const preferred = this.voices.find(v => 
          (v.lang === "en-US" || v.lang === "en_US") && 
          (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Jenny") || v.name.includes("Samantha") || v.name.includes("David"))
        ) || this.voices.find(v => v.lang.startsWith("en-US")) || this.voices[0];
        
        this.selectedVoice = preferred;
      }

      if (this.onVoicesLoaded) {
        this.onVoicesLoaded(this.voices, this.selectedVoice);
      }
    };

    updateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  setVoiceByName(name) {
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

  play(text, options = {}) {
    if (!text || text.trim() === "") return;

    // Stop any existing session
    this.stop();

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
      utterance.lang = this.selectedVoice.lang;
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

      // Check if we should repeat
      if (this.currentIteration < this.repeatCount || this.repeatCount === Infinity) {
        this._startShadowingInterval();
      } else {
        // Finished all loops
        this.stop();
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech error:", e);
      if (this.isPlaying) {
        this.stop();
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
        interval: this.intervalSeconds
      });
    }
  }
}

// Global instance
window.shadowEngine = new ShadowingSpeechEngine();
