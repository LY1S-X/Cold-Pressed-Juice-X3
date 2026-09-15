"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/** Settle the opening transition on a complete composition, not on the
 * section boundary where Movement's text is still revealing. */
export function useOpeningSnap(started: boolean) {
  useEffect(() => {
    if (!started) return;
    const product = document.getElementById("our-juice");
    const ingredients = document.getElementById("ingredients");
    const benefits = document.getElementById("benefits");
    if (!product || !ingredients || !benefits) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const productLanding = () => product.offsetTop + product.offsetHeight * 0.54;
      const pineappleLanding = () => ingredients.offsetTop + ingredients.offsetHeight * 0.2;
      // Ginger is fully revealed at this point. The next downward gesture
      // settles on all four benefits, before the sticky panel releases.
      const gingerLanding = () => ingredients.offsetTop + ingredients.offsetHeight * 0.72;
      const benefitsLanding = () => benefits.offsetTop + benefits.offsetHeight * 0.5;

      ScrollTrigger.create({
        id: "ginger-benefits-snap",
        start: gingerLanding,
        end: benefitsLanding,
        invalidateOnRefresh: true,
        snap: {
          snapTo: [0, 1],
          directional: true,
          inertia: false,
          delay: 0.05,
          duration: { min: 0.7, max: 1.2 },
          ease: "power2.inOut",
        },
      });

      ScrollTrigger.create({
        id: "opening-composition-snap",
        start: 0,
        // 54%: all words and metadata are revealed, the diagonal pose and
        // its shadow have settled, and both sticky panels are still held.
        end: productLanding,
        invalidateOnRefresh: true,
        snap: {
          snapTo: [0, 1],
          directional: true,
          inertia: false,
          delay: 0.05,
          duration: { min: 0.45, max: 0.9 },
          ease: "power2.out",
        },
      });

      ScrollTrigger.create({
        id: "product-pineapple-snap",
        start: productLanding,
        // 20% into Ingredients: Pineapple has entered and is still held,
        // before the one-by-one ingredient sequence advances to Apple.
        end: pineappleLanding,
        invalidateOnRefresh: true,
        snap: {
          snapTo: [0, 1],
          directional: true,
          inertia: false,
          delay: 0.05,
          duration: { min: 0.45, max: 0.9 },
          ease: "power2.out",
        },
      });
    });

    return () => media.revert();
  }, [started]);
}
