"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";

/** Scene 08 — the page exhales. More air, slower motion, product stepped back. */
export function Story() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.story, {
    theme: "beige",
    build: (tl) => {
      tl.fromTo(
        "[data-story-line]",
        { yPercent: 115 },
        { yPercent: 0, ease: "expo.out", duration: 0.24, stagger: 0.05 },
        0.04,
      );
      tl.fromTo(
        "[data-story-fade]",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.2, stagger: 0.05 },
        0.16,
      );
      tl.fromTo(
        "[data-story-rule]",
        { scaleX: 0 },
        { scaleX: 1, ease: "power2.out", duration: 0.3, transformOrigin: "left center" },
        0.1,
      );
    },
  });

  return (
    <section
      id="story"
      ref={ref}
      aria-labelledby="story-title"
      className="relative h-[190svh] md:h-[220svh]"
    >
      <div className="layer-front h-svh">
        <div className="absolute inset-x-0 top-[16svh] px-5 md:px-8 lg:px-10">
          <SectionIndex n="08" label="The Idea" />
        </div>

        <div className="absolute inset-0 flex items-start pt-[24svh] px-5 md:items-center md:pt-0 md:px-8 lg:px-10">
          <div className="max-w-[46rem]">
            <h2 id="story-title" className="display t-lg mb-10 md:mb-14">
              {["Simple,", "on purpose."].map((l) => (
                <span key={l} className="mask block">
                  <span data-story-line className="no-wrap block">
                    {l}
                  </span>
                </span>
              ))}
            </h2>

            <span
              data-story-rule
              className="mb-10 block h-px origin-left scale-x-0 bg-[color:var(--scene-line)]"
            />

            <p data-story-fade className="t-body max-w-[44ch] opacity-0">
              Conscious Choice is about making the everyday choice feel simple —
              real ingredients, fresh flavour, and a bottle designed for life in
              Bangkok.
            </p>
            <p
              data-story-fade
              className="t-body mt-6 hidden max-w-[42ch] text-[color:var(--scene-dim)] opacity-0 md:block"
            >
              Four things go in. Nothing else does. That is the whole idea, and
              it is the reason the label is short enough to read in one breath.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
