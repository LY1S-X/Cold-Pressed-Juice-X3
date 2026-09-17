"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography, vw } from "@/lib/choreography";
import { PRODUCT } from "@/lib/brand";
import { Wordmark } from "@/components/ui/Icons";
import styles from "./Finale.module.css";

/** Scene 09 — the product returns to centre and the campaign lands. */
export function Finale() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.finale, {
    theme: "juice",
    end: "bottom bottom",
    build: (tl, device) => {
      const t = device === "mobile" ? 0.04 : 0.09;

      tl.fromTo(
        "[data-fin-ghost]",
        { x: vw(t), opacity: 0 },
        { x: vw(-t), opacity: 0.45, ease: "none", duration: 1 },
        0,
      );
      tl.fromTo(
        "[data-fin-line]",
        { yPercent: 115 },
        { yPercent: 0, ease: "expo.out", duration: 0.24, stagger: 0.05 },
        0.24,
      );
      tl.fromTo(
        "[data-fin-fade]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.2, stagger: 0.045 },
        0.34,
      );
      tl.fromTo(
        "[data-fin-cta]",
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, ease: "expo.out", duration: 0.26, },
        0.5,
      );
    },
  });

  return (
    <section
      id="order"
      ref={ref}
      aria-labelledby="finale-title"
      className="relative h-[250svh] md:h-[300svh]"
    >
      {/* ---- behind the product ---- */}
      <div className="layer-behind h-svh overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 flex items-center">
          <span
            data-fin-ghost
            className="display outline-type ghost-reduce t-mega no-wrap block pl-[8vw] opacity-0"
          >
            Kick-Start
          </span>
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh">
        <div className={styles.heading}>
          <Wordmark data-fin-fade className={styles.mark} />
          <h2 id="finale-title" className="display">
            <span className="mask block">
              <span data-fin-line className={`no-wrap block ${styles.brand}`}>
                Conscious Choice
              </span>
            </span>
            <span className="mask mt-3 block">
              <span data-fin-line className={`no-wrap block ${styles.title}`}>
                Original Kick-Start
              </span>
            </span>
          </h2>
        </div>

        <div className={styles.details}>
          <div className={styles.grid}>
            <div data-fin-fade className="opacity-0">
              <p className="t-label mb-2 text-[color:var(--scene-dim)] md:mb-2.5">Pressed from</p>
              <ul className={`t-label ${styles.ingredients}`}>
                {PRODUCT.ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>

            <div data-fin-fade className="opacity-0">
              <p className="t-label mb-2.5 text-[color:var(--scene-dim)]">Volume</p>
              <p className={`display ${styles.value}`}>300 ml</p>
            </div>

            <div data-fin-fade className="opacity-0">
              <p className="t-label mb-2 text-[color:var(--scene-dim)] md:mb-2.5">Availability</p>
              <p className={`display display-thin ${styles.value}`}>
                Launching in Bangkok
              </p>
            </div>

            <div className={styles.action}>
              <a
                data-fin-cta
                href="mailto:hello@consciouschoice.co?subject=Original%20Kick-Start"
                className={`t-label pointer-events-auto ${styles.cta} opacity-0`}
              >
                Get Your Kick-Start
                <svg
                  viewBox="0 0 16 16"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5" />
                </svg>
              </a>
            </div>
          </div>

          <p
            data-fin-fade
            className={`t-label ${styles.motto} opacity-0`}
          >
            {PRODUCT.motto}
          </p>
        </div>
      </div>
    </section>
  );
}
