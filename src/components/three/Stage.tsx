"use client";

import { Suspense, lazy, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Bottle } from "./Bottle";
import { Lighting } from "./Lighting";
import { RENDER, exposeForTuning } from "@/lib/scene-config";
import { useReducedMotion, useTuning } from "@/lib/use-client-flags";

const DebugPanel =
  process.env.NODE_ENV === "development"
    ? lazy(() => import("./DebugPanel"))
    : null;

export default function Stage() {
  const reduced = useReducedMotion();
  const tuning = useTuning();
  const debug = process.env.NODE_ENV === "development" && tuning;

  useEffect(() => {
    exposeForTuning();
  }, []);

  return (
    <div
      className="stage-layer pointer-events-none fixed inset-0"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ fov: RENDER.fov, position: [0, RENDER.camY, RENDER.camZ], near: 0.1, far: 40 }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = RENDER.exposure;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.environmentIntensity = RENDER.envIntensity;
        }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <Bottle reducedMotion={reduced} />
        </Suspense>
      </Canvas>

      {DebugPanel && debug ? (
        <Suspense fallback={null}>
          <DebugPanel />
        </Suspense>
      ) : null}
    </div>
  );
}
