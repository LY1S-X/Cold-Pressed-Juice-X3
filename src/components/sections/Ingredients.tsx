"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography, vw } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { PRODUCT } from "@/lib/brand";

/**
 * Scene 03 — each ingredient gets its own moment. Solid words travel in front
 * of the product, outlined ghosts of the same words travel behind it at a
 * different rate, so the composition has real depth rather than a card grid.
 */
export function Ingredients() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.ingredients, {
    theme: "juice",
    fadeAt: 0.97,
    build: (tl, device) => {
      const m = device === "mobile";
      const reach = m ? 0.3 : 0.4;

      const beats: Array<{
        key: string;
        from: number;
        to: number;
        out: number;
        at: number;
        enter: number;
        hold: number;
        exit: number;
      }> = [
        { key: "pineapple", from: -reach, to: m ? 0.02 : 0.08, out: m ? -0.08 : -0.1, at: 0.0, enter: 0.14, hold: 0.08, exit: 0.08 },
        { key: "apple", from: reach, to: m ? -0.02 : -0.06, out: m ? 0.08 : 0.1, at: 0.25, enter: 0.14, hold: 0.08, exit: 0.08 },
        { key: "carrot", from: -reach * 0.75, to: m ? 0.02 : 0.06, out: m ? -0.08 : -0.1, at: 0.5, enter: 0.14, hold: 0.08, exit: 0.08 },
        { key: "ginger", from: reach * 0.9, to: m ? -0.02 : -0.08, out: m ? 0.08 : 0.1, at: 0.64, enter: 0.14, hold: 0.18, exit: 0.08 },
      ];

      beats.forEach((b) => {
        const exitAt = b.at + b.enter + b.hold;

        tl.fromTo(
          `[data-ing='${b.key}']`,
          { x: vw(b.from), opacity: 0 },
          { x: vw(b.to), opacity: 1, ease: "power2.out", duration: b.enter },
          b.at,
        );
        tl.fromTo(
          `[data-ing-ghost='${b.key}']`,
          { x: vw(b.from * 1.55), opacity: 0 },
          { x: vw(b.to * 1.9), opacity: 0.5, ease: "power2.out", duration: b.enter },
          b.at,
        );
        tl.to(`[data-ing='${b.key}']`, {
          x: vw(b.out),
          opacity: 0,
          ease: "power2.in",
          duration: b.exit,
        }, exitAt);
        tl.to(
          `[data-ing-ghost='${b.key}']`,
          { x: vw(b.out * 1.65), opacity: 0, ease: "power2.in", duration: b.exit },
          exitAt,
        );
      });

      tl.fromTo(
        "[data-ing-head]",
        { yPercent: 110 },
        { yPercent: 0, ease: "power3.out", duration: 0.18, stagger: 0.04 },
        0.02,
      );
      tl.fromTo(
        "[data-ing-meta]",
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: 0.12 },
        0.06,
      );
    },
  });

  return (
    <section
      id="ingredients"
      ref={ref}
      aria-labelledby="ingredients-title"
      className="relative h-[340svh] md:h-[420svh]"
    >
      {/* ---- ghosts behind the product ---- */}
      <div className="layer-behind ghost-reduce h-svh overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 flex items-start pt-[34svh] md:items-center md:pt-0">
          <div className="relative w-full">
            {PRODUCT.ingredients.map((name) => (
              <span
                key={name}
                data-ing-ghost={name.toLowerCase()}
                className="display outline-type t-xl no-wrap absolute inset-x-0 block text-center opacity-0"
                style={{ top: "-0.42em" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh overflow-hidden">
        <div className="absolute inset-x-0 top-[14svh] px-5 md:px-8 lg:px-10">
          <h2 id="ingredients-title" className="display t-lg">
            <span className="mask block">
              <span data-ing-head className="no-wrap block">
                What&rsquo;s inside
              </span>
            </span>
            <span className="mask block">
              <span data-ing-head className="no-wrap block">
                matters.
              </span>
            </span>
          </h2>
        </div>

        <div className="absolute inset-0 flex items-start px-5 pt-[34svh] md:items-center md:px-8 md:pt-0 lg:px-10">
          <ul className="stack-reduce relative w-full">
            {PRODUCT.ingredients.map((name) => (
              <li
                key={name}
                data-ing={name.toLowerCase()}
                className="display t-xl no-wrap absolute inset-x-0 block text-center opacity-0"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div
          data-ing-meta
          className="absolute inset-x-0 bottom-0 px-5 pb-8 opacity-0 md:px-8 lg:px-10 lg:pb-10"
        >
          <div className="flex items-end justify-between gap-8">
            <SectionIndex n="03" label="Ingredients" />
            <p className="t-label max-w-[26ch] text-right text-[color:var(--scene-dim)]">
              Pineapple · Apple · Carrot · Ginger. Nothing else.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
