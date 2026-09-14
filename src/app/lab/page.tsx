import type { Metadata } from "next";
import { ModelLab } from "@/components/three/ModelLab";

export const metadata: Metadata = {
  title: "Model lab — Conscious Choice",
  robots: { index: false, follow: false },
};

/** Isolated product test scene. Orbit the real GLB and tune the render rig. */
export default function LabPage() {
  return <ModelLab />;
}
