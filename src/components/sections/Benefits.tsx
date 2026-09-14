"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography, vw } from "@/lib/choreography";
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
    theme: "forest",
    build: (tl, device) => {
      const shift = device === "mobile" ? 0.04 : 0.09;

      tl.fromTo(
        "[data-bf-head]",
        { yPercent: 112 },
        { yPercent: 0, ease: "expo.out", duration: 0.22, stagger: 0.05 },
        0.02,
      );
      tl.fromTo(
        "[data-bf-ghost]",
        { x: vw(-shift) },
        { x: vw(shift), ease: "none", duration: 1 },
        0,
      );

      CLAIMS.forEach((_, i) => {
        const at = 0.18 + i * 0.115;
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
      aria-labelledby="benefits-title"
      className="relative h-[280svh] md:h-[340svh]"
    >
      {/* ---- behind the product ---- */}
      <div className="layer-behind h-svh overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 flex items-center">
          <span
            data-bf-ghost
            className="display outline-type ghost-reduce t-xl no-wrap block pl-[9vw] opacity-45"
          >
            Nothing to Hide
          </span>
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh">
        <div className="absolute inset-x-0 top-[14svh] px-5 md:px-8 lg:px-10">
          <h2 id="benefits-title" className="display t-lg">
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

        <div className="absolute inset-x-0 top-[30svh] px-5 md:bottom-[14svh] md:top-auto md:px-8 lg:px-10">
          <ul className="max-w-[30rem] md:max-w-[38rem]">
            {CLAIMS.map(({ label, Icon }, i) => (
              <li key={label}>
                <span
                  data-claim-rule={i}
                  className="block h-px origin-left scale-x-0 bg-[color:var(--scene-line)]"
                />
                <span className="mask block">
                  <span
                    data-claim={i}
                    className="flex items-center gap-3 py-2 opacity-0 md:gap-5 md:py-3.5"
                  >
                    <Icon className="h-6 w-6 shrink-0 md:h-9 md:w-9" />
                    <span className="display display-thin t-sm leading-[1.05] wrap-sm">{label}</span>
                  </span>
                </span>
              </li>
            ))}
            <li aria-hidden="true">
              <span
                data-claim-rule={CLAIMS.length}
                className="block h-px origin-left scale-x-0 bg-[color:var(--scene-line)]"
              />
            </li>
          </ul>
        </div>

        <div
          data-bf-meta
          className="absolute inset-x-0 bottom-0 px-5 pb-8 opacity-0 md:px-8 lg:px-10 lg:pb-10"
        >
          <SectionIndex n="04" label="What's In It" />
        </div>
      </div>
    </section>
  );
}
