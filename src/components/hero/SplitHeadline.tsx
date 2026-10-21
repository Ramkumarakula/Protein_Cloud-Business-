"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Plan } from "@/data/plans";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CROSSFADE } from "@/lib/motion";

const ENTER_STAGGER = 0.025;
const EXIT_STAGGER = 0.02;

function Chars({
  text,
  offset,
  total,
  className,
}: {
  text: string;
  offset: number;
  total: number;
  className: string;
}) {
  return (
    <span className={className}>
      {Array.from(text).map((char, i) => {
        const index = offset + i;
        return (
          <motion.span
            key={index}
            className="inline-block whitespace-pre"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: index * ENTER_STAGGER, duration: 0.35, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: 12,
              // Exit staggers from the right end of the headline.
              transition: { delay: (total - 1 - index) * EXIT_STAGGER, duration: 0.2 },
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

const lightClass =
  "block text-[clamp(1.6rem,3.6vw,3.25rem)] font-light tracking-[0.08em] text-ink/80";
const heavyClass = "block text-[clamp(2.75rem,6.6vw,7rem)] font-extrabold tracking-[-0.02em]";

/** Two-line headline. Characters stagger out from the right and in from the left. */
export function SplitHeadline({ plan }: { plan: Plan }) {
  const reduce = useReducedMotion();
  const total = plan.titleLight.length + plan.titleHeavy.length;

  return (
    <h1
      id="hero-heading"
      data-testid="hero-headline"
      className="font-display relative leading-[0.9] uppercase"
    >
      <span className="sr-only">
        {plan.titleLight} {plan.titleHeavy}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        {reduce ? (
          <motion.span
            key={plan.key}
            aria-hidden
            className="block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: CROSSFADE }}
            exit={{ opacity: 0, transition: CROSSFADE }}
          >
            <span className={lightClass}>{plan.titleLight}</span>
            <span className={heavyClass}>{plan.titleHeavy}</span>
          </motion.span>
        ) : (
          <motion.span key={plan.key} aria-hidden className="block" exit={{ opacity: 1 }}>
            <Chars text={plan.titleLight} offset={0} total={total} className={lightClass} />
            <Chars
              text={plan.titleHeavy}
              offset={plan.titleLight.length}
              total={total}
              className={heavyClass}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </h1>
  );
}
