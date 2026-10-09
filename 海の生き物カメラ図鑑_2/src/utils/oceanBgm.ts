// Web Audio API Bright & Playful Ocean Pop BGM Engine with Underwater Elements
// Synthesizes a cheerful, bouncy marine pop soundtrack for children.
// Blends bright toy-marimba/glockenspiel melodies with underwater wave swells,
// bubbling water pop effects, and crystalline marine chimes.
// Features automatic acoustic ducking for clear voice narration.

class OceanBgmEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private isDucked = false;

  private masterGain: GainNode | null = null;
  private duckingGain: GainNode | null = null;

  private stepTimer: number | null = null;
  private bubbleTimer: number | null = null;

  private noiseNode: AudioBufferSourceNode | null = null;
  private lfoOsc: OscillatorNode | null = null;

  private currentStep = 0;
  private currentBar = 0;

  // Happy bright chord progressions (Notes in Hz)
  // Bar 0: C Major (C4, E4, G4, C5)
  // Bar 1: F Major (F4, A4, C5, F5)
  // Bar 2: G Major (G4, B4, D5, G5)
  // Bar 3: C Major (C4, E4, G4, C5)
  private chordProgression = [
    { root: 261.63, chord: [261.63, 329.63, 392.00, 523.25] }, // C
    { root: 174.61, chord: [349.23, 440.00, 523.25, 698.46] }, // F
    { root: 196.00, chord: [392.00, 493.88, 587.33, 783.99] }, // G
    { root: 261.63, chord: [261.63, 329.63, 392.00, 523.25] }, // C
  ];

  // Playful melody note sequences (relative scale degrees)
  private melodyPatterns = [
    // Pattern A (Catchy bounce)
    [523.25, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 587.33], // C5, E5, G5, C6, A5, G5, E5, D5
    // Pattern B (Playful hop)
    [698.46, 880.00, 1046.50, 880.00, 783.99, 659.25, 587.33, 523.25], // F5, A5, C6, A5, G5, E5, D5, C5
    // Pattern C (Upbeat climb)
    [783.99, 987.77, 1174.66, 987.77, 1046.50, 880.00, 783.99, 659.25], // G5, B5, D6, B5, C6, A5, G5, E5
    // Pattern D (Sweet resolve)
    [1046.50, 880.00, 783.99, 659.25, 587.33, 659.25, 523.25, null],    // C6, A5, G5, E5, D5, E5, C5, rest
  ];

  // Crystalline marine water drop chimes
  private marineChimes = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00];

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public start() {
    this.initCtx();
    if (!this.ctx || this.isPlaying) return;

    try {
      this.isPlaying = true;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.12;

      // Voice Ducking Gain
      this.duckingGain = this.ctx.createGain();
      this.duckingGain.gain.value = this.isDucked ? 0.2 : 1.0;

      this.duckingGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // 1. Underwater Ocean Ambient Water Swell (Soft background sea current)
      this.setupUnderwaterWaveSwell();

      // 2. Start cheerful pop sequencer loop (Tempo: ~120 BPM, step = 250ms)
      this.currentStep = 0;
      this.currentBar = 0;
      this.stepTimer = window.setInterval(() => this.onSequencerStep(), 250);

      // 3. Start cute bubbling water pop & ocean chime generator
      this.bubbleTimer = window.setInterval(() => {
        this.playCuteBubblePop();
        if (Math.random() > 0.5) {
          this.playMarineWaterChime();
        }
      }, 1200);

    } catch (e) {
      console.warn("Ocean BGM initialization warning:", e);
    }
  }

  // Gentle underwater water wave swell noise background
  private setupUnderwaterWaveSwell() {
    if (!this.ctx || !this.duckingGain) return;

    // Buffer length: 4 seconds of smooth pink noise
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.02;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Underwater lowpass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 280;

    // Slow 6-second LFO swell simulating gentle ocean currents
    this.lfoOsc = this.ctx.createOscillator();
    this.lfoOsc.frequency.value = 0.16; // 6-sec wave motion
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 120; // sweeps 160Hz ~ 400Hz

    this.lfoOsc.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const waterGain = this.ctx.createGain();
    waterGain.gain.value = 0.25;

    this.noiseNode.connect(filter);
    filter.connect(waterGain);
    waterGain.connect(this.duckingGain);

    this.noiseNode.start();
    this.lfoOsc.start();
  }

  private onSequencerStep() {
    if (!this.ctx || !this.isPlaying || !this.duckingGain) return;

    const now = this.ctx.currentTime;
    const barData = this.chordProgression[this.currentBar];

    // 1. Play Soft Bouncy Bass on beat 0 and beat 4
    if (this.currentStep === 0 || this.currentStep === 4) {
      this.playPluckBass(barData.root, now);
    }

    // 2. Play Warm Underwater Chord Pad on beat 0
    if (this.currentStep === 0) {
      this.playSoftPad(barData.chord, now);
    }

    // 3. Play Bright Toy Marimba / Glockenspiel Melody Note
    const melodySeq = this.melodyPatterns[this.currentBar];
    const noteFreq = melodySeq[this.currentStep];
    if (noteFreq) {
      this.playMarimbaNote(noteFreq, now);
    }

    // Advance sequencer steps
    this.currentStep = (this.currentStep + 1) % 8;
    if (this.currentStep === 0) {
      this.currentBar = (this.currentBar + 1) % this.chordProgression.length;
    }
  }

  // Cute Marimba / Toy Glockenspiel note synthesizer
  private playMarimbaNote(freq: number, now: number) {
    if (!this.ctx || !this.duckingGain) return;

    // Main sine wave with subtle underwater vibrato/wobble
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Subtle 2nd harmonic for wooden marimba resonance
    const subOsc = this.ctx.createOscillator();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(freq * 2, now);

    const gain = this.ctx.createGain();
    const volume = this.isDucked ? 0.03 : 0.08;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35); // Bouncy snappy decay

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, now);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(filter);
    filter.connect(this.duckingGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 0.38);
    subOsc.stop(now + 0.38);
  }

  // Soft Bouncy Bassline synthesizer
  private playPluckBass(freq: number, now: number) {
    if (!this.ctx || !this.duckingGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq * 0.5, now); // Low octave

    const gain = this.ctx.createGain();
    const volume = this.isDucked ? 0.04 : 0.12;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, now);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.duckingGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Soft Ambient Chord Pad synthesizer
  private playSoftPad(chordFreqs: number[], now: number) {
    if (!this.ctx || !this.duckingGain) return;

    chordFreqs.forEach((freq) => {
      if (!this.ctx || !this.duckingGain) return;

      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 0.5, now);

      const gain = this.ctx.createGain();
      const volume = this.isDucked ? 0.01 : 0.035;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.4);
      gain.gain.linearRampToValueAtTime(0, now + 1.9);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(650, now);

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(this.duckingGain);

      osc.start(now);
      osc.stop(now + 2.0);
    });
  }

  // Cute water bubble pop sound effect generator (puku-puku!)
  private playCuteBubblePop() {
    if (!this.ctx || !this.isPlaying || !this.duckingGain || this.isDucked) return;

    const now = this.ctx.currentTime;
    const isDoubleBubble = Math.random() > 0.4;

    const generateSinglePop = (delay: number) => {
      if (!this.ctx || !this.duckingGain) return;
      const t = now + delay;
      const startFreq = 350 + Math.random() * 250;
      const endFreq = startFreq + 350 + Math.random() * 250; // Rapid pitch upward sweep

      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.07);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.08);

      osc.connect(gain);
      gain.connect(this.duckingGain);

      osc.start(t);
      osc.stop(t + 0.09);
    };

    generateSinglePop(0);
    if (isDoubleBubble) {
      generateSinglePop(0.12); // "puku-puku" double pop
    }
  }

  // Crystalline marine water drop chime
  private playMarineWaterChime() {
    if (!this.ctx || !this.isPlaying || !this.duckingGain || this.isDucked) return;

    const now = this.ctx.currentTime;
    const freq = this.marineChimes[Math.floor(Math.random() * this.marineChimes.length)];

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2); // Water drop shimmer echo

    osc.connect(gain);
    gain.connect(this.duckingGain);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  public setDucked(ducked: boolean) {
    this.isDucked = ducked;
    if (!this.ctx || !this.duckingGain) return;

    const now = this.ctx.currentTime;
    const targetValue = ducked ? 0.18 : 1.0; // Automatically soften music during voice narration
    this.duckingGain.gain.cancelScheduledValues(now);
    this.duckingGain.gain.linearRampToValueAtTime(targetValue, now + (ducked ? 0.15 : 0.6));
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.12, now + 0.3);
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public stop() {
    this.isPlaying = false;
    if (this.stepTimer) clearInterval(this.stepTimer);
    if (this.bubbleTimer) clearInterval(this.bubbleTimer);

    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (_) {}
      this.ctx = null;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const oceanBgm = new OceanBgmEngine();
