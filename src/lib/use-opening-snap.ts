"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/** Settle the opening transition on a complete composition, not on the
 * section boundary where Movement's text is still revealing. */
export function useOpeningSnap(started: boolean) {
  useEffect(() => {
    if (!started) return;
    const product = document.getElementById("our-juice");
    if (!product) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        id: "opening-composition-snap",
        start: 0,
        // 54%: all words and metadata are revealed, the diagonal pose and
        // its shadow have settled, and both sticky panels are still held.
        end: () => product.offsetTop + product.offsetHeight * 0.54,
        invalidateOnRefresh: true,
        snap: {
          snapTo: [0, 1],
          directional: true,
          inertia: false,
          delay: 0.2,
          duration: { min: 0.8, max: 1.6 },
          ease: "power2.inOut",
        },
      });
    });

    return () => media.revert();
  }, [started]);
}
