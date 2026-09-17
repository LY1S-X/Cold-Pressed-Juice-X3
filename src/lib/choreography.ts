"use client";

/**
 * The product choreography — one continuous path for the bottle through the
 * whole page. Every scene's first keyframe equals the previous scene's last
 * keyframe, so the motion never jumps at a section boundary no matter which
 * direction the user scrolls.
 *
 * Poses are viewport-normalised (see scene-state.ts), so the same table is
 * valid at every breakpoint; `adapt()` then tightens the travel and the
 * product size on smaller screens rather than shrinking the desktop layout.
 */

import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { SCENE, type ScenePose } from "@/lib/scene-state";
import { readDevice, prefersReducedMotion, type Device } from "@/lib/breakpoints";
import { THEMES, type SceneTheme } from "@/lib/brand";
import type { RefObject } from "react";

export type Keyframe = {
  /** Normalised position inside the section's scroll range, 0 → 1. */
  at: number;
  pose: ScenePose;
  /** Optional per-device overrides applied after adapt(). */
  mobile?: ScenePose;
  tablet?: ScenePose;
  ease?: string;
  /** Only the opening hero fits a reserved, responsive product column. */
  heroViewport?: boolean;
};

const NX = { desktop: 1, tablet: 0.95, mobile: 0.44 };
const H = { desktop: 1, tablet: 0.72, mobile: 0.74 };

/**
 * The pose table is authored against a full-bleed product, which makes the
 * numbers easy to reason about (1 = as tall as the viewport). This is the
 * headroom the editorial layout actually wants around it — one knob for the
 * product's presence on the page.
 */
const PRODUCT_FIT = 0.66;

function adapt(pose: ScenePose, device: Device): ScenePose {
  const out: ScenePose = { ...pose };
  if (device === "desktop") return out;
  if (typeof out.nx === "number") out.nx *= NX[device];
  if (typeof out.height === "number") out.height *= H[device];
  return out;
}

export function resolveKeyframe(k: Keyframe, device: Device): ScenePose {
  const base = adapt(k.pose, device);
  const override =
    device === "mobile" ? k.mobile : device === "tablet" ? k.tablet : undefined;
  const merged: ScenePose = override ? { ...base, ...override } : base;
  if (typeof merged.height === "number") merged.height *= PRODUCT_FIT;
  if (k.heroViewport && typeof window !== "undefined") {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const stacked = width < 768;
    const productTop = Math.max(height * 0.315, Math.max(100, height * 0.13) + width * 0.115 * 2.83 + 16);
    const productBottom = height * 0.695;
    Object.assign(merged, {
      nx: stacked ? 0 : 0.50,
      ny: stacked ? 1 - (productTop + productBottom) / height : 0.07,
      // Limit width as well as height on portrait tablets. The real model
      // is about 0.34 as wide as it is tall; allow room for its rotation.
      height: stacked ? Math.max(0.12, (productBottom - productTop) / height) : Math.min(0.68, (width * 0.25) / (height * 0.37)),
    });
  }
  return merged;
}

/* ------------------------------------------------------------------ */
/* The pose table — single source of truth                             */
/* ------------------------------------------------------------------ */

const LIGHT_NEUTRAL = {
  keyMul: 1,
  fillMul: 1,
  rimMul: 1,
  envMul: 1,
  ambMul: 1,
  exposureMul: 1,
  shadowMul: 1,
};

const LIGHT_ORANGE = {
  keyMul: 1.05,
  fillMul: 1.15,
  rimMul: 1.1,
  envMul: 1.05,
  ambMul: 1.1,
  exposureMul: 1.0,
  shadowMul: 0.55,
};

// Section 02's floating product: directional highlights, soft fill and rim.
const LIGHT_PRODUCT = {
  ...LIGHT_NEUTRAL,
  keyMul: 1.18,
  fillMul: 0.7,
  rimMul: 1.4,
  envMul: 1.1,
  exposureMul: 1.02,
  shadowMul: 0,
};

