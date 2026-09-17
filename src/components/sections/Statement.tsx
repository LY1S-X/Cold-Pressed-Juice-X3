"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";
import styles from "./Statement.module.css";

/**
 * Scene 07 — the signature frame. "CONSCIOUS" sits behind the bottle and
 * "IS A CHOICE." lands in front of it, so the product physically occupies the
 * middle of the sentence. The heading is carried by a single accessible h2;
 * the two visual halves live in different stacking layers.
 */
export function Statement() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.statement, {
    theme: "ink",
    build: (tl) => {

      tl.fromTo(
        "[data-st-back]",
        { yPercent: 118 },
        { yPercent: 0, ease: "expo.out", duration: 0.24 },
        0.03,
      );
      tl.fromTo(
        "[data-st-front]",
        { yPercent: 118 },
        { yPercent: 0, ease: "expo.out", duration: 0.24 },
        0.16,
      );
      tl.fromTo("[data-st-shadow]", { opacity: 0 }, { opacity: 1, duration: .14 }, .24);
      tl.to("[data-st-shadow]", { opacity: 0, duration: .08 }, .64);
      tl.fromTo("[data-st-meta]", { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.24);
    },
  });

  return (
    <section
      id="our-position"
      ref={ref}
      aria-labelledby="statement-title"
      className="relative h-[230svh] md:h-[280svh]"
    >
      <h2 id="statement-title" className="sr-only">
        Conscious is a choice.
      </h2>

      {/* ---- behind the product ---- */}
      <div className="layer-behind h-svh overflow-hidden" aria-hidden="true">
        <span data-st-shadow className={`${styles.shadow} opacity-0`} />
        <div className={styles.heading}>
          <span data-stx="back" className="mask block">
            <span data-st-back className={`display no-wrap block ${styles.title}`}>
              Conscious
            </span>
          </span>
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh overflow-hidden">
        <div className={styles.foreground}>
          <span data-stx="front" className="mask block" aria-hidden="true">
            <span data-st-front className={`display no-wrap block ${styles.subtitle}`}>
              Is a Choice.
            </span>
          </span>
        </div>

        <div
          data-st-meta
          className="absolute inset-x-0 bottom-0 px-5 pb-8 opacity-0 md:px-8 lg:px-10 lg:pb-10"
        >
          <div className="flex items-end justify-between gap-8">
            <SectionIndex n="07" label="Our Position" />
            <p className="t-label max-w-[24ch] text-right text-[color:var(--scene-dim)]">
              Nourish your body. Honor the earth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
