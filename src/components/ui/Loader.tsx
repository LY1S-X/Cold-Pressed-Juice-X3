"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useProgress } from "@react-three/drei";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/breakpoints";
import { onProductReady } from "@/lib/ready";
import styles from "./Loader.module.css";

/** Product readiness releases the loader; retain the slow-network fail-safe. */
export function Loader({ onDone }: { onDone?: () => void }) {
  const { progress } = useProgress();
  const root = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const counter = useRef({ value: 0 });
  const settled = useRef(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (settled.current) return;
    const tween = gsap.to(counter.current, {
      value: Math.max(counter.current.value, Math.min(96, progress)),
      duration: 0.7, ease: "power2.out",
      onUpdate: () => {
        if (number.current) number.current.textContent = String(Math.round(counter.current.value)).padStart(3, "0");
      },
    });
    return () => { tween.kill(); };
  }, [progress]);

  useEffect(() => {
    settled.current = false;
    const mounted = Date.now();
    let timeline: gsap.core.Timeline | undefined;
    let timer: number | undefined;
    const finish = () => {
      if (settled.current) return;
      settled.current = true;
      const wait = Math.max(0, 850 - (Date.now() - mounted));
      const done = () => { setGone(true); onDone?.(); };
      if (prefersReducedMotion()) {
        if (number.current) number.current.textContent = "100";
        timer = window.setTimeout(done, wait);
        return;
      }
      timeline = gsap.timeline({ delay: wait / 1000, onComplete: done });
      timeline.to(counter.current, {
        value: 100, duration: 0.5, overwrite: true,
        onUpdate: () => {
          if (number.current) number.current.textContent = String(Math.round(counter.current.value)).padStart(3, "0");
        },
      }).to(root.current, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "+=0.1");
    };
    const off = onProductReady(finish);
    const bail = window.setTimeout(finish, 6000);
    return () => { off(); clearTimeout(bail); clearTimeout(timer); timeline?.kill(); };
  }, [onDone]);

  if (gone) return null;
  return (
    <div ref={root} className={styles.loader} role="status" aria-live="polite">
      <span className="sr-only">Loading Conscious Choice</span>
      <div className={styles.center} aria-hidden="true">
        <div className={styles.fruit}>
          <Image src="/pineapple-loader.webp" alt="" width={538} height={800} preload unoptimized className={styles.image} />
        </div>
        <div className={styles.counter}><span ref={number}>000</span><span className={styles.percent}>%</span></div>
      </div>
      <div className={styles.brand} aria-hidden="true">Conscious Choice<span>Nourish your body. Honor the Earth.</span></div>
    </div>
  );
}
