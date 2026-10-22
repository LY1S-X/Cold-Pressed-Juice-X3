"use client";

import { useRef } from "react";
import { useIsoLayoutEffect } from "@/lib/gsap";
import { SCENES, resolveKeyframe, useSceneChoreography, setTheme } from "@/lib/choreography";
import { SCENE } from "@/lib/scene-state";
import { readDevice, prefersReducedMotion } from "@/lib/breakpoints";
import { THEMES } from "@/lib/brand";
import styles from "./Hero.module.css";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    setTheme(THEMES.cream);
    const fitOpening = () => {
      if (window.scrollY < 1) Object.assign(SCENE, resolveKeyframe(SCENES.hero[0], readDevice()));
    };
    fitOpening();
    window.addEventListener("resize", fitOpening);
    return () => window.removeEventListener("resize", fitOpening);
  }, []);

  // The original exit pose still matches Movement's first keyframe exactly.
  useSceneChoreography(ref, SCENES.hero, {
    theme: "cream", start: "top top", end: "bottom top", fadeOut: false,
    build: (tl) => {
      tl.to("[data-hero-shadow]", { opacity: 0, duration: 0.2 }, 0);
      // The hero leaves naturally with the document, like one continuous page.
    },
  });



  return (
    <section id="top" ref={ref} aria-label="Conscious Choice cold-pressed juice" className={styles.hero}>
      <div className={`layer-behind ${styles.panel}`}>
        <span data-hero-shadow className={styles.shadow} aria-hidden="true" />
        <div className={styles.message}>
          <h1 data-hero-type className={`display ${styles.headline}`}>
            {["Cold-Pressed", "For a Better", "Every Day."].map((line) => (
              <span className="mask" key={line}><span data-hero-line>{line}</span></span>
            ))}
          </h1>
          <div data-hero-copy className={styles.copy}>
            <p data-hero-fade className={`t-body ${styles.support}`}>Freshly made in Bangkok.</p>
            <a data-hero-fade href="#our-juice"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#our-juice")?.scrollIntoView({
                  behavior: prefersReducedMotion() ? "instant" : "smooth",
                });
              }} className={`t-label ${styles.cta}`}>
              Discover the Juice
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                <path d="M8 2v12M3.5 9.5 8 14l4.5-4.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className={`layer-front ${styles.front}`}>
        <div data-hero-foot className={styles.footer}>
          <span data-hero-rule className={styles.rule} />
          <div data-hero-fade className={`t-label ${styles.details}`}>
            <span className={styles.scroll}>Scroll<span aria-hidden="true" /></span>
            <dl className={styles.metadata}>
              <div><dt>Volume</dt><dd>300 ml</dd></div>
              <div><dt>Blend</dt><dd>Original Kick-Start</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
