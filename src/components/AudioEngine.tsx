// Real-time Procedural Audio Engine using browser WebAudio API
// No assets required, lightweight, zero-latency, and highly sci-fi

let audioCtx: AudioContext | null = null;
let ambientOscillator1: OscillatorNode | null = null;
let ambientOscillator2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let isMutedGlobal = false;
let globalVolume = 0.5; // Default volume level multiplier

function getAudioContext() {
  if (isMutedGlobal) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const AudioEngine = {
  setMute(mute: boolean) {
    isMutedGlobal = mute;
    if (mute && ambientGain && audioCtx) {
      ambientGain.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    } else if (!mute && ambientGain && audioCtx) {
      ambientGain.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.04 * globalVolume, audioCtx.currentTime + 1.0);
    }
  },

  isMuted() {
    return isMutedGlobal;
  },

  setVolume(vol: number) {
    globalVolume = Math.max(0, Math.min(1, vol));
    if (ambientGain && audioCtx && !isMutedGlobal) {
      ambientGain.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.04 * globalVolume, audioCtx.currentTime + 0.2);
    }
  },

  getVolume() {
    return globalVolume;
  },

  playClick() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, time);
    osc.frequency.exponentialRampToValueAtTime(150, time + 0.08);

    gain.gain.setValueAtTime(0.08 * globalVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.09);
  },

  playHover() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(2000, time);
    osc.frequency.exponentialRampToValueAtTime(1800, time + 0.03);

    gain.gain.setValueAtTime(0.015 * globalVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  },

  playGlitch() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    const duration = 0.15;
    
    // Create white noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(4000, time + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06 * globalVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(time);
    noiseSource.stop(time + duration);
  },

  playSuccess() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Arpeggio sound
    osc.frequency.setValueAtTime(523.25, time); // C5
    osc.frequency.setValueAtTime(659.25, time + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, time + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, time + 0.24); // C6

    gain.gain.setValueAtTime(0.05 * globalVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.05 * globalVolume, time + 0.24);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.45);
  },

  playSecret() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, time);
    osc.frequency.linearRampToValueAtTime(280, time + 0.8);
    osc.frequency.exponentialRampToValueAtTime(40, time + 1.2);

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(40, time);
    subOsc.frequency.linearRampToValueAtTime(140, time + 0.8);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.exponentialRampToValueAtTime(1200, time + 0.6);
    filter.frequency.exponentialRampToValueAtTime(150, time + 1.2);

    gain.gain.setValueAtTime(0.12 * globalVolume, time);
    gain.gain.linearRampToValueAtTime(0.12 * globalVolume, time + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + 1.2);
    subOsc.stop(time + 1.2);
  },

  startAmbientPad() {
    if (isMutedGlobal) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Avoid duplicating oscillators
    if (ambientOscillator1) return;

    const time = ctx.currentTime;
    ambientOscillator1 = ctx.createOscillator();
    ambientOscillator2 = ctx.createOscillator();
    ambientGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Soft low frequency detuned hum
    ambientOscillator1.type = "triangle";
    ambientOscillator1.frequency.setValueAtTime(55, time); // A1

    ambientOscillator2.type = "sine";
    ambientOscillator2.frequency.setValueAtTime(55.4, time); // detuned

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, time);

    // Elegant fade in on startAmbientPad
    ambientGain.gain.setValueAtTime(0.001, time);
    ambientGain.gain.exponentialRampToValueAtTime(0.04 * globalVolume, time + 1.5);

    ambientOscillator1.connect(filter);
    ambientOscillator2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOscillator1.start(time);
    ambientOscillator2.start(time);
  },

  stopAmbientPad() {
    if (ambientOscillator1 && ambientGain && audioCtx) {
      const time = audioCtx.currentTime;
      
      // Cancel scheduled values and fade out smoothly over 0.6 seconds
      ambientGain.gain.cancelScheduledValues(time);
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, time);
      ambientGain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
      
      const osc1 = ambientOscillator1;
      const osc2 = ambientOscillator2;
      
      // Delay stops to let audio fade out completely
      setTimeout(() => {
        try {
          osc1.stop();
          osc2?.stop();
        } catch (e) {
          // ignore
        }
      }, 700);
      
      ambientOscillator1 = null;
      ambientOscillator2 = null;
      ambientGain = null;
    }
  }
};