const LIGHT_FOREST = {
  keyMul: 1.1,
  fillMul: 0.8,
  rimMul: 1.55,
  envMul: 0.82,
  ambMul: 0.6,
  exposureMul: 0.98,
  shadowMul: 0.3,
};

const LIGHT_DRAMATIC = {
  keyMul: 1.2,
  fillMul: 0.5,
  rimMul: 1.9,
  envMul: 0.62,
  ambMul: 0.34,
  exposureMul: 0.95,
  shadowMul: 0.18,
};

/** Where the bottle rests as the hero finishes its intro. */
export const HERO_POSE: ScenePose = {
  nx: 0.50,
  ny: 0.07,
  z: 0,
  rx: 0,
  ry: -0.28,
  rz: 0,
  height: 0.68 / PRODUCT_FIT,
  opacity: 1,
  ...LIGHT_NEUTRAL,
  // Hero-only studio balance: brighter reflections and a defined lit edge,
  // with less flat fill. The existing exit restores the neutral light rig.
  exposureMul: 1.0,
  keyMul: 1.18,
  envMul: 1.12,
  fillMul: 0.72,
  rimMul: 1.3,
};

export const HERO_POSE_MOBILE: ScenePose = {
  nx: 0.06,
  ny: -0.2,
  height: 0.56,
  ry: -0.22,
};

/** Where the hero hands the product over to the first scrubbed scene. */
const HERO_EXIT: ScenePose = {
  nx: 0.25, ny: -0.24, z: 0, rx: 0, ry: -0.09, rz: -0.30, height: 0.93,
  ...LIGHT_NEUTRAL,
};
const HERO_EXIT_M: ScenePose = { nx: 0.12, ny: -0.16, height: 0.6, ry: -0.06, rz: -0.25 };

/* Hand-off poses. Each scene's last keyframe is the next scene's first, so the
   product keeps travelling through the 100vh in which one sticky panel scrolls
   away and the next scrolls in — the transition is part of the motion rather
   than a gap in it. */
const P_INGREDIENTS: ScenePose = {
  nx: -0.54, ny: 0.0, z: 0, height: 1.04, ry: 0.58, rz: -0.02, ...LIGHT_NEUTRAL,
};
const P_INGREDIENTS_M: ScenePose = { nx: -0.26, ny: -0.26, height: 0.66 };

const P_BENEFITS: ScenePose = {
  nx: 0.34, ny: 0.0, z: 0, height: 0.98, ry: -0.5, rz: 0.02, ...LIGHT_ORANGE,
};
const P_BENEFITS_M: ScenePose = { nx: 0.3, ny: -0.4, height: 0.5 };

const P_CLOSEUP: ScenePose = {
  nx: 0.3, ny: -0.36, z: 0, height: 1.08, ry: Math.PI, rz: 0.03, ...LIGHT_FOREST,
};
const P_CLOSEUP_M: ScenePose = { nx: 0.22, ny: -0.34, height: 0.58 };

const P_COLDPRESSED: ScenePose = {
  nx: 0.50, ny: 0.04, z: 0, height: 1.06, ry: -0.28, rz: 0,
  ...LIGHT_NEUTRAL, rimMul: 1.3, shadowMul: 0,
};
const P_COLDPRESSED_M: ScenePose = { nx: 0.38, ny: -0.32, height: 0.56 };
const P_COLDPRESSED_T: ScenePose = { nx: 0.50, ny: 0.04, height: 0.96 };

const P_STATEMENT: ScenePose = {
  nx: 0.48, ny: 0.0, z: 0, height: 0.96, ry: 0.56, rz: 0.03, ...LIGHT_NEUTRAL,
};
const P_STATEMENT_M: ScenePose = { nx: 0.26, ny: -0.28, height: 0.6 };

