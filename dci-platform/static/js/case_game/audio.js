// OPERATION BLACKWOOD: OFFICIAL LOCKWOOD & CO. YOUTUBE AUDIO THEME ENGINE WITH INSTANT BOOT SCREEN AUTOPLAY

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.audioBuffer = null;
    this.sourceNode = null;
    this.muted = false;
    this.ambiencePlaying = false;
    
    // Native HTML5 Audio Player loaded with official Lockwood & Co. YouTube Audio Track (caY0MEok19I)
    this.bgAudio = new Audio('audio/lockwood_theme.webm');
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.4;
    this.bgAudio.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  async loadAudioBuffer() {
    try {
      this.init();
      const res = await fetch('audio/lockwood_theme.webm');
      const arrayBuf = await res.arrayBuffer();
      if (this.ctx) {
        this.audioBuffer = await this.ctx.decodeAudioData(arrayBuf);
      }
    } catch (e) {
      console.warn("Web Audio decode fallback:", e);
    }
  }

  startAmbience() {
    this.init();
    if (!this.bgAudio) return;

    this.bgAudio.muted = false;
    
    const playPromise = this.bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.ambiencePlaying = true;
        this.updateAmbienceButtonUI(true);
      }).catch(() => {
        this.playBufferDirectly();
      });
    }
  }

  playBufferDirectly() {
    if (this.ctx && this.audioBuffer && !this.sourceNode) {
      try {
        this.ctx.resume();
        this.sourceNode = this.ctx.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.loop = true;

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.4, this.ctx.currentTime);

        this.sourceNode.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        this.sourceNode.start(0);

        this.ambiencePlaying = true;
        this.updateAmbienceButtonUI(true);
      } catch (e) {}
    }
  }

  stopAmbience() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch (e) {}
      this.sourceNode = null;
    }
    this.ambiencePlaying = false;
    this.updateAmbienceButtonUI(false);
  }

  toggleAmbience() {
    if (this.ambiencePlaying && (!this.bgAudio.paused || this.sourceNode)) {
      this.stopAmbience();
    } else {
      this.startAmbience();
    }
  }

  updateAmbienceButtonUI(isPlaying) {
    const btn = document.getElementById('ambience-toggle-btn');
    if (btn) {
      if (isPlaying) {
        btn.className = "btn-audio-compact";
        btn.innerHTML = "🔊 SOUND";
        btn.title = "Click to mute Lockwood & Co. Theme";
      } else {
        btn.className = "btn-audio-compact muted";
        btn.innerHTML = "🔇 MUTED";
        btn.title = "Click to play Lockwood & Co. Theme";
      }
    }
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playStamp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playBeep(freq = 600, duration = 0.1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.duration);
  }

  playBuzzer() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

window.audioEngine = new AudioEngine();
