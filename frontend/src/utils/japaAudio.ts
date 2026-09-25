/**
 * Bulletproof Japa Chime Sound Engine
 * Dual-tier audio synthesis combining Web Audio API AudioBuffer with instant
 * HTML5 Audio backup to prevent audio context muting, sleeping, or dropouts.
 */

const SAMPLE_RATE = 44100;
const BEAD_DURATION = 0.32;
const COMPLETE_DURATION = 1.15;

function generateWavBlob(
  sampleRate: number,
  duration: number,
  sampleFn: (t: number) => number
): Blob {
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // 'RIFF' chunk
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + numSamples * 2, true);
  view.setUint32(8, 0x57415645, false);

  // 'fmt ' chunk
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);

  // 'data' chunk
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const s = Math.max(-1, Math.min(1, sampleFn(t)));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// Resonant Tibetan temple singing bowl / bronze bell chime
function beadSampleGenerator(t: number): number {
  const attack = Math.min(1, t / 0.0025); // 2.5ms soft attack avoids clicks
  const decay = Math.exp(-t / 0.08);     // warm natural resonance
  const f1 = Math.sin(2 * Math.PI * 587.33 * t);       // D5 fundamental
  const f2 = Math.sin(2 * Math.PI * 880.00 * t) * 0.45; // A5 harmonic
  const f3 = Math.sin(2 * Math.PI * 1174.66 * t) * 0.22; // D6 overtone
  const f4 = Math.sin(2 * Math.PI * 1760.00 * t) * 0.08; // subtle brass shimmer
  return (f1 + f2 + f3 + f4) * 0.85 * attack * decay;
}

// Ascending sacred Solfeggio triad for 108 completion (396Hz -> 528Hz -> 639Hz)
function completeSampleGenerator(t: number): number {
  let sample = 0;
  // Tone 1: 396 Hz (Root)
  if (t >= 0 && t < 0.65) {
    const dt = t;
    const env = Math.min(1, dt / 0.005) * Math.exp(-dt / 0.18);
    sample += Math.sin(2 * Math.PI * 396 * dt) * 0.65 * env;
  }
  // Tone 2: 528 Hz (Transformation / Heart)
  if (t >= 0.16 && t < 0.85) {
    const dt = t - 0.16;
    const env = Math.min(1, dt / 0.005) * Math.exp(-dt / 0.20);
    sample += Math.sin(2 * Math.PI * 528 * dt) * 0.70 * env;
  }
  // Tone 3: 639 Hz (Harmony / Crown)
  if (t >= 0.34 && t < 1.15) {
    const dt = t - 0.34;
    const env = Math.min(1, dt / 0.005) * Math.exp(-dt / 0.26);
    sample += Math.sin(2 * Math.PI * 639 * dt) * 0.75 * env;
  }
  return Math.max(-1, Math.min(1, sample));
}

class JapaAudioEngine {
  private ctx: AudioContext | null = null;
  private beadAudioBuffer: AudioBuffer | null = null;
  private completeAudioBuffer: AudioBuffer | null = null;
  private beadAudioPool: HTMLAudioElement[] = [];
  private beadPoolIndex = 0;
  private completeAudioElement: HTMLAudioElement | null = null;
  private initialized = false;

  public init(): void {
    if (this.initialized) return;
    this.initialized = true;

    try {
      // 1. Pre-generate WAV blobs and URLs for instant HTML5 Audio fallback
      const beadBlob = generateWavBlob(SAMPLE_RATE, BEAD_DURATION, beadSampleGenerator);
      const beadUrl = URL.createObjectURL(beadBlob);

      const completeBlob = generateWavBlob(SAMPLE_RATE, COMPLETE_DURATION, completeSampleGenerator);
      const completeUrl = URL.createObjectURL(completeBlob);

      // Pre-warm a 3-element pool of HTML5 audio for rapid consecutive taps
      for (let i = 0; i < 3; i++) {
        const audio = new Audio(beadUrl);
        audio.preload = 'auto';
        audio.volume = 0.85;
        this.beadAudioPool.push(audio);
      }

      this.completeAudioElement = new Audio(completeUrl);
      this.completeAudioElement.preload = 'auto';
      this.completeAudioElement.volume = 0.90;
    } catch (e) {
      console.warn('HTML5 Audio fallback init error:', e);
    }

    // 2. Initialize Web Audio Context and AudioBuffers if available
    this.setupWebAudio();
  }

  private setupWebAudio(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.ctx || this.ctx.state === 'closed') {
        this.ctx = new AudioCtx();
      }

      if (this.ctx && !this.beadAudioBuffer) {
        // Pre-render Float32Array PCM samples directly into Web Audio AudioBuffer
        const beadSamples = Math.floor(SAMPLE_RATE * BEAD_DURATION);
        const beadBuf = this.ctx.createBuffer(1, beadSamples, SAMPLE_RATE);
        const beadData = beadBuf.getChannelData(0);
        for (let i = 0; i < beadSamples; i++) {
          beadData[i] = beadSampleGenerator(i / SAMPLE_RATE);
        }
        this.beadAudioBuffer = beadBuf;

        const compSamples = Math.floor(SAMPLE_RATE * COMPLETE_DURATION);
        const compBuf = this.ctx.createBuffer(1, compSamples, SAMPLE_RATE);
        const compData = compBuf.getChannelData(0);
        for (let i = 0; i < compSamples; i++) {
          compData[i] = completeSampleGenerator(i / SAMPLE_RATE);
        }
        this.completeAudioBuffer = compBuf;
      }
    } catch (e) {
      console.warn('Web Audio setup error:', e);
    }
  }

  public unlock(): void {
    this.init();
    try {
      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        } else if (this.ctx.state === 'closed') {
          this.setupWebAudio();
        }
      }
    } catch {}
  }

  public playBeadChime(): void {
    this.unlock();

    let playedViaWebAudio = false;

    // First attempt: High-fidelity, zero-latency Web Audio buffer playback
    try {
      if (this.ctx && this.ctx.state === 'running' && this.beadAudioBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = this.beadAudioBuffer;

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = 0.85; // Clear, resonant volume

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        playedViaWebAudio = true;
      } else if (this.ctx && this.ctx.state === 'suspended') {
        // If context was suspended (e.g. between long chants), request resume for next tap
        this.ctx.resume().catch(() => {});
      }
    } catch (err) {
      console.warn('Web Audio bead chime play failed, using fallback:', err);
    }

    // Fail-safe backup: If Web Audio is suspended, interrupted, or unavailable,
    // immediately trigger the pre-rendered HTML5 Audio so NO sound is ever missed!
    if (!playedViaWebAudio && this.beadAudioPool.length > 0) {
      try {
        const audio = this.beadAudioPool[this.beadPoolIndex];
        this.beadPoolIndex = (this.beadPoolIndex + 1) % this.beadAudioPool.length;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch {}
    }
  }

  public playCompletionChime(): void {
    this.unlock();

    let playedViaWebAudio = false;

    try {
      if (this.ctx && this.ctx.state === 'running' && this.completeAudioBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = this.completeAudioBuffer;

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = 0.90;

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        playedViaWebAudio = true;
      } else if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (err) {
      console.warn('Web Audio completion chime play failed, using fallback:', err);
    }

    if (!playedViaWebAudio && this.completeAudioElement) {
      try {
        this.completeAudioElement.currentTime = 0;
        this.completeAudioElement.play().catch(() => {});
      } catch {}
    }
  }
}

// Global singleton instance
export const japaAudio = new JapaAudioEngine();
