"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/breakpoints";
import { onProductReady } from "@/lib/ready";
import styles from "./Loader.module.css";

/** Product readiness releases the loader; retain the slow-network fail-safe. */
export function Loader({ onDone }: { onDone?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const counter = useRef({ value: 1 });
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // The counter is a timed brand intro, not network progress. Keep the actual
    // readiness gate independent so a slow product never reveals a blank hero.
    let ready = false;
    let counted = false;
    let finished = false;
    let timeline: gsap.core.Timeline | undefined;
    const finish = () => {
      if (finished || !ready || !counted) return;
      finished = true;
      const done = () => { setGone(true); onDone?.(); };
      if (prefersReducedMotion()) {
        done();
        return;
      }
      timeline = gsap.timeline({ onComplete: done });
      timeline.to(root.current, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 0.1);
    };
    counter.current.value = 1;
    const tween = gsap.to(counter.current, {
      value: 100, duration: 1.3, ease: "none",
      onUpdate: () => {
        if (number.current) number.current.textContent = String(Math.round(counter.current.value)).padStart(3, "0");
      },
      onComplete: () => { counted = true; finish(); },
    });
    const release = () => { ready = true; finish(); };
    const off = onProductReady(release);
    const bail = window.setTimeout(release, 6000);
    return () => { off(); clearTimeout(bail); tween.kill(); timeline?.kill(); };
  }, [onDone]);

  if (gone) return null;
  return (
    <div ref={root} className={styles.loader} role="status" aria-live="polite">
      <span className="sr-only">Loading Conscious Choice</span>
      <div className={styles.center} aria-hidden="true">
        <div className={styles.fruit}>
          <Image src="/pineapple-loader.webp" alt="" width={538} height={800} preload unoptimized className={styles.image} />
        </div>
        <div className={styles.counter}><span ref={number}>001</span><span className={styles.percent}>%</span></div>
      </div>
      <div className={styles.brand} aria-hidden="true">Conscious Choice<span>Nourish your body. Honor the Earth.</span></div>
    </div>
  );
}
