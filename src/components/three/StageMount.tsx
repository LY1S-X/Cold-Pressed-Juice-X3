"use client";

import dynamic from "next/dynamic";

/** WebGL never runs on the server and never blocks first paint. */
const Stage = dynamic(() => import("./Stage"), { ssr: false, loading: () => null });

export function StageMount() {
  return <Stage />;
}
