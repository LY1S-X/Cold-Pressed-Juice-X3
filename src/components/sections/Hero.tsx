"use client";

import { useEffect, useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { SCENES, resolveKeyframe, useSceneChoreography, setTheme } from "@/lib/choreography";
import { SCENE } from "@/lib/scene-state";
import { readDevice, prefersReducedMotion } from "@/lib/breakpoints";
import { THEMES } from "@/lib/brand";
import styles from "./Hero.module.css";

export function Hero({ started }: { started: boolean }) {
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
    theme: "cream", start: "top top", end: "bottom top",
    build: (tl) => {
      tl.to("[data-hero-shadow]", { opacity: 0, duration: 0.2 }, 0);
      tl.to("[data-hero-type]", { yPercent: -16, duration: 1 }, 0);
      tl.to("[data-hero-copy]", { y: -35, opacity: 0, duration: 0.5 }, 0);
      tl.to("[data-hero-foot]", { opacity: 0, duration: 0.35 }, 0);
    },
  });

  useEffect(() => {
    if (!started) return;
    const target = resolveKeyframe(SCENES.hero[0], readDevice());
    let release = () => {};
    const ctx = gsap.context(() => {
      if (prefersReducedMotion() || window.scrollY > 1) {
        if (window.scrollY < 1) Object.assign(SCENE, target);
        gsap.set("[data-hero-line], [data-hero-fade]", { y: 0, yPercent: 0, opacity: 1 });
        gsap.set("[data-hero-rule]", { scaleX: 1 });
        return;
      }
      // Reveal in place, keeping the complete product inside its column.
      Object.assign(SCENE, { ...target, height: (target.height ?? 0.7) * 0.96 });
      const productIntro = gsap.to(SCENE, { ...target, duration: 1.4, ease: "expo.out" });
      release = () => productIntro.kill();
      window.addEventListener("wheel", release, { passive: true, once: true });
      window.addEventListener("touchmove", release, { passive: true, once: true });
      window.addEventListener("keydown", release, { once: true });
      window.addEventListener("resize", release, { once: true });
      gsap.timeline()
        .fromTo("[data-hero-line]", { yPercent: 115 },
          { yPercent: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.08)
        .fromTo("[data-hero-fade]", { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: "power3.out" }, 0.5)
        .fromTo("[data-hero-rule]", { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "expo.inOut", transformOrigin: "left center" }, 0.4);
    }, ref);
    return () => {
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", release);
      window.removeEventListener("resize", release);
      ctx.revert();
    };
  }, [started]);

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
            <p data-hero-fade className={`t-body opacity-0 ${styles.support}`}>Freshly pressed in Bangkok.</p>
            <a data-hero-fade href="#our-juice"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#our-juice")?.scrollIntoView({
                  behavior: prefersReducedMotion() ? "instant" : "smooth",
                });
              }} className={`t-label opacity-0 ${styles.cta}`}>
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
          <div data-hero-fade className={`t-label opacity-0 ${styles.details}`}>
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
