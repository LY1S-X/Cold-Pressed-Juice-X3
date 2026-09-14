/**
 * Centralised rendering configuration.
 *
 * These are the *base* values tuned in the dev-only Leva panel. The scroll
 * choreography applies multipliers on top of them (see scene-state.ts) so a
 * dark section can dim the key light without the base config being lost.
 *
 * Removing the debug UI is a one-line change: drop <DebugPanel /> from Stage.
 * Nothing else reads from Leva.
 */
export type ToneMap = "neutral" | "aces" | "agx" | "linear";

export type RenderConfig = {
  /** ACES crushes saturated albedo toward pastel — fatal for a product this
      orange. Khronos PBR Neutral is built to hold hue and saturation. */
  toneMapping: ToneMap;
  exposure: number;
  envIntensity: number;
  ambient: number;
  keyIntensity: number;
  fillIntensity: number;
  rimIntensity: number;
  topIntensity: number;
  shadowOpacity: number;
  shadowBlur: number;

  bottleRoughness: number;
  bottleClearcoat: number;
  bottleClearcoatRoughness: number;
  capRoughness: number;
  labelRoughness: number;
  labelClearcoat: number;
  condensationRoughness: number;
  juiceRoughness: number;
  labelOpacity: number;

  fov: number;
  camZ: number;
  camY: number;

  modelScale: number;
  modelTiltX: number;
  modelOffsetY: number;
};

/** Tuned against the real GLB — reads as satin PET with a printed wrap label. */
export const RENDER_DEFAULTS: RenderConfig = {
  toneMapping: "neutral",
  exposure: 1.06,
  envIntensity: 0.86,
  ambient: 0.09,
  keyIntensity: 2.0,
  fillIntensity: 0.55,
  rimIntensity: 1.9,
  topIntensity: 0.55,
  shadowOpacity: 0.62,
  shadowBlur: 0.85,

  bottleRoughness: 0.29,
  bottleClearcoat: 0.85,
  bottleClearcoatRoughness: 0.14,
  capRoughness: 0.44,
  labelRoughness: 0.48,
  labelClearcoat: 0.3,
  condensationRoughness: 0.08,
  juiceRoughness: 0.62,
  labelOpacity: 1,

  fov: 30,
  camZ: 3.6,
  camY: 0,

  modelScale: 1,
  modelTiltX: 0.02,
  modelOffsetY: 0,
};

/** Live, mutable copy. Leva writes here; the render loop reads here. */
export const RENDER: RenderConfig = { ...RENDER_DEFAULTS };

export function applyRenderConfig(patch: Partial<RenderConfig>) {
  Object.assign(RENDER, patch);
}

/**
 * Opt-in live handle, enabled with `?tune` on any build. The Leva panel is a
 * development convenience; this is what makes the same values adjustable
 * against a real production render before they are baked into the defaults.
 */
export function exposeForTuning() {
  if (typeof window === "undefined") return false;
  if (!new URLSearchParams(window.location.search).has("tune")) return false;
  (window as unknown as Record<string, unknown>).__CC_RENDER = RENDER;
  const w = window as unknown as Record<string, unknown>;
  void import("./scene-state").then((m) => {
    w.__CC_SCENE = m.SCENE;
  });
  void import("./gsap").then((m) => {
    w.__CC_GSAP = m.gsap;
    w.__CC_ST = m.ScrollTrigger;
  });
  (window as unknown as Record<string, unknown>).__CC_RENDER_DEFAULTS = RENDER_DEFAULTS;
  return true;
}
