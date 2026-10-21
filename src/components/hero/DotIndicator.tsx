"use client";

import { motion } from "motion/react";
import { plans } from "@/data/plans";
import { usePlanSwitcher } from "@/hooks/usePlanSwitcher";
import { SPRING } from "@/lib/motion";

/** Vertical dots in the left gutter. Mouse shortcut only; the tabs are the keyboard control. */
export function DotIndicator() {
  const { index, goTo } = usePlanSwitcher();
  return (
    <div
      aria-hidden
      className="glass shadow-soft absolute top-1/2 left-3 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-full px-1 py-2 lg:flex xl:left-5"
    >
      {plans.map((plan, i) => (
        <button
          key={plan.key}
          type="button"
          tabIndex={-1}
          onClick={() => goTo(i)}
          className="grid size-5 place-items-center"
        >
          <motion.span
            className="block rounded-full"
            initial={false}
            animate={{
              width: i === index ? 10 : 6,
              height: i === index ? 26 : 6,
              backgroundColor: i === index ? "#1E1E1E" : "rgba(30,30,30,0.25)",
            }}
            transition={SPRING}
          />
        </button>
      ))}
    </div>
  );
}
