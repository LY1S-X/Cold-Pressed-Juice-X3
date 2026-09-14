"use client";

import dynamic from "next/dynamic";

const LabScene = dynamic(() => import("./LabScene"), { ssr: false });

export function ModelLab() {
  return (
    <div className="fixed inset-0 bg-beige">
      <LabScene />
      <p className="t-label pointer-events-none absolute left-5 top-5 text-ink/60">
        Model lab — drag to orbit · scroll to dolly
      </p>
    </div>
  );
}
