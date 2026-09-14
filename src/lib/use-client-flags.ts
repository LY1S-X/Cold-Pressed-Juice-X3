"use client";

import { useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeMedia(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Reads the OS motion preference without a render-phase side effect. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMedia,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

const noop = () => () => {};

/** True when the page was opened with `?tune`, for the live render controls. */
export function useTuning() {
  return useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).has("tune"),
    () => false,
  );
}
