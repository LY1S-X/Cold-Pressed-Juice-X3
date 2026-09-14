"use client";

/**
 * A one-shot "the product is on screen" signal.
 *
 * The loader keys off this rather than the generic loading-manager progress:
 * the manager can settle before the GLB's materials are compiled, which is
 * exactly the moment that produces a visible pop.
 */
let ready = false;
const subs = new Set<() => void>();

export function markProductReady() {
  if (ready) return;
  ready = true;
  subs.forEach((f) => f());
}

export function isProductReady() {
  return ready;
}

export function onProductReady(fn: () => void) {
  if (ready) {
    fn();
    return () => {};
  }
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}
