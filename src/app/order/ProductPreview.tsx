"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, useGLTF } from "@react-three/drei";

function Product() {
  const { scene } = useGLTF("/models/JUICE-3D.glb");
  const model = useMemo(() => scene.clone(true), [scene]);
  return <Bounds fit clip observe margin={1.15}><Center><primitive object={model} rotation={[0, -0.25, 0]} /></Center></Bounds>;
}

export default function ProductPreview() {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 35 }}>
    <ambientLight intensity={1.7} />
    <directionalLight position={[3, 4, 5]} intensity={3} />
    <directionalLight position={[-3, 2, 3]} intensity={1.5} />
    <Suspense fallback={null}><Product /></Suspense>
  </Canvas>;
}
