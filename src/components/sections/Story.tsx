"use client";

import { useRef } from "react";
import { SCENES, useSceneChoreography } from "@/lib/choreography";
import { SectionIndex } from "@/components/ui/SectionIndex";
import styles from "./Story.module.css";

/** Scene 08 — the page exhales. More air, slower motion, product stepped back. */
export function Story() {
  const ref = useRef<HTMLElement>(null);

  useSceneChoreography(ref, SCENES.story, {
    theme: "beige",
    build: (tl) => {
      tl.fromTo("[data-story-shadow]", { opacity: 0 }, { opacity: 1, duration: 0.18 }, 0.12);
      tl.to("[data-story-shadow]", { opacity: 0, duration: 0.08 }, 0.66);
      tl.fromTo(
        "[data-story-line]",
        { yPercent: 115 },
        { yPercent: 0, ease: "expo.out", duration: 0.24, stagger: 0.05 },
        0.04,
      );
      tl.fromTo(
        "[data-story-fade]",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.2, stagger: 0.05 },
        0.16,
      );
      tl.fromTo(
        "[data-story-rule]",
        { scaleX: 0 },
        { scaleX: 1, ease: "power2.out", duration: 0.3, transformOrigin: "left center" },
        0.1,
      );
    },
  });

  return (
    <section
      id="story"
      ref={ref}
      aria-labelledby="story-title"
      className="relative h-[190svh] md:h-[220svh]"
    >
      <div className="layer-behind h-svh" aria-hidden="true">
        <div data-story-shadow className={styles.shadow} />
      </div>
      <div className="layer-front -mt-[100svh] h-svh">
        <div className={styles.index}>
          <SectionIndex n="08" label="The Idea" />
        </div>

        <div className={styles.content}>
          <div>
            <h2 id="story-title" className={`display ${styles.title}`}>
              {["Simple,", "on purpose."].map((l) => (
                <span key={l} className="mask block">
                  <span data-story-line className="no-wrap block">
                    {l}
                  </span>
                </span>
              ))}
            </h2>

            <p data-story-fade className={styles.copy}>
              Made fresh in Bangkok for people who want better choices without
              making life complicated.
            </p>
            <p
              data-story-fade
              className={`${styles.copy} ${styles.secondary}`}
            >
              We’re not trying to put everything into one bottle. Just real
              ingredients, cold-pressed juice and fresh preparation. That’s Conscious Choice.
            </p>
            <div className={styles.ingredients}>
              <span data-story-rule className={styles.rule} />
              <ol data-story-fade>
                {["Pineapple", "Apple", "Carrot", "Ginger"].map((name, i) => (
                  <li key={name}><span>0{i + 1}</span><strong>{name}</strong></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div data-story-fade className={styles.footer}>
          <span>Conscious Choice</span><span>Bangkok, Thailand</span>
        </div>
      </div>
    </section>
  );
}
