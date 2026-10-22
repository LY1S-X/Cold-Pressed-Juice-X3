"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/breakpoints";
import { onProductReady } from "@/lib/ready";
import styles from "./Loader.module.css";

/** Product readiness releases the loader; retain the slow-network fail-safe. */
export function Loader({ onDone }: { onDone?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const counter = useRef({ value: 1 });
  const fill = useRef<SVGRectElement>(null);
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
      timeline.fromTo("[data-loader-page]", { y: window.innerHeight }, {
        y: 0, duration: 0.95, ease: "expo.inOut", clearProps: "transform",
      }, 0.1);
    };
    counter.current.value = 1;
    const tween = gsap.to(counter.current, {
      value: 100, duration: 1.3, ease: "sine.inOut",
      onUpdate: () => {
        if (number.current) number.current.textContent = String(Math.round(counter.current.value)).padStart(3, "0");
        const height = 740 * counter.current.value / 100;
        fill.current?.setAttribute("y", String(760 - height));
        fill.current?.setAttribute("height", String(height));
      },
      onComplete: () => { counted = true; finish(); },
    });
    const release = () => { ready = true; finish(); };
    const off = onProductReady(release);
    const bail = window.setTimeout(release, 6000);
    return () => {
      off(); clearTimeout(bail); tween.kill(); timeline?.kill();
      gsap.set("[data-loader-page]", { clearProps: "transform" });
    };
  }, [onDone]);

  if (gone) return null;
  return (
    <div ref={root} className={styles.loader} role="status" aria-live="polite">
      <span className="sr-only">Loading Conscious Choice</span>
      <div className={styles.center} aria-hidden="true">
        <div className={styles.fruit}>
          <svg viewBox="560 20 400 740" className={styles.image} aria-hidden="true">
            <defs>
              <linearGradient id="pineapple-fill-colors" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="760">
                <stop offset="0%" stopColor="#91b85a" />
                <stop offset="52%" stopColor="#91b85a" />
                <stop offset="54%" stopColor="#ff870a" />
                <stop offset="100%" stopColor="#ff870a" />
              </linearGradient>
              {/* Isolate the approved ivory artwork without redrawing its silhouette. */}
              <filter id="pineapple-ink" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2 0 0 0 -0.5" />
              </filter>
              <mask id="pineapple-art" maskUnits="userSpaceOnUse" x="560" y="20" width="400" height="740" style={{ maskType: "alpha" }}>
                <image href="/pineapple-botanical-reference.png" width="1536" height="1024" filter="url(#pineapple-ink)" />
              </mask>
            </defs>
            <g mask="url(#pineapple-art)">
              <rect x="560" y="20" width="400" height="740" fill="#f4f1e8" />
              <rect ref={fill} x="560" y="752.6" width="400" height="7.4" fill="url(#pineapple-fill-colors)" />
            </g>
          </svg>
        </div>
        <div className={styles.counter}><span ref={number}>001</span><span className={styles.percent}>%</span></div>
      </div>
      <div className={styles.brand} aria-hidden="true">Conscious Choice<span>Nourish your body. Honor the Earth.</span></div>
    </div>
  );
}
