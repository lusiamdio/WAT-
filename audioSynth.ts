// Web Audio API Synthesizer for instant messenger sounds (No external audio file downloads needed)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleSound(enabled?: boolean) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    return this.soundEnabled;
  }

  public isSoundMuted(): boolean {
    return !this.soundEnabled;
  }

  public setMuted(muted: boolean) {
    this.soundEnabled = !muted;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  // Sent message chirp
  public playMessageSent() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Received message bubble pop / pleasant ding
  public playMessageReceived() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.06); // G5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.5, now + 0.04); // C6
    osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.14); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.04);
    osc1.stop(now + 0.12);
    osc2.stop(now + 0.22);
  }

  // Reaction pop
  public playReactionPop() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playPop() {
    this.playReactionPop();
  }

  // Call ringing tone
  private ringOsc1: OscillatorNode | null = null;
  private ringOsc2: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private ringInterval: any = null;

  public startRingingTone() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopRingingTone();

    const playRingCycle = () => {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now); // 440 Hz
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(480, now); // 480 Hz US/Matrix standard dial tone

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.setValueAtTime(0.1, now + 1.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
    };

    playRingCycle();
    this.ringInterval = setInterval(playRingCycle, 3500);
  }

  public stopRingingTone() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Call connected chime
  public playCallConnected() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.12, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.2);
    });
  }

  // Voice note recording start beep
  public playRecordBeep() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Voice note speech simulation synthesizer for interactive playback
  private voiceOsc: OscillatorNode | null = null;
  private voiceGain: GainNode | null = null;
  private voiceFilter: BiquadFilterNode | null = null;
  private voiceInterval: any = null;

  public startVoicePlayback(onProgress?: () => void) {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopVoicePlayback();

    try {
      // Create voice formant simulation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime); // Pitch around 160Hz for human voice baseline

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime); // Formant F1
      filter.Q.setValueAtTime(4.0, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      this.voiceOsc = osc;
      this.voiceGain = gain;
      this.voiceFilter = filter;

      // Modulate frequency to sound like natural spoken voice syllables
      const vowelFrequencies = [600, 1200, 850, 450, 1500, 700, 950, 1100, 500];
      let step = 0;

      this.voiceInterval = setInterval(() => {
        if (!this.voiceFilter || !this.ctx) return;
        step = (step + 1) % vowelFrequencies.length;
        const targetFreq = vowelFrequencies[step];
        const pitchJitter = 150 + Math.sin(step * 1.5) * 35;

        const now = this.ctx.currentTime;
        this.voiceOsc?.frequency.setTargetAtTime(pitchJitter, now, 0.04);
        this.voiceFilter?.frequency.setTargetAtTime(targetFreq, now, 0.06);

        if (onProgress) onProgress();
      }, 120);
    } catch (e) {
      console.warn('Voice playback synthesis error', e);
    }
  }

  public stopVoicePlayback() {
    if (this.voiceInterval) {
      clearInterval(this.voiceInterval);
      this.voiceInterval = null;
    }
    if (this.voiceGain && this.ctx) {
      try {
        this.voiceGain.gain.setValueAtTime(this.voiceGain.gain.value, this.ctx.currentTime);
        this.voiceGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      } catch (e) {}
    }
    setTimeout(() => {
      if (this.voiceOsc) {
        try {
          this.voiceOsc.stop();
          this.voiceOsc.disconnect();
        } catch (e) {}
        this.voiceOsc = null;
      }
      if (this.voiceGain) {
        try {
          this.voiceGain.disconnect();
        } catch (e) {}
        this.voiceGain = null;
      }
      if (this.voiceFilter) {
        try {
          this.voiceFilter.disconnect();
        } catch (e) {}
        this.voiceFilter = null;
      }
    }, 60);
  }

  // Scrub / Seek click tick
  public playSeekTick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  // Soft pleasant chime for archiving/unarchiving/pinning
  public playChime() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.07); // G5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Archive slide sound
  public playArchiveSound() {
    this.playChime();
  }
}

export const soundEngine = new SoundEngine();
