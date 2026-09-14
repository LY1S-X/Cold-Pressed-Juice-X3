import * as THREE from "three";
import { RENDER } from "@/lib/scene-config";

export type TunedParts = {
  pet: THREE.MeshPhysicalMaterial[];
  cap: THREE.MeshPhysicalMaterial[];
  label: THREE.MeshPhysicalMaterial[];
  condensation: THREE.MeshPhysicalMaterial[];
  juice: THREE.MeshStandardMaterial[];
  all: THREE.Material[];
};

function toPhysical(std: THREE.MeshStandardMaterial) {
  const p = new THREE.MeshPhysicalMaterial({
    color: std.color.clone(),
    map: std.map,
    normalMap: std.normalMap,
    normalScale: std.normalScale.clone(),
    roughnessMap: std.roughnessMap,
    metalnessMap: std.metalnessMap,
    aoMap: std.aoMap,
    roughness: std.roughness,
    metalness: std.metalness,
    side: THREE.FrontSide,
  });
  p.name = std.name;
  return p;
}

/**
 * Runtime-only rendering treatment of the real product materials.
 * Nothing here changes the artwork, the colours or the geometry that came out
 * of the GLB — it adds the clearcoat / roughness response that makes satin PET
 * and a printed wrap label read like product photography in a live renderer.
 */
export function tuneMaterials(
  root: THREE.Object3D,
  maxAnisotropy: number,
): TunedParts {
  const parts: TunedParts = {
    pet: [],
    cap: [],
    label: [],
    condensation: [],
    juice: [],
    all: [],
  };

  const swap = new Map<THREE.Material, THREE.Material>();

  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const next = mats.map((m) => {
      const std = m as THREE.MeshStandardMaterial;
      if (swap.has(std)) return swap.get(std)!;

      const name = std.name || "";
      let out: THREE.Material = std;

      if (name.includes("filled PET")) {
        const p = toPhysical(std);
        p.clearcoat = RENDER.bottleClearcoat;
        p.clearcoatRoughness = RENDER.bottleClearcoatRoughness;
        p.roughness = RENDER.bottleRoughness;
        p.envMapIntensity = 1;
        p.sheen = 0.18;
        p.sheenRoughness = 0.6;
        p.sheenColor = new THREE.Color("#ffd9b0");
        parts.pet.push(p);
        out = p;
      } else if (name.includes("white cap")) {
        const p = toPhysical(std);
        p.clearcoat = 0.35;
        p.clearcoatRoughness = 0.45;
        p.roughness = RENDER.capRoughness;
        p.envMapIntensity = 1;
        parts.cap.push(p);
        out = p;
      } else if (name.includes("condensation")) {
        const p = toPhysical(std);
        p.clearcoat = 1;
        p.clearcoatRoughness = 0.06;
        p.roughness = RENDER.condensationRoughness;
        p.envMapIntensity = 1.35;
        parts.condensation.push(p);
        out = p;
      } else if (name.includes("360 print")) {
        const p = toPhysical(std);
        p.clearcoat = RENDER.labelClearcoat;
        p.clearcoatRoughness = 0.5;
        p.roughness = RENDER.labelRoughness;
        p.envMapIntensity = 1;
        if (p.map) {
          p.map.anisotropy = maxAnisotropy;
          p.map.colorSpace = THREE.SRGBColorSpace;
          p.map.needsUpdate = true;
        }
        if (p.normalMap) {
          p.normalMap.anisotropy = maxAnisotropy;
          p.normalMap.needsUpdate = true;
        }
        if (p.roughnessMap) {
          p.roughnessMap.anisotropy = maxAnisotropy;
          p.roughnessMap.needsUpdate = true;
        }
        parts.label.push(p);
        out = p;
      } else if (name.includes("juice fill")) {
        std.roughness = RENDER.juiceRoughness;
        std.envMapIntensity = 0.55;
        parts.juice.push(std);
        out = std;
      }

      swap.set(std, out);
      parts.all.push(out);
      return out;
    });

    mesh.material = Array.isArray(mesh.material) ? next : next[0];
  });

  return parts;
}

/** Re-applies live config values (used by the dev tuning panel). */
export function syncMaterials(parts: TunedParts) {
  parts.pet.forEach((m) => {
    m.roughness = RENDER.bottleRoughness;
    m.clearcoat = RENDER.bottleClearcoat;
    m.clearcoatRoughness = RENDER.bottleClearcoatRoughness;
  });
  parts.cap.forEach((m) => (m.roughness = RENDER.capRoughness));
  parts.label.forEach((m) => {
    m.roughness = RENDER.labelRoughness;
    m.clearcoat = RENDER.labelClearcoat;
    m.opacity = RENDER.labelOpacity;
    m.transparent = RENDER.labelOpacity < 1;
  });
  parts.condensation.forEach((m) => (m.roughness = RENDER.condensationRoughness));
  parts.juice.forEach((m) => (m.roughness = RENDER.juiceRoughness));
}
