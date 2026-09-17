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

      // Only assist inside a small physical distance of the destination.
      // Returning the current progress leaves the rest of the scroll free.
      const gentleSnap = {
        snapTo: (progress: number, trigger?: ScrollTrigger) => {
          if (!trigger) return progress;
          const target = trigger.direction > 0 ? 1 : 0;
          const distance = Math.abs(target - progress) * (trigger.end - trigger.start);
          return distance <= Math.min(160, window.innerHeight * 0.18) ? target : progress;
        },
        inertia: false,
        delay: 0.18,
        duration: { min: 0.2, max: 0.45 },
        ease: "power2.out",
      };
      const transitions: ScrollTrigger[] = [];

      transitions.push(ScrollTrigger.create({
        id: "ginger-benefits-snap",
        start: gingerLanding,
        end: benefitsLanding,
        invalidateOnRefresh: true,
        snap: gentleSnap,
      }));

      transitions.push(ScrollTrigger.create({
        id: "opening-composition-snap",
        start: 0,
        // 54%: all words and metadata are revealed, the diagonal pose and
        // its shadow have settled, and both sticky panels are still held.
        end: productLanding,
        invalidateOnRefresh: true,
        snap: gentleSnap,
      }));

      transitions.push(ScrollTrigger.create({
        id: "product-pineapple-snap",
        start: productLanding,
        // 20% into Ingredients: Pineapple has entered and is still held,
        // before the one-by-one ingredient sequence advances to Apple.
        end: pineappleLanding,
        invalidateOnRefresh: true,
        snap: gentleSnap,
      }));

      const interrupt = () => transitions.forEach((trigger) => trigger.getTween(true)?.kill());
      const interruptKey = (event: KeyboardEvent) => {
        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) interrupt();
      };
      window.addEventListener("wheel", interrupt, { passive: true });
      window.addEventListener("touchstart", interrupt, { passive: true });
      window.addEventListener("keydown", interruptKey);
      return () => {
        window.removeEventListener("wheel", interrupt);
        window.removeEventListener("touchstart", interrupt);
        window.removeEventListener("keydown", interruptKey);
      };
    });

    return () => media.revert();
  }, [started]);
}
