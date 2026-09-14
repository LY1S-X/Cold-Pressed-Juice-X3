"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { Wordmark } from "@/components/ui/Icons";

const LINKS = [
  { label: "Our Juice", href: "#our-juice" },
  { label: "Why Cold Pressed", href: "#why-cold-pressed" },
  { label: "Story", href: "#story" },
];

export function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  /* Colour comes from --scene-fg, so the bar re-tints itself as the colour
     blocks change. Only the density changes on scroll. */
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => {
          gsap.to(el, {
            "--nav-pad": self.isActive ? "0.85rem" : "1.6rem",
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <header
        ref={ref}
        style={{ ["--nav-pad" as string]: "1.6rem" }}
        className="fixed inset-x-0 top-0 z-50 text-[color:var(--scene-fg)] mix-blend-normal"
      >
        <nav
          aria-label="Primary"
          className="flex items-center justify-between px-5 md:px-8 lg:px-10"
          style={{ paddingTop: "var(--nav-pad)", paddingBottom: "var(--nav-pad)" }}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5"
          >
            <Wordmark className="h-6 w-6 shrink-0 md:h-7 md:w-7" />
            <span className="t-label leading-none">Conscious Choice</span>
            <span className="sr-only">Conscious Choice — home</span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
                }}
                className="t-label link-u"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#order"
              onClick={(e) => {
                e.preventDefault();
                go("#order");
              }}
              className="t-label rounded-full border border-current px-5 py-2.5 transition-colors duration-300 hover:bg-[color:var(--scene-fg)] hover:text-[color:var(--scene-bg)]"
            >
              Order Now
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="t-label flex items-center gap-2 lg:hidden"
          >
            {open ? "Close" : "Menu"}
            <span className="relative block h-3 w-4">
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-300"
                style={{ top: open ? "6px" : "2px", transform: open ? "rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-300"
                style={{ top: open ? "6px" : "9px", transform: open ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-[color:var(--scene-bg)] text-[color:var(--scene-fg)] lg:hidden"
      >
        <div className="flex h-full flex-col justify-between px-5 pb-10 pt-28">
          <ul className="space-y-1">
            {[...LINKS, { label: "Order Now", href: "#order" }].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.href);
                  }}
                  className="display t-lg block py-1"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="t-label text-[color:var(--scene-dim)]">
            Cold-Pressed Juice · Bangkok, Thailand
          </p>
        </div>
      </div>
    </>
  );
}
