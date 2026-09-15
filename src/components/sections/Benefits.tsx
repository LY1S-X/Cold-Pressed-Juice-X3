"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography } from "@/lib/choreography";
import styles from "./Benefits.module.css";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { IconLeaf, IconPress, IconNoSugar, IconFlask } from "@/components/ui/Icons";

const CLAIMS = [
  { label: "100% Plant-Based", Icon: IconLeaf },
  { label: "Cold-Pressed", Icon: IconPress },
  { label: "No Added Sugar", Icon: IconNoSugar },
  { label: "No Artificial Preservatives", Icon: IconFlask },
];

/** Scene 04 — the claims stack while the product travels vertically. */
export function Benefits() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.benefits, {
    theme: "emerald",
    build: (tl) => {

      tl.fromTo(
        "[data-bf-head]",
        { yPercent: 112 },
        { yPercent: 0, ease: "expo.out", duration: 0.22, stagger: 0.05 },
        0.02,
      );
      tl.fromTo(
        "[data-bf-atmosphere]",
        { opacity: 0 },
        { opacity: 1, duration: 0.18 },
        0.02,
      );

      CLAIMS.forEach((_, i) => {
        const at = 0.10 + i * 0.04;
        tl.fromTo(
          `[data-claim='${i}']`,
          { yPercent: 130, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: "expo.out", duration: 0.22 },
          at,
        );
        tl.fromTo(
          `[data-claim-rule='${i}']`,
          { scaleX: 0 },
          { scaleX: 1, ease: "power2.out", duration: 0.26, transformOrigin: "left center" },
          at,
        );
      });

      tl.fromTo("[data-bf-meta]", { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.08);
    },
  });

  return (
    <section
      ref={ref}
      id="benefits"
      aria-labelledby="benefits-title"
      className="relative h-[280svh] md:h-[340svh]"
    >
      {/* ---- behind the product ---- */}
      <div className="layer-behind h-svh overflow-hidden" aria-hidden="true">
        <div data-bf-atmosphere className={styles.atmosphere}>
          <div className={styles.halo} />
          <div className={styles.shadow} />
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh">
        <div className={styles.heading}>
          <h2 id="benefits-title" className={`display ${styles.title}`}>
            <span className="mask block">
              <span data-bf-head className="no-wrap block">
                Nothing
              </span>
            </span>
            <span className="mask block">
              <span data-bf-head className="no-wrap block">
                to hide.
              </span>
            </span>
          </h2>
        </div>

        <div className={styles.claims}>
          <ul>
            {CLAIMS.map(({ label, Icon }, i) => (
              <li key={label}>
                <span
                  data-claim-rule={i}
                  className={i === 0 ? styles.firstRule : styles.rule}
                />
                <span className="mask block">
                  <span
                    data-claim={i}
                    className={`${styles.claim} opacity-0`}
                  >
                    <Icon className={styles.icon} />
                    <span>{label}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-bf-meta
          className={`${styles.footer} opacity-0`}
        >
          <SectionIndex n="04" label="What's In It" />
          <span className={styles.productMeta}>300 ML / ORIGINAL KICK-START</span>
        </div>
      </div>
    </section>
  );
}
