"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Stats } from "@react-three/drei";
import * as THREE from "three";
import { Bottle } from "./Bottle";
import { Lighting } from "./Lighting";
import DebugPanel from "./DebugPanel";
import { useEffect } from "react";
import { RENDER, exposeForTuning } from "@/lib/scene-config";

export default function LabScene() {
  useEffect(() => {
    exposeForTuning();
  }, []);

  return (
    <>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: RENDER.fov, position: [0, 0, RENDER.camZ], near: 0.1, far: 40 }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = RENDER.exposure;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.environmentIntensity = RENDER.envIntensity;
        }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <Bottle reducedMotion controlCamera={false} />
          <Grid
            args={[10, 10]}
            position={[0, -0.55, 0]}
            cellColor="#c8c2b4"
            sectionColor="#a8a294"
            fadeDistance={9}
            infiniteGrid
          />
        </Suspense>
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
        <Stats />
      </Canvas>
      <DebugPanel />
    </>
  );
}
