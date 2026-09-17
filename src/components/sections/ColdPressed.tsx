"use client";
import { useRef } from "react";
import { SCENES, useSceneChoreography } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";
import styles from "./ColdPressed.module.css";

export function ColdPressed() {
  const ref = useRef<HTMLElement>(null);
  useSceneChoreography(ref, SCENES.coldPressed, {
    theme: "cream",
    build: (tl) => {
      tl.fromTo("[data-cp-line]", { yPercent: 105 }, { yPercent: 0, duration: .18, stagger: .025, ease: "power2.out" }, 0);
      tl.fromTo("[data-cp-detail]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .16, stagger: .025, ease: "power2.out" }, .08);
      tl.fromTo("[data-cp-ground]", { opacity: 0 }, { opacity: 1, duration: .12 }, .16);
      tl.to("[data-cp-ground]", { opacity: 0, duration: .1 }, .76);
    },
  });
  return (
    <section id="why-cold-pressed" ref={ref} aria-labelledby="coldpressed-title" className="relative h-[260svh] md:h-[320svh]">
      <div className="layer-behind h-svh overflow-hidden">
        <div data-cp-ground className={`${styles.rings} opacity-0`} aria-hidden="true"><i /><i /><i /><i /><span className={styles.annotation}>Hydraulic pressure</span></div>
        <div data-cp-ground className={`${styles.shadow} opacity-0`} aria-hidden="true" />
      </div>
      <div className="layer-front -mt-[100svh] h-svh">
        <div data-cp-detail className={`${styles.index} opacity-0`}><SectionIndex n="06" label="Why Cold Pressed" /></div>
        <div className={styles.content}>
          <h2 id="coldpressed-title" className={`display ${styles.title}`}>
            {["Less heat.", "More of", "What matters."].map(line => <span className="mask" key={line}><span data-cp-line>{line}</span></span>)}
          </h2>
          <p data-cp-detail className={`${styles.copy} opacity-0`}>Cold pressing uses hydraulic pressure rather than high-speed, heat-intensive processing — helping preserve the fresh taste and character of the ingredients.</p>
        </div>
        <ul data-cp-detail className={`${styles.steps} opacity-0`}>
          {["Press slowly", "Keep it cold", "Taste the difference"].map((step, i) => <li key={step}>
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {i === 0 ? <path d="M24 4C19 12 10 22 10 30a14 14 0 0 0 28 0C38 22 29 12 24 4Z" /> : i === 1 ? <path d="M24 3v42M6 13l36 22M6 35l36-22M18 7l6 5 6-5M18 41l6-5 6 5M7 20l7-2 1-7M33 37l1-7 7-2M7 28l7 2 1 7M33 11l1 7 7 2" /> : <path d="M39 4C15 8 6 18 11 34c15 9 29-6 28-30ZM10 44l23-30M18 31l-1-10M24 24l9-1" />}
            </svg><span>{step}</span>
          </li>)}
        </ul>
        <footer data-cp-detail className={`${styles.footer} opacity-0`}><span>Slow press. Full character.</span><span>Conscious Choice / 300 ml</span></footer>
      </div>
    </section>
  );
}
