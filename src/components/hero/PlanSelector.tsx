"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { plans } from "@/data/plans";
import { FoodImage } from "@/components/ui/FoodImage";
import { usePlanSwitcher } from "@/hooks/usePlanSwitcher";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CROSSFADE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/cn";

export const planTabId = (key: string) => `plan-tab-${key}`;

const chevron =
  "grid size-9 shrink-0 place-items-center rounded-full text-ink/70 transition hover:bg-white/70 hover:text-ink";

/** Thumbnail tabs. The white pill behind the active plan slides between tabs (layoutId). */
export function PlanSelector() {
  const { index, goTo, next, prev } = usePlanSwitcher();
  const reduce = useReducedMotion();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (i: number) => {
    const target = (i + plans.length) % plans.length;
    goTo(target);
    tabs.current[target]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(index + 1),
      ArrowLeft: () => focusTab(index - 1),
      Home: () => focusTab(0),
      End: () => focusTab(plans.length - 1),
    };
    const action = keys[e.key];
    if (!action) return;
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div className="flex items-center justify-center gap-1 lg:justify-start">
      <button type="button" aria-label="Previous plan" onClick={prev} className={chevron}>
        <ChevronLeft aria-hidden className="size-5" />
      </button>
      <div
        role="tablist"
        aria-label="Meal plans"
        className="no-scrollbar flex snap-x snap-mandatory gap-1 overflow-x-auto px-1 py-2"
      >
        {plans.map((plan, i) => {
          const active = i === index;
          return (
            <button
              key={plan.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={planTabId(plan.key)}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls="plan-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => goTo(i)}
              onKeyDown={onKeyDown}
              data-testid={`plan-tab-${plan.key}`}
              className="relative flex w-[5.25rem] shrink-0 snap-center flex-col items-center rounded-full px-2 pt-2.5 pb-4 sm:w-[6.5rem] lg:w-[5.5rem]"
            >
              {active && (
                <motion.span
                  layoutId="plan-pill"
                  aria-hidden
                  className="shadow-soft absolute inset-0 rounded-full bg-white"
                  transition={reduce ? CROSSFADE : SPRING}
                />
              )}
              <span
                className={cn(
                  "relative block size-16 transition-transform duration-300 sm:size-[4.5rem]",
                  !active && "scale-90 opacity-80",
                )}
              >
                <FoodImage
                  src={plan.thumb ?? plan.plate}
                  alt=""
                  label={plan.name.slice(0, 1)}
                  accent={plan.accent}
                  sizes="96px"
                  className="text-base"
                />
              </span>
              <span className="relative mt-2 text-xs font-medium whitespace-nowrap">
                {plan.name}
              </span>
            </button>
          );
        })}
      </div>
      <button type="button" aria-label="Next plan" onClick={next} className={chevron}>
        <ChevronRight aria-hidden className="size-5" />
      </button>
    </div>
  );
}
