"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { RENDER } from "@/lib/scene-config";
import { SCENE, IDLE } from "@/lib/scene-state";
import { tuneMaterials, syncMaterials, type TunedParts } from "./materials";
import { markProductReady } from "@/lib/ready";

const MODEL = "/models/JUICE-3D.glb";
const DEG = Math.PI / 180;

export function Bottle({
  reducedMotion = false,
  controlCamera = true,
}: {
  reducedMotion?: boolean;
  /** Off in the model lab so OrbitControls owns the camera. */
  controlCamera?: boolean;
}) {
  const { scene } = useGLTF(MODEL);
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  const group = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Group>(null);
  const shadowMat = useRef<THREE.Material | null>(null);
  const parts = useRef<TunedParts | null>(null);

  /* The GLB is authored at real-world scale (≈185 mm tall). Normalising it to
     exactly 1 unit tall, centred on the origin, is what lets the whole
     choreography be expressed in viewport fractions. */
  const { model, normScale, offset } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const s = new THREE.Vector3();
    const c = new THREE.Vector3();
    box.getSize(s);
    box.getCenter(c);
    return {
      model: clone,
      normScale: 1 / (s.y || 1),
      offset: c.clone().multiplyScalar(-1),
    };
  }, [scene]);

  useEffect(() => {
    parts.current = tuneMaterials(model, maxAnisotropy);
    syncMaterials(parts.current);
    // Two frames of headroom so shader compilation lands before the reveal.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => markProductReady()),
    );
    return () => cancelAnimationFrame(id);
  }, [model, maxAnisotropy]);

  const tmp = useRef({ nx: 0, ny: 0, z: 0, ry: 0, rx: 0, rz: 0, h: 0.6, init: false });

  /* Everything below runs on the render loop and writes straight to the
     three.js graph — no React state, so scrolling never triggers a re-render. */
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const camera = state.camera as THREE.PerspectiveCamera;
    const size = state.size;

    if (parts.current) syncMaterials(parts.current);

    if (controlCamera) {
      camera.fov = RENDER.fov;
      camera.position.z = RENDER.camZ;
      camera.position.y = RENDER.camY;
      camera.updateProjectionMatrix();
    }

    const t = tmp.current;
    const k = reducedMotion ? 1 : 1 - Math.exp(-12 * Math.min(delta, 0.05));

    if (!t.init) {
      t.nx = SCENE.nx;
      t.ny = SCENE.ny;
      t.z = SCENE.z;
      t.ry = SCENE.ry;
      t.rx = SCENE.rx;
      t.rz = SCENE.rz;
      t.h = SCENE.height;
      t.init = true;
    }

    t.nx += (SCENE.nx - t.nx) * k;
    t.ny += (SCENE.ny - t.ny) * k;
    t.z += (SCENE.z - t.z) * k;
    t.ry += (SCENE.ry - t.ry) * k;
    t.rx += (SCENE.rx - t.rx) * k;
    t.rz += (SCENE.rz - t.rz) * k;
    t.h += (SCENE.height - t.h) * k;

    // Visible extent on the plane the product currently occupies. Recomputing
    // it per frame is what makes the z-dolly read as perspective rather than
    // as a scale change.
    const dist = Math.max(0.35, RENDER.camZ - t.z);
    const vh = 2 * dist * Math.tan((RENDER.fov * DEG) / 2);
    const vw = vh * (size.width / size.height);

    const time = state.clock.elapsedTime;
    const idle = IDLE.enabled && !reducedMotion;
    const floatY = idle ? Math.sin(time * IDLE.speed) * IDLE.amplitudeY * 0.06 : 0;
    const floatR = idle ? Math.sin(time * IDLE.speed * 0.78) * IDLE.amplitudeRot : 0;
    const floatT = idle ? Math.cos(time * IDLE.speed * 0.61) * 0.012 : 0;

    g.position.set(
      t.nx * vw * 0.5,
      t.ny * vh * 0.5 + floatY + RENDER.modelOffsetY,
      t.z,
    );
    g.rotation.set(
      t.rx + RENDER.modelTiltX + floatT,
      t.ry + floatR,
      t.rz,
    );
    const s = t.h * vh * RENDER.modelScale;
    g.scale.setScalar(s);

    if (shadow.current) {
      if (!shadowMat.current) {
        shadow.current.traverse((o) => {
          const m = (o as THREE.Mesh).material as THREE.Material | undefined;
          if (m && !shadowMat.current) shadowMat.current = m;
        });
      }
      const target = RENDER.shadowOpacity * SCENE.shadowMul;
      shadow.current.visible = target > 0.015;
      if (shadowMat.current) shadowMat.current.opacity = target;
    }
  });

  return (
    <group ref={group}>
      <group scale={normScale}>
        <group position={[offset.x, offset.y, offset.z]}>
          <primitive object={model} />
        </group>
      </group>

      {/* The model is normalised to 1 unit tall and ~0.34 wide, so the catcher
          only needs to be a little wider than the base — a large plane with a
          deep `far` captures the whole body and reads as a ring, not a shadow. */}
      <group ref={shadow} position={[0, -0.508, 0]}>
        <ContactShadows
          opacity={RENDER.shadowOpacity}
          scale={1.55}
          blur={RENDER.shadowBlur}
          far={0.5}
          resolution={512}
          color="#3a2410"
          frames={Infinity}
        />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
