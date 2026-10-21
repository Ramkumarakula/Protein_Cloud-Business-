"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faq } from "@/data/faq";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <section id="faq" aria-labelledby="faq-heading" className="px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <SectionHeading id="faq-heading" light="GOOD" heavy="QUESTIONS" />
        </Reveal>
        <Reveal>
          <ul className="divide-ink/10 bg-card shadow-card divide-y rounded-3xl px-6">
            {faq.map((entry, i) => {
              const isOpen = open === i;
              const buttonId = `${uid}-q${i}`;
              const panelId = `${uid}-a${i}`;
              return (
                <li key={entry.q}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 rounded-xl py-5 text-left font-medium"
                    >
                      {entry.q}
                      <Plus
                        aria-hidden
                        className={`size-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted pb-5 text-sm leading-relaxed">{entry.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
