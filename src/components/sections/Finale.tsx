"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography, vw } from "@/lib/choreography";
import { PRODUCT } from "@/lib/brand";
import { Wordmark } from "@/components/ui/Icons";

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
        <div className="absolute inset-x-0 top-[11svh] flex flex-col items-center px-5 text-center md:top-[13svh]">
          <Wordmark data-fin-fade className="mb-4 h-8 w-8 opacity-0 md:h-10 md:w-10" />
          <h2 id="finale-title" className="display">
            <span className="mask block">
              <span data-fin-line className="t-sm no-wrap block tracking-[0.3em]">
                Conscious Choice
              </span>
            </span>
            <span className="mask mt-3 block">
              <span data-fin-line className="t-lg no-wrap block">
                Original Kick-Start
              </span>
            </span>
          </h2>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-8 lg:px-10 lg:pb-10">
          <div className="mb-6 grid grid-cols-2 gap-x-5 gap-y-5 md:mb-7 md:gap-y-7 lg:grid-cols-4 lg:items-end">
            <div data-fin-fade className="opacity-0">
              <p className="t-label mb-2 text-[color:var(--scene-dim)] md:mb-2.5">Pressed from</p>
              <ul className="t-label space-y-1">
                {PRODUCT.ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>

            <div data-fin-fade className="opacity-0">
              <p className="t-label mb-2.5 text-[color:var(--scene-dim)]">Volume</p>
              <p className="display t-sm">300 ml</p>
            </div>

            <div data-fin-fade className="col-span-2 opacity-0 lg:col-span-1">
              <p className="t-label mb-2 text-[color:var(--scene-dim)] md:mb-2.5">Availability</p>
              <p className="display display-thin t-sm leading-[1.05]">
                Launching in Bangkok
              </p>
            </div>

            <div className="col-span-2 flex lg:col-span-1 lg:justify-end">
              <a
                data-fin-cta
                href="mailto:hello@consciouschoice.co?subject=Original%20Kick-Start"
                className="t-label pointer-events-auto inline-flex w-full items-center justify-center gap-3 rounded-full bg-[color:var(--scene-fg)] px-8 py-4 text-[color:var(--scene-bg)] opacity-0 transition-transform duration-300 hover:scale-[1.03] lg:w-auto"
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
            className="t-label border-t border-[color:var(--scene-line)] pt-5 text-[color:var(--scene-dim)] opacity-0"
          >
            {PRODUCT.motto}
          </p>
        </div>
      </div>
    </section>
  );
}