const P_STORY: ScenePose = {
  nx: -0.48, ny: 0.0, z: 0, height: 1.0, ry: -0.38, rz: -0.14, ...LIGHT_DRAMATIC,
};
const P_STORY_M: ScenePose = { nx: 0, ny: -0.47, height: 0.52 };

const P_FINALE: ScenePose = {
  nx: 0.62, ny: -0.3, z: 0, height: 0.54, ry: -0.52, rz: -0.04, ...LIGHT_NEUTRAL,
};
const P_FINALE_M: ScenePose = { nx: 0.34, ny: -0.36, height: 0.36 };

export const SCENES: Record<string, Keyframe[]> = {
  /* 1 — hero drift ---------------------------------------------------- */
  hero: [
    { at: 0, pose: { ...HERO_POSE }, mobile: { ...HERO_POSE_MOBILE }, heroViewport: true },
    { at: 1, pose: { ...HERO_EXIT }, mobile: { ...HERO_EXIT_M }, ease: "none" },
  ],

  /* 2 — product movement ---------------------------------------------- */
  movement: [
    { at: 0, pose: { ...HERO_EXIT }, mobile: { ...HERO_EXIT_M } },
    {
      at: 0.34,
      pose: { nx: 0.12, ny: 0.02, z: 0, height: 1.12, rx: 0, ry: -0.18, rz: -0.58, ...LIGHT_PRODUCT },
      mobile: { nx: 0, ny: -0.03, height: 0.72, rz: -0.48 },
      tablet: { nx: 0.12, height: 0.94 },
      ease: "power1.out",
    },
    {
      at: 0.62,
      pose: { nx: 0.06, ny: 0.02, z: 0, height: 1.12, rx: 0, ry: -0.08, rz: -0.62, ...LIGHT_PRODUCT },
      mobile: { nx: -0.02, ny: -0.03, height: 0.72, rz: -0.52 },
      tablet: { nx: 0.06, height: 0.94 },
      ease: "none",
    },
    { at: 1, pose: { ...P_INGREDIENTS }, mobile: { ...P_INGREDIENTS_M } },
  ],

  /* 3 — ingredients ---------------------------------------------------- */
  ingredients: [
    { at: 0, pose: { ...P_INGREDIENTS }, mobile: { ...P_INGREDIENTS_M } },
    {
      at: 0.2,
      pose: { nx: 0.44, ny: 0.07, height: 0.94, ry: -0.38, rz: 0.03, ...LIGHT_ORANGE },
      mobile: { nx: 0.26, ny: -0.28, height: 0.6 },
      ease: "power2.inOut",
    },
    {
      at: 0.41,
      pose: { nx: -0.06, ny: -0.03, height: 1.32, ry: 0.2, rz: -0.01, ...LIGHT_ORANGE },
      mobile: { nx: 0, ny: -0.22, height: 0.8 },
      ease: "power2.inOut",
    },
    {
      at: 0.62,
      pose: { nx: 0.5, ny: -0.06, height: 0.92, ry: -0.72, rz: 0.04, ...LIGHT_ORANGE },
      mobile: { nx: 0.28, ny: -0.3, height: 0.6 },
      ease: "power2.inOut",
    },
    { at: 1, pose: { ...P_BENEFITS }, mobile: { ...P_BENEFITS_M }, ease: "power1.inOut" },
  ],

  /* 4 — benefits -------------------------------------------------------- */
  benefits: [
    { at: 0, pose: { ...P_BENEFITS }, mobile: { ...P_BENEFITS_M } },
    {
      at: 0.18,
      pose: { nx: 0.42, ny: 0.0, height: 1.08, ry: 0.28, rz: 0, ...LIGHT_FOREST, shadowMul: 0.8 },
      mobile: { nx: 0, ny: 0.1, height: 0.42 },
      tablet: { nx: 0.42, ny: 0, height: 0.98 },
      ease: "power1.inOut",
    },
    {
      at: 0.70,
      pose: { nx: 0.42, ny: 0.0, height: 1.08, ry: 0.28, rz: 0, ...LIGHT_FOREST, shadowMul: 0.8 },
      mobile: { nx: 0, ny: 0.1, height: 0.42 },
      tablet: { nx: 0.42, ny: 0, height: 0.98 },
    },
    { at: 1, pose: { ...P_CLOSEUP }, mobile: { ...P_CLOSEUP_M }, ease: "power1.inOut" },
  ],

  /* 5 — product close-up ------------------------------------------------ */
  closeup: [
    { at: 0, pose: { ...P_CLOSEUP }, mobile: { ...P_CLOSEUP_M } },
    {
      at: 0.34,
      pose: {
        nx: 0.06, ny: 0.0, z: 0, height: 1.06, ry: Math.PI, rz: 0.0,
        ...LIGHT_FOREST, rimMul: 1.7, shadowMul: 0.7,
      },
      mobile: { nx: 0.48, ny: 0.2, height: 0.52 },
      ease: "power1.inOut",
    },
    {
      at: 0.72,
      pose: {
        nx: 0.06, ny: 0.0, z: 0, height: 1.06, ry: Math.PI, rz: 0,
        ...LIGHT_FOREST, rimMul: 1.8, envMul: 0.95, shadowMul: 0.7,
      },
      mobile: { nx: 0.48, ny: 0.2, height: 0.52 },
      ease: "power1.inOut",
    },
    { at: 1, pose: { ...P_COLDPRESSED }, mobile: { ...P_COLDPRESSED_M }, tablet: { ...P_COLDPRESSED_T }, ease: "power1.inOut" },
  ],

  /* 6 — why cold pressed ------------------------------------------------- */
  coldPressed: [
    { at: 0, pose: { ...P_COLDPRESSED }, mobile: { ...P_COLDPRESSED_M }, tablet: { ...P_COLDPRESSED_T } },
    {
      at: 0.14,
      pose: { ...P_COLDPRESSED },
      mobile: { ...P_COLDPRESSED_M },
      tablet: { ...P_COLDPRESSED_T },
      ease: "power2.out",
    },
    {
      at: 0.78,
      pose: { ...P_COLDPRESSED },
      mobile: { ...P_COLDPRESSED_M },
      tablet: { ...P_COLDPRESSED_T },
      ease: "power1.inOut",
    },
    { at: 1, pose: { ...P_STATEMENT }, mobile: { ...P_STATEMENT_M }, ease: "power1.inOut" },
  ],

  /* 7 — brand statement --------------------------------------------------- */
  statement: [
    { at: 0, pose: { ...P_STATEMENT }, mobile: { ...P_STATEMENT_M } },
    {
      at: 0.34,
      pose: { nx: 0.0, ny: -0.21, height: 0.97, ry: -0.12, rz: -0.15, ...LIGHT_DRAMATIC },
      mobile: { nx: 0, ny: -0.18, height: 0.82 },
      tablet: { nx: 0, ny: -0.24, height: 0.87 },
      ease: "power2.inOut",
    },
    {
      at: 0.72,
      pose: { nx: 0.0, ny: -0.21, height: 0.97, ry: -0.12, rz: -0.15, ...LIGHT_DRAMATIC },
      mobile: { nx: 0, ny: -0.18, height: 0.82 },
      tablet: { nx: 0, ny: -0.24, height: 0.87 },
      ease: "power1.inOut",
    },
    { at: 1, pose: { ...P_STORY }, mobile: { ...P_STORY_M }, ease: "power1.inOut" },
  ],

  /* 8 — brand story --------------------------------------------------------- */
  story: [
    { at: 0, pose: { ...P_STORY }, mobile: { ...P_STORY_M } },
    { at: 0.72, pose: { ...P_STORY }, mobile: { ...P_STORY_M } },
    { at: 1, pose: { ...P_FINALE }, mobile: { ...P_FINALE_M }, ease: "power1.inOut" },
  ],

  /* 9 — finale --------------------------------------------------------------- */
  finale: [
    { at: 0, pose: { ...P_FINALE }, mobile: { ...P_FINALE_M } },
    {
      at: 0.4,
      pose: { nx: 0.0, ny: -0.10, height: 0.7705, ry: -0.08, rz: 0.0, ...LIGHT_ORANGE },
      mobile: { nx: 0, ny: 0.08, height: 0.713 },
      ease: "power2.out",
    },
    {
      at: 0.72,
      pose: { nx: 0.0, ny: -0.10, height: 0.805, ry: 0.22, rz: 0.0, ...LIGHT_ORANGE },
      mobile: { nx: 0, ny: 0.08, height: 0.736 },
      ease: "power1.inOut",
    },
    {
      at: 1,
      pose: { nx: 0.0, ny: -0.10, height: 0.805, ry: 0.34, rz: 0.0, ...LIGHT_ORANGE },
      mobile: { nx: 0, ny: 0.08, height: 0.736 },
      ease: "none",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Theme (background colour-block) driver                              */
/* ------------------------------------------------------------------ */

const root = () => document.documentElement;

export function setTheme(t: SceneTheme) {
  const s = root().style;
  s.setProperty("--scene-bg", t.bg);
  s.setProperty("--scene-fg", t.fg);
  s.setProperty("--scene-dim", t.dim);
  s.setProperty("--scene-line", t.line);
}

/** Viewport-relative horizontal travel. Percentages of an element\'s own width
    push long words off-screen at large type sizes; this stays predictable. */
export const vw = (f: number) => () =>
  (typeof window === "undefined" ? 1440 : window.innerWidth) * f;

type RGB = { r: number; g: number; b: number };

function parse(hex: string): RGB {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/* Flat numbers on purpose: GSAP tweens own properties, not dotted paths, so a
   nested { bg: { r, g, b } } target silently never animates. */
const c0 = parse(THEMES.cream.bg);
const f0 = parse(THEMES.cream.fg);
const live = {
  br: c0.r, bg: c0.g, bb: c0.b,
  fr: f0.r, fg: f0.g, fb: f0.b,
  dim: 0.55,
  line: 0.14,
};

let themeTween: gsap.core.Tween | null = null;
let current: keyof typeof THEMES = "cream";

const r = Math.round;

function paint() {
  const s = root().style;
  s.setProperty("--scene-bg", `rgb(${r(live.br)}, ${r(live.bg)}, ${r(live.bb)})`);
  s.setProperty("--scene-fg", `rgb(${r(live.fr)}, ${r(live.fg)}, ${r(live.fb)})`);
  s.setProperty("--scene-dim", `rgba(${r(live.fr)}, ${r(live.fg)}, ${r(live.fb)}, ${live.dim})`);
  s.setProperty("--scene-line", `rgba(${r(live.fr)}, ${r(live.fg)}, ${r(live.fb)}, ${live.line})`);
}

const ALPHA: Record<keyof typeof THEMES, [number, number]> = {
  cream: [0.55, 0.14],
  beige: [0.55, 0.14],
  juice: [0.8, 0.34],
  forest: [0.64, 0.22],
  emerald: [0.72, 0.26],
  ink: [0.56, 0.18],
};

/** Smoothly cross-fades the page's colour block. */
export function tweenTheme(key: keyof typeof THEMES, duration = 0.55) {
  if (key === current) return;
  current = key;

  const t = THEMES[key];
  const b = parse(t.bg);
  const f = parse(t.fg);
  const [dim, line] = ALPHA[key];
  const next = { br: b.r, bg: b.g, bb: b.b, fr: f.r, fg: f.g, fb: f.b, dim, line };

  themeTween?.kill();

  if (prefersReducedMotion()) {
    Object.assign(live, next);
    paint();
    return;
  }

  themeTween = gsap.to(live, {
    ...next,
    duration,
    ease: "power2.inOut",
    onUpdate: paint,
  });
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

type SceneOptions = {
  /** Colour block this section owns. */
  theme?: keyof typeof THEMES;
  start?: string;
  end?: string;
  /** Extra DOM timeline built on the same scrubbed range. */
  build?: (tl: gsap.core.Timeline, device: Device) => void;
  /** Set false for sections that should stay opaque through their release. */
  fadeOut?: boolean;
  /** Timeline position where the section panels begin their release fade. */
  fadeAt?: number;
};

/**
 * Binds one section to the product choreography.
 * The returned timeline is normalised to duration 1 so keyframe `at`
 * values map straight onto scroll progress.
 */
export function useSceneChoreography(
  ref: RefObject<HTMLElement | null>,
  keys: Keyframe[],
  opts: SceneOptions = {},
) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const device = readDevice();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        /* No scrubbed parallax and no masked travel. The product still takes
           its pose for each scene, but it snaps rather than animating, and
           every element that would have been revealed is simply present. */
        gsap.set(el.querySelectorAll(".opacity-0"), { opacity: 1, clearProps: "transform" });

        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () =>
            Object.assign(SCENE, resolveKeyframe(keys[keys.length - 1], device)),
          onEnterBack: () => Object.assign(SCENE, resolveKeyframe(keys[0], device)),
        });

        if (opts.theme) {
          ScrollTrigger.create({
            trigger: el,
            start: "top 40%",
            end: "bottom 60%",
            onEnter: () => tweenTheme(opts.theme!),
            onEnterBack: () => tweenTheme(opts.theme!),
          });
        }

        /* A cross-dissolve is not vestibular motion, and without it two
           colour blocks would be legible through each other. */
        if (opts.fadeOut !== false) {
          const panels = el.querySelectorAll<HTMLElement>(
            ":scope > .layer-behind, :scope > .layer-front",
          );
          if (panels.length) {
            gsap.fromTo(
              panels,
              { opacity: 1 },
              {
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "bottom bottom",
                  end: "bottom 25%",
                  scrub: true,
                },
              },
            );
          }
        }
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? "top top",
          end: opts.end ?? "bottom top",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < keys.length; i++) {
        const from = resolveKeyframe(keys[i - 1], device);
        const to = resolveKeyframe(keys[i], device);
        const dur = Math.max(0.0001, keys[i].at - keys[i - 1].at);
        tl.fromTo(
          SCENE,
          keys[i - 1].heroViewport
            ? Object.fromEntries(Object.keys(from).map((key) => [
                key,
                () => resolveKeyframe(keys[i - 1], readDevice())[key as keyof ScenePose],
              ]))
            : { ...from },
          {
            ...to,
            duration: dur,
            ease: keys[i].ease ?? "none",
            immediateRender: false,
          },
          keys[i - 1].at,
        );
      }

      // Keep the timeline exactly 1 unit long so `at` === scroll progress.
      tl.to({}, { duration: Math.max(0, 1 - tl.duration()) });

      opts.build?.(tl, device);

      /* The page keeps one colour block at a time, so a panel that is still
         half on screen when the block changes would show dark text on a dark
         ground. Fading each panel out as it releases makes every hand-off a
         clean cross-dissolve. */
      if (opts.fadeOut !== false) {
        const panels = el.querySelectorAll<HTMLElement>(
          ":scope > .layer-behind, :scope > .layer-front",
        );
        if (panels.length) {
          tl.fromTo(
            panels,
            { opacity: 1 },
            { opacity: 0, ease: "power1.in", duration: 0.14, immediateRender: false },
            opts.fadeAt ?? 0.87,
          );
        }
      }

      if (opts.theme) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 40%",
          end: "bottom 60%",
          onEnter: () => tweenTheme(opts.theme!),
          onEnterBack: () => tweenTheme(opts.theme!),
        });
      }
    }, el);

    return () => ctx.revert();
     
  }, []);
}
