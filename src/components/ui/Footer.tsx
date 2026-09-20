"use client";

import { useRef } from "react";
import { useSceneChoreography, type Keyframe } from "@/lib/choreography";
import { PRODUCT } from "@/lib/brand";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import styles from "./Footer.module.css";

/** The product bows out as the footer arrives, so the closing frame is clean. */
const EXIT: Keyframe[] = [
  {
    at: 0,
    pose: { nx: 0, ny: 0.02, height: 1.18, ry: 0.34, rz: 0 },
    mobile: { nx: 0, ny: 0.1, height: 0.65 },
  },
  {
    at: 1,
    pose: { nx: 0.06, ny: -1.7, height: 1.0, ry: 0.6, rz: 0.05, shadowMul: 0 },
    mobile: { nx: 0.04, ny: -1.7, height: 0.56 },
    ease: "power2.in",
  },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo("[data-footer-line]", { yPercent: 105, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 30%", once: true },
      });
    }, ref);
    return () => media.revert();
  }, []);
  useSceneChoreography(ref, EXIT, {
    theme: "ink",
    start: "top bottom",
    end: "top 35%",
  });

  return (
    <footer
      ref={ref}
      className={`relative z-30 px-5 pb-10 text-[color:var(--scene-fg)] md:px-8 lg:px-10 ${styles.footer}`}
    >
      <div className={styles.signature}>
        <p className={`display ${styles.motto}`}>
          <span className={styles.mask}><span data-footer-line>Nourish your body.</span></span>
          <span className={styles.mask}><span data-footer-line className="text-[#F4700A]">Honor the Earth.</span></span>
        </p>
      </div>
      <div className="rule mb-8" />
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display t-sm tracking-[0.06em]">Conscious Choice</p>
          <p className="t-label mt-3 text-[color:var(--scene-dim)]">
            {PRODUCT.city}, Thailand
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            { label: "Instagram", href: "https://instagram.com" },
            { label: "Contact", href: "mailto:hello@consciouschoice.co" },
            { label: "Privacy", href: "#privacy" },
            { label: "Terms", href: "#terms" },
          ].map((l) => (
            <a key={l.label} href={l.href} className="t-label link-u">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="t-label mt-12 text-[color:var(--scene-dim)]">
        © {new Date().getFullYear()} Conscious Choice
      </p>
    </footer>
  );
}
