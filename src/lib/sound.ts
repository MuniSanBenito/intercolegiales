import { useEffect } from 'react';

// Centralized sound system using Web Audio API (no audio files needed).
// Keeps sound preference in localStorage and persists across sessions.

const SOUND_PREF_KEY = 'intercolegiales_sound_enabled';

export function getSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem(SOUND_PREF_KEY);
    return saved !== null ? saved === 'true' : true;
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(SOUND_PREF_KEY, String(enabled));
  } catch {
    // ignore storage errors
  }
}

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctor();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Play a short synthesized tone with a given frequency range and duration.
function playTone(startFreq: number, endFreq: number, duration: number, volume = 0.12) {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore audio errors (e.g. context not ready)
  }
}

export const sound = {
  click() {
    playTone(800, 1400, 0.08);
  },
  hover() {
    playTone(500, 900, 0.04, 0.04);
  },
  success() {
    playTone(600, 1200, 0.15, 0.12);
    setTimeout(() => playTone(900, 1800, 0.15, 0.1), 80);
  },
  error() {
    playTone(300, 150, 0.2, 0.12);
  },
  open() {
    playTone(400, 800, 0.1, 0.08);
  },
  close() {
    playTone(700, 400, 0.1, 0.08);
  },
};

// Utility to attach click + hover sounds to any element via React props.
export function soundProps() {
  return {
    onClick: (e?: unknown) => {
      sound.click();
      return e;
    },
    onMouseEnter: () => sound.hover(),
    onFocus: () => sound.hover(),
  };
}

// Global scroll sound (subtle tick when passing sections) - optional.
export function useGlobalEffects() {
  useEffect(() => {
    return; // reserved for future global effects
  }, []);
}
