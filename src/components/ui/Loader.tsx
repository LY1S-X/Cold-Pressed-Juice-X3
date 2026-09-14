"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/breakpoints";
import { onProductReady } from "@/lib/ready";

/**
 * Brand loader. No browser-chrome percentage widget — a wordmark, a rule that
 * draws itself, and a clean wipe into the hero. It clears on the product's own
 * ready signal, with a hard ceiling so a slow network can never trap the page.
 */
export function Loader({ onDone }: { onDone?: () => void }) {
  const { progress } = useProgress();
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const settled = useRef(false);
  const mounted = useRef(0);

  useEffect(() => {
    if (!bar.current) return;
    gsap.to(bar.current, {
      scaleX: Math.max(0.05, Math.min(0.96, progress / 100)),
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [progress]);

  useEffect(() => {
    mounted.current = Date.now();

    const finish = () => {
      if (settled.current) return;
      settled.current = true;

      const wait = Math.max(0, 850 - (Date.now() - mounted.current));
      const done = () => {
        setGone(true);
        onDone?.();
      };

      if (prefersReducedMotion()) {
        window.setTimeout(done, wait);
        return;
      }

      const lines = root.current?.querySelectorAll("[data-loader-line]") ?? [];
      const tl = gsap.timeline({ delay: wait / 1000, onComplete: done });
      tl.to(bar.current, { scaleX: 1, duration: 0.5, ease: "power3.inOut", overwrite: true })
        .to(lines, { yPercent: -130, duration: 0.8, stagger: 0.07, ease: "expo.inOut" }, "-=0.12")
        .to(root.current, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "-=0.5");
    };

    const off = onProductReady(finish);
    const bail = window.setTimeout(finish, 6000);
    return () => {
      off();
      clearTimeout(bail);
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-cream px-5 pb-10 pt-28 text-ink md:px-8"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading Conscious Choice</span>

      <div aria-hidden="true">
        <span className="mask block">
          <span data-loader-line className="display t-xl block">
            Conscious
          </span>
        </span>
        <span className="mask block">
          <span data-loader-line className="display t-xl block pl-[8vw]">
            Choice
          </span>
        </span>
      </div>

      <div aria-hidden="true" className="flex items-end justify-between gap-6">
        <span className="mask block">
          <span data-loader-line className="t-label block max-w-[18ch] text-ink/55">
            Cold-Pressed Juice — Bangkok
          </span>
        </span>
        <span className="relative block h-px w-[48vw] max-w-[520px] bg-ink/15">
          <span ref={bar} className="absolute inset-0 block origin-left scale-x-0 bg-ink" />
        </span>
      </div>
    </div>
  );
}
