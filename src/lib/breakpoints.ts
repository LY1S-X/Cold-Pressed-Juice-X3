export const BP = {
  mobile: 640,
  tablet: 1024,
} as const;

export type Device = "mobile" | "tablet" | "desktop";

export function readDevice(): Device {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < BP.mobile) return "mobile";
  if (w < BP.tablet) return "tablet";
  return "desktop";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
