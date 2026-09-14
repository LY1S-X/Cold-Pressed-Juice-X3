"use client";

/**
 * Dev-only rendering tuner.
 *
 * To remove it for production, delete the <DebugPanel /> line in Stage.tsx —
 * every value it touches lives in lib/scene-config.ts, so the tuned look is
 * preserved without the panel. It is already tree-shaken out of `next build`
 * because it is only mounted when NODE_ENV === "development".
 */

import { useControls, folder, button } from "leva";
import { useEffect } from "react";
import { RENDER, RENDER_DEFAULTS, applyRenderConfig } from "@/lib/scene-config";
import { SCENE, IDLE } from "@/lib/scene-state";

export default function DebugPanel() {
  const values = useControls({
    Renderer: folder(
      {
        exposure: { value: RENDER_DEFAULTS.exposure, min: 0.2, max: 2.5, step: 0.01 },
        envIntensity: { value: RENDER_DEFAULTS.envIntensity, min: 0, max: 4, step: 0.01 },
        ambient: { value: RENDER_DEFAULTS.ambient, min: 0, max: 3, step: 0.01 },
      },
      { collapsed: false },
    ),
    Lights: folder(
      {
        keyIntensity: { value: RENDER_DEFAULTS.keyIntensity, min: 0, max: 10, step: 0.05 },
        fillIntensity: { value: RENDER_DEFAULTS.fillIntensity, min: 0, max: 10, step: 0.05 },
        rimIntensity: { value: RENDER_DEFAULTS.rimIntensity, min: 0, max: 12, step: 0.05 },
        topIntensity: { value: RENDER_DEFAULTS.topIntensity, min: 0, max: 10, step: 0.05 },
        shadowOpacity: { value: RENDER_DEFAULTS.shadowOpacity, min: 0, max: 1, step: 0.01 },
        shadowBlur: { value: RENDER_DEFAULTS.shadowBlur, min: 0, max: 10, step: 0.05 },
      },
      { collapsed: true },
    ),
    Material: folder(
      {
        bottleRoughness: { value: RENDER_DEFAULTS.bottleRoughness, min: 0, max: 1, step: 0.01 },
        bottleClearcoat: { value: RENDER_DEFAULTS.bottleClearcoat, min: 0, max: 1, step: 0.01 },
        bottleClearcoatRoughness: {
          value: RENDER_DEFAULTS.bottleClearcoatRoughness,
          min: 0,
          max: 1,
          step: 0.01,
        },
        capRoughness: { value: RENDER_DEFAULTS.capRoughness, min: 0, max: 1, step: 0.01 },
        labelRoughness: { value: RENDER_DEFAULTS.labelRoughness, min: 0, max: 1, step: 0.01 },
        labelClearcoat: { value: RENDER_DEFAULTS.labelClearcoat, min: 0, max: 1, step: 0.01 },
        labelOpacity: { value: RENDER_DEFAULTS.labelOpacity, min: 0, max: 1, step: 0.01 },
        condensationRoughness: {
          value: RENDER_DEFAULTS.condensationRoughness,
          min: 0,
          max: 1,
          step: 0.01,
        },
        juiceRoughness: { value: RENDER_DEFAULTS.juiceRoughness, min: 0, max: 1, step: 0.01 },
      },
      { collapsed: true },
    ),
    Camera: folder(
      {
        fov: { value: RENDER_DEFAULTS.fov, min: 12, max: 70, step: 0.5 },
        camZ: { value: RENDER_DEFAULTS.camZ, min: 1, max: 10, step: 0.02 },
        camY: { value: RENDER_DEFAULTS.camY, min: -2, max: 2, step: 0.01 },
      },
      { collapsed: true },
    ),
    Product: folder(
      {
        modelScale: { value: RENDER_DEFAULTS.modelScale, min: 0.2, max: 3, step: 0.01 },
        modelTiltX: { value: RENDER_DEFAULTS.modelTiltX, min: -0.5, max: 0.5, step: 0.005 },
        modelOffsetY: { value: RENDER_DEFAULTS.modelOffsetY, min: -1, max: 1, step: 0.005 },
        idle: { value: true },
      },
      { collapsed: true },
    ),
    "Copy values to clipboard": button(() => {
      const json = JSON.stringify(RENDER, null, 2);
      void navigator.clipboard?.writeText(json);
       
      console.log("[conscious-choice] RENDER config\n" + json);
    }),
    "Reset": button(() => applyRenderConfig(RENDER_DEFAULTS)),
  });

  useEffect(() => {
    const { idle, ...rest } = values as typeof values & { idle: boolean };
    applyRenderConfig(rest);
    IDLE.enabled = idle;
  }, [values]);

  useEffect(() => {
     
    console.log("[conscious-choice] live scene state available as window.__SCENE");
    (window as unknown as { __SCENE: typeof SCENE }).__SCENE = SCENE;
  }, []);

  return null;
}
