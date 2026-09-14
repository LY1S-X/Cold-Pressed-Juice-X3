"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { PRODUCT } from "@/lib/brand";

/**
 * Scene 05 — a slow dolly onto the real label. The product moves toward the
 * camera rather than simply scaling, so the perspective opens up the way it
 * would on a macro lens. Restrained on purpose: premium, not dramatic.
 */
export function CloseUp() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.closeup, {
    theme: "forest",
    build: (tl, device) => {
      const drift = device === "mobile" ? 6 : 14;

      tl.fromTo(
        "[data-cu-word]",
        { yPercent: 40, opacity: 0 },
        { yPercent: -drift, opacity: 1, ease: "none", duration: 0.44, stagger: 0.05 },
        0,
      );
      tl.to("[data-cu-word]", { opacity: 0.14, ease: "none", duration: 0.22 }, 0.5);

      tl.fromTo(
        "[data-cu-detail]",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.18, stagger: 0.05 },
        0.3,
      );
      tl.fromTo("[data-cu-meta]", { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.06);
    },
  });

  return (
    <section
      ref={ref}
      aria-labelledby="closeup-title"
      className="relative h-[260svh] md:h-[320svh]"
    >
      {/* ---- behind the product ---- */}
      <div className="layer-behind h-svh overflow-hidden">
        <div className="absolute inset-0 flex items-start pt-[15svh] px-5 md:items-center md:pt-0 md:px-8 lg:px-10">
          <h2 id="closeup-title" className="display t-xl w-full">
            {["Just", "the", "Good", "Stuff."].map((w, i) => (
              <span key={w} className="mask block">
                <span
                  data-cu-word
                  className="no-wrap block opacity-0"
                  style={{ paddingLeft: `${i * 4}vw` }}
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

        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-8 lg:px-10 lg:pb-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p
              data-cu-detail
              className="t-body max-w-[30ch] text-[color:var(--scene-fg)] opacity-0"
            >
              Recyclable PET. A full-wrap print. And nothing on the ingredient
              list you need to look up.
            </p>

            <dl
              data-cu-detail
              className="t-label grid w-full max-w-xs grid-cols-2 gap-x-6 gap-y-2 opacity-0 md:w-auto"
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
