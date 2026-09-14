"use client";

import { useEffect, useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { SCENES, resolveKeyframe, useSceneChoreography, setTheme } from "@/lib/choreography";
import { SCENE } from "@/lib/scene-state";
import { readDevice, prefersReducedMotion } from "@/lib/breakpoints";
import { THEMES } from "@/lib/brand";

export function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    setTheme(THEMES.cream);
  }, []);

  /* Scroll drift out of the hero — hands the product to scene 02 at exactly
     the pose that scene starts from, so the handover is invisible. */
  useSceneChoreography(ref, SCENES.hero, {
    theme: "cream",
    start: "top top",
    end: "bottom top",
    build: (tl) => {
      tl.to("[data-hero-type]", { yPercent: -22, ease: "none", duration: 1 }, 0);
      tl.to("[data-hero-foot]", { yPercent: 60, opacity: 0, ease: "none", duration: 1 }, 0);
    },
  });

  /* Entrance. Runs once, when the loader clears. */
  useEffect(() => {
    if (!started) return;
    const device = readDevice();
    const target = resolveKeyframe(SCENES.hero[0], device);
    const reduced = prefersReducedMotion();

    if (reduced) {
      Object.assign(SCENE, target);
      gsap.set("[data-hero-line]", { yPercent: 0, opacity: 1 });
      gsap.set("[data-hero-fade]", { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      /* If the visitor starts scrolling during the entrance, the scrubbed
         choreography owns the product from that moment — otherwise the two
         would fight over the same values for the rest of the animation. */
      const release = () => {
        if (tl.progress() < 1) tl.kill();
        window.removeEventListener("wheel", release);
        window.removeEventListener("touchmove", release);
        window.removeEventListener("keydown", release);
      };
      window.addEventListener("wheel", release, { passive: true, once: true });
      window.addEventListener("touchmove", release, { passive: true, once: true });
      window.addEventListener("keydown", release, { once: true });

      Object.assign(SCENE, {
        ...target,
        ny: (target.ny ?? 0) - 0.42,
        height: (target.height ?? 0.86) * 0.9,
        ry: (target.ry ?? 0) - 0.3,
        rz: 0.05,
      });

      tl.to(
        SCENE,
        {
          nx: target.nx,
          ny: target.ny,
          height: target.height,
          ry: target.ry,
          rz: target.rz,
          duration: 1.7,
          ease: "expo.out",
        },
        0,
      );

      tl.fromTo(
        "[data-hero-line]",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.25, stagger: 0.09, ease: "expo.out" },
        0.12,
      );

      tl.fromTo(
        "[data-hero-fade]",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.07, ease: "power3.out" },
        0.7,
      );

      tl.fromTo(
        "[data-hero-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.3, ease: "expo.inOut", transformOrigin: "left center" },
        0.5,
      );
    }, ref);

    return () => ctx.revert();
  }, [started]);

  return (
    <section
      id="top"
      ref={ref}
      aria-label="Conscious Choice cold-pressed juice"
      className="relative h-[150svh] md:h-[150svh]"
    >
      {/* ---- behind the product ---- */}
      <div className="layer-behind h-svh">
        <div className="absolute inset-0 flex items-start pt-[16svh] md:items-center md:pt-0">
          <h1
            data-hero-type
            className="w-full px-5 md:px-8 lg:px-10"
            style={{ willChange: "transform" }}
          >
            <span className="mask">
              <span data-hero-line className="display t-xl block">
                Cold-Pressed
              </span>
            </span>
            <span className="mask">
              <span
                data-hero-line
                className="display t-xl block pl-[6vw] md:pl-[16vw]"
              >
                For a Better
              </span>
            </span>
            <span className="mask">
              <span data-hero-line className="display t-xl block">
                Every Day.
              </span>
            </span>
          </h1>
        </div>
      </div>

      {/* ---- in front of the product ---- */}
      <div className="layer-front -mt-[100svh] h-svh">
        <div
          data-hero-foot
          className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-8 lg:px-10 lg:pb-10"
        >
          <span
            data-hero-rule
            className="mb-6 block h-px origin-left scale-x-0 bg-[color:var(--scene-line)]"
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[34ch]">
              <p data-hero-fade className="t-body opacity-0">
                Freshly pressed in Bangkok.
              </p>
              <a
                data-hero-fade
                href="#our-juice"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#our-juice")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="t-label pointer-events-auto mt-5 inline-flex items-center gap-3 rounded-full border border-[color:var(--scene-fg)] px-6 py-3.5 opacity-0 transition-colors duration-300 hover:bg-[color:var(--scene-fg)] hover:text-[color:var(--scene-bg)]"
              >
                Discover the Juice
                <svg
                  viewBox="0 0 16 16"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  aria-hidden="true"
                >
                  <path d="M8 2v12M3.5 9.5 8 14l4.5-4.5" />
                </svg>
              </a>
            </div>

            <dl
              data-hero-fade
              className="t-label hidden gap-8 opacity-0 sm:flex md:justify-end md:text-right"
            >
              <div>
                <dt className="text-[color:var(--scene-dim)]">Volume</dt>
                <dd className="mt-1.5">300 ml</dd>
              </div>
              <div>
                <dt className="text-[color:var(--scene-dim)]">Blend</dt>
                <dd className="mt-1.5">Original Kick-Start</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
