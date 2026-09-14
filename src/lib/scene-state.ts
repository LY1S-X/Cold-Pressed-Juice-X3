/**
 * The single mutable object the scroll choreography animates.
 *
 * Nothing here lives in React state — GSAP tweens these numbers directly and
 * the R3F frame loop reads them, so scrolling never triggers a re-render.
 *
 * Positions are *normalised to the viewport*, not world units:
 *   nx / ny  -1 → 1   (-1 = left / bottom edge, 1 = right / top edge)
 *   height            bottle height as a fraction of the visible height
 * This is what makes the same choreography work at 1440 and at 375.
 */
export type SceneState = {
  nx: number;
  ny: number;
  z: number;

  rx: number;
  ry: number;
  rz: number;

  height: number;

  /** Multipliers layered over RENDER_DEFAULTS. */
  keyMul: number;
  fillMul: number;
  rimMul: number;
  envMul: number;
  ambMul: number;
  exposureMul: number;
  shadowMul: number;

  /** Global fade for the product (used only at the very start). */
  opacity: number;
};

export const SCENE: SceneState = {
  nx: 0,
  ny: -0.06,
  z: 0,
  rx: 0,
  ry: -0.28,
  rz: 0,
  height: 0.86,
  keyMul: 1,
  fillMul: 1,
  rimMul: 1,
  envMul: 1,
  ambMul: 1,
  exposureMul: 1,
  shadowMul: 1,
  opacity: 1,
};

/** Ambient idle motion — subtle, never a continuous spin. */
export const IDLE = {
  enabled: true,
  amplitudeY: 0.055,
  amplitudeRot: 0.055,
  speed: 0.32,
};

export type ScenePose = Partial<SceneState>;
