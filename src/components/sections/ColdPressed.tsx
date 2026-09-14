"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography, vw } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";

/** Scene 06 — two halves of one sentence pulling apart as the product crosses. */
export function ColdPressed() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.coldPressed, {
    theme: "cream",
    build: (tl, device) => {
      const t = device === "mobile" ? 0.05 : device === "tablet" ? 0.08 : 0.12;

      tl.fromTo("[data-cpx='a']", { x: vw(-t) }, { x: vw(t), ease: "none", duration: 1 }, 0);
      tl.fromTo("[data-cpx='b']", { x: vw(t) }, { x: vw(-t), ease: "none", duration: 1 }, 0);
      tl.fromTo(
        "[data-cp-ghost]",
        { x: vw(t * 1.7) },
        { x: vw(-t * 1.7), ease: "none", duration: 1 },
        0,
      );
      tl.fromTo(
        "[data-cp='a']",
        { yPercent: 115 },
        { yPercent: 0, ease: "expo.out", duration: 0.28 },
        0.03,
      );
      tl.fromTo(
        "[data-cp='b']",
        { yPercent: 115 },
        { yPercent: 0, ease: "expo.out", duration: 0.28 },
        0.12,
      );

      tl.fromTo(
        "[data-cp-body]",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 },
        0.26,
      );
      tl.fromTo("[data-cp-meta]", { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.14);
    },
  });

  return (
    <section
      id="why-cold-pressed"
      ref={ref}
      aria-labelledby="coldpressed-title"
      className="relative h-[260svh] md:h-[320svh]"
    >
      {/* ---- behind the product ---- */}
      <div className="layer-behind h-svh overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-start pt-[14svh] md:justify-center md:pt-0">
          <h2 id="coldpressed-title">
            <span data-cpx="a" className="mask block">
              <span data-cp="a" className="display t-xl no-wrap block pl-0 md:pl-[16vw]">
                Less Heat.
              </span>
            </span>
            <span data-cpx="b" className="mask block">
              <span data-cp="b" className="display t-lg wrap-sm no-wrap block pl-0 md:pl-[18vw]">
                More of What Matters.
              </span>
            </span>
          </h2>
          <span
            data-cp-ghost
            aria-hidden="true"
            className="display outline-type ghost-reduce t-xl no-wrap mt-4 block pl-[10vw] opacity-45 md:pl-[34vw]"
          >
            Hydraulic
          </span>
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh">
        <div className="absolute inset-x-0 top-[14svh] px-5 md:px-8 lg:px-10">
          <div data-cp-meta className="opacity-0">
            <SectionIndex n="06" label="Why Cold Pressed" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-8 lg:px-10 lg:pb-10">
          <p
            data-cp-body
            className="t-body max-w-[46ch] opacity-0 md:ml-auto md:text-right"
          >
            Cold pressing uses hydraulic pressure rather than high-speed,
            heat-intensive processing — helping preserve the fresh taste and
            character of the ingredients.
          </p>
        </div>
      </div>
    </section>
  );
}
