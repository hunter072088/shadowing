/**
 * EchoShadow 1314 - Voice Recorder & Audio Echo Comparison
 * Record user's pronunciation, play back and compare with native speaker.
 */

class ShadowingVoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
    this.isRecording = false;
    this.audioPlayer = new Audio();
    
    this.onRecordStateChange = null;
    this.onAudioReady = null;
  }

  async checkPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("您的瀏覽器不支援錄音功能 (MediaDevices API not supported)");
    }
  }

  async startRecording() {
    try {
      await this.checkPermission();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        if (this.audioUrl) {
          URL.revokeObjectURL(this.audioUrl);
        }
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        this.audioPlayer.src = this.audioUrl;

        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());

        if (this.onAudioReady) {
          this.onAudioReady(this.audioUrl, this.audioBlob);
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this._notifyState();
    } catch (err) {
      console.warn("Microphone access error:", err);
      alert("無法啟動麥克風：請確認您已允許瀏覽器使用麥克風權限。");
      this.isRecording = false;
      this._notifyState();
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this._notifyState();
    }
  }

  playRecorded() {
    if (this.audioUrl) {
      this.audioPlayer.currentTime = 0;
      this.audioPlayer.play();
    }
  }

  pauseRecorded() {
    this.audioPlayer.pause();
  }

  _notifyState() {
    if (this.onRecordStateChange) {
      this.onRecordStateChange({
        isRecording: this.isRecording,
        hasAudio: !!this.audioUrl
      });
    }
  }
}

window.voiceRecorder = new ShadowingVoiceRecorder();
