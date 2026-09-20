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
    build: (tl) => {
      // Move the complete composition up with the page instead of revealing
      // individual words through masks after the section has already arrived.
      tl.fromTo("[data-mv-rise]", { y: () => window.innerHeight * 0.24 },
        { y: 0, ease: "none", duration: 0.22 }, 0);
      tl.fromTo("[data-mv-shadow]", { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.12);
      tl.to("[data-mv-shadow]", { x: vw(-0.03), duration: 0.4 }, 0.22);
      tl.to("[data-mv-shadow]", { opacity: 0, duration: 0.14 }, 0.62);

      /* Parallax lives on the clipping wrapper, reveals on the inner line —
         two tweens on one element's transform is how a GSAP timeline quietly
         drops one of them. */
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
        <div data-mv-rise className={styles.original} aria-hidden="true">
            <span data-wx="original" className="mask block">
              <span data-word="original" className={`display no-wrap block ${styles.originalType}`}>
                Original
              </span>
            </span>
        </div>
        <div data-mv-rise className={styles.coldPressed}>
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
        <div data-mv-rise className={styles.kickStart} aria-hidden="true">
          <span data-wx="kickstart" className="mask block">
            <span data-word="kickstart" className={`display no-wrap block ${styles.kickType}`}>
              Kick-Start
            </span>
          </span>
        </div>
        <div data-mv-rise className="absolute inset-x-0 top-[16svh] px-5 md:px-8 lg:px-10">
          <div data-mv-meta>
            <SectionIndex n="02" label="The Product" />
          </div>
        </div>

        <div data-mv-rise className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-8 lg:px-10 lg:pb-10">
          <div className="flex items-end justify-between gap-8">
            <p
              data-mv-meta
              className="t-body max-w-[30ch] text-[color:var(--scene-dim)]"
            >
              <strong className="block font-medium">Four ingredients. Nothing else.</strong>
              A bright, naturally sweet blend with a gentle kick of fresh ginger.
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
