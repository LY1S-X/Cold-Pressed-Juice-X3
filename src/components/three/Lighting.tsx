"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { RENDER } from "@/lib/scene-config";
import { SCENE } from "@/lib/scene-state";

/**
 * A hand-built studio environment. No HDRI download, no network dependency at
 * runtime, and every emitter is tunable — which is what lets the product keep
 * a convincing specular response as the page moves from cream to near-black.
 */
export function Lighting() {
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const top = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);

  const TONE: Record<string, THREE.ToneMapping> = {
    neutral: THREE.NeutralToneMapping,
    aces: THREE.ACESFilmicToneMapping,
    agx: THREE.AgXToneMapping,
    linear: THREE.LinearToneMapping,
  };

  useFrame(({ scene, gl }) => {
    const tm = TONE[RENDER.toneMapping] ?? THREE.NeutralToneMapping;
    if (gl.toneMapping !== tm) gl.toneMapping = tm;
    if (key.current) key.current.intensity = RENDER.keyIntensity * SCENE.keyMul;
    if (fill.current) fill.current.intensity = RENDER.fillIntensity * SCENE.fillMul;
    if (rim.current) rim.current.intensity = RENDER.rimIntensity * SCENE.rimMul;
    if (top.current) top.current.intensity = RENDER.topIntensity * SCENE.keyMul;
    if (amb.current) amb.current.intensity = RENDER.ambient * SCENE.ambMul;
    scene.environmentIntensity = RENDER.envIntensity * SCENE.envMul;
    gl.toneMappingExposure = RENDER.exposure * SCENE.exposureMul;
  });

  return (
    <>
      <ambientLight ref={amb} intensity={RENDER.ambient} />

      <directionalLight
        ref={key}
        position={[2.6, 3.4, 3.2]}
        intensity={RENDER.keyIntensity}
        castShadow={false}
      />
      <directionalLight ref={fill} position={[-3.4, 0.6, 2.2]} intensity={RENDER.fillIntensity} />
      <directionalLight ref={rim} position={[-1.4, 1.8, -3.6]} intensity={RENDER.rimIntensity} />
      <directionalLight ref={top} position={[0, 5, -0.4]} intensity={RENDER.topIntensity} />

      <Environment resolution={256} frames={1}>
        {/* broad soft box overhead — the main highlight down the bottle */}
        <Lightformer
          form="rect"
          intensity={2.6}
          position={[0, 4.2, 1.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[9, 5, 1]}
          color="#ffffff"
        />
        {/* long vertical strip camera-left: the satin PET edge highlight */}
        <Lightformer
          form="rect"
          intensity={2.8}
          position={[-3.4, 0.4, 2.4]}
          rotation={[0, Math.PI / 2.6, 0]}
          scale={[3.6, 7, 1]}
          color="#fff6ec"
        />
        {/* narrow hot strip camera-right for the specular edge */}
        <Lightformer
          form="rect"
          intensity={4.2}
          position={[3.2, 0.8, 1.6]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[1.6, 7, 1]}
          color="#ffffff"
        />
        {/* cool back kick separates the bottle from dark colour blocks */}
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[0, 0.6, -4]}
          rotation={[0, Math.PI, 0]}
          scale={[6, 6, 1]}
          color="#e9eefb"
        />
        {/* subtle warm bounce from below, like a cream tabletop */}
        <Lightformer
          form="rect"
          intensity={0.5}
          position={[0, -3.2, 1]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[7, 5, 1]}
          color="#f5f2ea"
        />
      </Environment>
    </>
  );
}
