declare module "canvas-confetti" {
  interface Options {
    particleCount?: number;
    startVelocity?: number;
    spread?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    zIndex?: number;
    disableForReducedMotion?: boolean;
    colors?: string[];
  }

  interface ConfettiFn {
    (options?: Options): Promise<undefined> | null;
    reset: () => void;
  }

  const confetti: ConfettiFn;
  export default confetti;
}
