"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { PRODUCT } from "@/lib/brand";
import styles from "./CloseUp.module.css";

/**
 * Scene 05 — a slow dolly onto the real label. The product moves toward the
 * camera rather than simply scaling, so the perspective opens up the way it
 * would on a macro lens. Restrained on purpose: premium, not dramatic.
 */
export function CloseUp() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.closeup, {
    theme: "forest",
    build: (tl) => {
      tl.fromTo("[data-cu-shadow], [data-cu-glow]", { opacity: 0 },
        { opacity: 1, duration: 0.2 }, 0.14);
      tl.to("[data-cu-shadow], [data-cu-glow]", { opacity: 0, duration: 0.06 }, 0.66);

      tl.fromTo(
        "[data-cu-word]",
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "power2.out", duration: 0.2, stagger: 0.025 },
        0,
      );

      tl.fromTo(
        "[data-cu-detail]",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.18, stagger: 0.05 },
        0.12,
      );
      tl.fromTo("[data-cu-meta]", { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.06);
    },
  });

  return (
    <section
      ref={ref}
      id="the-bottle"
      aria-labelledby="closeup-title"
      className="relative h-[260svh] md:h-[320svh]"
    >
      {/* ---- behind the product ---- */}
      <div className="layer-behind h-svh overflow-hidden">
        <span data-cu-glow className={styles.glow} aria-hidden="true" />
        <span data-cu-shadow className={styles.shadow} aria-hidden="true" />
        <div className={styles.heading}>
          <h2 id="closeup-title" className={`display ${styles.title}`}>
            {["Just", "the", "Good", "Stuff."].map((w) => (
              <span key={w} className="mask block">
                <span
                  data-cu-word
                  className="no-wrap block opacity-0"
                >
                  {w}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh">
        <div className="absolute inset-x-0 top-[14svh] px-5 md:px-8 lg:px-10">
          <div data-cu-meta className="opacity-0">
            <SectionIndex n="05" label="The Bottle" />
          </div>
        </div>

        <div className={styles.details}>
          <div>
            <p
              data-cu-detail
              className={`${styles.copy} opacity-0`}
            >
              Recyclable PET. A full-wrap print. And nothing on the ingredient
              list you need to look up.
            </p>

            <dl
              data-cu-detail
              className={`${styles.nutrition} opacity-0`}
            >
              {PRODUCT.nutrition.slice(0, 6).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-[color:var(--scene-dim)]">{k}</dt>
                  <dd className="text-right tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
