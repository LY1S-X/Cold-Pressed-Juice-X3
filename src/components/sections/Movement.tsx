"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography, vw } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";
import styles from "./Movement.module.css";

/**
 * Scene 02 — a diagonal product between Original and Cold-Pressed, with
 * Kick-Start in the foreground. The section retains both hand-off poses.
 */
export function Movement() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.movement, {
    theme: "beige",
    build: (tl, device) => {
      const t = device === "mobile" ? 0.008 : 0.015;
      tl.fromTo("[data-mv-shadow]", { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.12);
      tl.to("[data-mv-shadow]", { x: vw(-0.03), duration: 0.4 }, 0.22);
      tl.to("[data-mv-shadow]", { opacity: 0, duration: 0.14 }, 0.62);

      /* Parallax lives on the clipping wrapper, reveals on the inner line —
         two tweens on one element's transform is how a GSAP timeline quietly
         drops one of them. */
      tl.fromTo("[data-wx='original']", { x: vw(-t) }, { x: vw(t * 0.8), ease: "none", duration: 1 }, 0);
      tl.fromTo("[data-wx='kickstart']", { x: vw(-t * 1.5) }, { x: vw(t * 0.5), ease: "none", duration: 1 }, 0);
      tl.fromTo("[data-word='ghost']", { x: vw(t * 1.4) }, { x: vw(-t * 1.2), ease: "none", duration: 1 }, 0);
      tl.fromTo(
        "[data-word='original']",
        { yPercent: 115 },
        { yPercent: 0, ease: "expo.out", duration: 0.3 },
        0.02,
      );
      tl.fromTo(
        "[data-word='kickstart']",
        { yPercent: 115 },
        { yPercent: 0, ease: "expo.out", duration: 0.3 },
        0.1,
      );
      tl.fromTo(
        "[data-vol]",
        { yPercent: 90, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
        0.22,
      );
      tl.fromTo(
        "[data-mv-meta]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.26 },
        0.1,
      );
      tl.to("[data-wx='original'], [data-word='ghost']", { opacity: 0, duration: 0.16 }, 0.66);
    },
  });

  return (
    <section
      id="our-juice"
      ref={ref}
      aria-labelledby="movement-title"
      className="relative h-[220svh] md:h-[260svh]"
    >
      <h2 id="movement-title" className="sr-only">Original Kick-Start</h2>

      {/* The two side words frame the bottle's diagonal silhouette. */}
      <div className="layer-behind h-svh overflow-hidden">
        <span data-mv-shadow className={styles.shadow} aria-hidden="true" />
        <div className={styles.original} aria-hidden="true">
            <span data-wx="original" className="mask block">
              <span data-word="original" className={`display no-wrap block ${styles.originalType}`}>
                Original
              </span>
            </span>
        </div>
        <div className={styles.coldPressed}>
          <span
            data-word="ghost"
            aria-hidden="true"
            className={`display outline-type ghost-reduce no-wrap block opacity-55 ${styles.coldType}`}
          >
            Cold-Pressed
          </span>
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh">
        <div className={styles.kickStart} aria-hidden="true">
          <span data-wx="kickstart" className="mask block">
            <span data-word="kickstart" className={`display no-wrap block ${styles.kickType}`}>
              Kick-Start
            </span>
          </span>
        </div>
        <div className="absolute inset-x-0 top-[16svh] px-5 md:px-8 lg:px-10">
          <div data-mv-meta className="opacity-0">
            <SectionIndex n="02" label="The Product" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-8 lg:px-10 lg:pb-10">
          <div className="flex items-end justify-between gap-8">
            <p
              data-mv-meta
              className="t-body max-w-[30ch] text-[color:var(--scene-dim)] opacity-0"
            >
              One blend. Four ingredients. Pressed cold, bottled cold, kept cold.
            </p>
            <span className="mask block shrink-0">
              <span data-vol className="display t-lg block">
                300 ml
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
