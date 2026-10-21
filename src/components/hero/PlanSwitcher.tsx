"use client";

import type { KeyboardEvent } from "react";
import { motion } from "motion/react";
import { Play, ShoppingBag } from "lucide-react";
import { usePlanSwitcher } from "@/hooks/usePlanSwitcher";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwipe } from "@/hooks/useSwipe";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { requestOrder } from "@/lib/orderPrompt";
import { CROSSFADE, SPRING } from "@/lib/motion";
import { BackdropArc } from "./BackdropArc";
import { DotIndicator } from "./DotIndicator";
import { IconRow } from "./IconRow";
import { InfoCard } from "./InfoCard";
import { Plate } from "./Plate";
import { PlanSelector, planTabId } from "./PlanSelector";
import { SplitHeadline } from "./SplitHeadline";

const textAction =
  "inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline";

export function PlanSwitcher() {
  const { plan, direction, previousKey, next, prev } = usePlanSwitcher();
  const reduce = useReducedMotion();
  const swipe = useSwipe({ onLeft: next, onRight: prev });
  const isCustom = plan.key === "custom";
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // ArrowLeft/ArrowRight anywhere inside the hero switches plans.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable]")) return;
    e.preventDefault();
    if (e.key === "ArrowRight") next();
    else prev();
  };

  return (
    <section
      id="plans"
      aria-labelledby="hero-heading"
      onKeyDown={onKeyDown}
      className="relative isolate overflow-hidden pt-24 pb-0 sm:pb-10 lg:flex lg:min-h-svh lg:items-center lg:pt-24 lg:pb-8"
    >
      <BackdropArc accent={plan.accent} />
      <DotIndicator />
      <p aria-live="polite" className="sr-only" data-testid="plan-announcer">
        {`Showing ${plan.name} plan`}
      </p>

      {/* Desktop: plate | headline + selector | info card. Mobile and tablet stack. */}
      <div className="grid w-full grid-cols-1 items-center gap-y-6 px-4 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(320px,360px)] lg:grid-rows-[1fr_auto] lg:gap-x-6 lg:gap-y-4 lg:px-12 xl:pr-[max(3rem,calc((100vw-1600px)/2+3rem))]">
        {/* Plate: bleeds off the left edge on desktop; shrinks (and on desktop nudges right) for the Customize ring. */}
        <motion.div
          className="relative z-20 mx-auto w-[70vw] max-w-[440px] touch-pan-y md:w-[56vw] md:max-w-[520px] lg:col-[1/2] lg:row-[1/3] lg:mx-0 lg:-ml-[16%] lg:w-[116%] lg:max-w-[82svh]"
          initial={false}
          animate={{ x: isCustom && isDesktop ? "12%" : "0%", scale: isCustom ? 0.66 : 1 }}
          transition={reduce ? CROSSFADE : SPRING}
          {...swipe}
        >
          <Plate plan={plan} direction={direction} leavingCustom={previousKey === "custom"} />
        </motion.div>

        <div className="relative z-10 text-center lg:col-[2/3] lg:row-[1/2] lg:self-end lg:pl-10 lg:text-left">
          <p className="text-muted mb-4 text-xs font-medium">{plan.eyebrow}</p>
          <SplitHeadline plan={plan} />
          <div className="mt-6 flex items-center justify-center gap-6 lg:justify-start">
            <a href="#how" className={textAction}>
              <span className="shadow-soft grid size-8 place-items-center rounded-full bg-white">
                <Play aria-hidden className="size-3.5 fill-current" />
              </span>
              How it works
            </a>
            {isCustom ? (
              <a href="#build" className={textAction} data-testid="hero-order">
                <ShoppingBag aria-hidden className="size-4" />
                Build my plate
              </a>
            ) : (
              <button
                type="button"
                onClick={requestOrder}
                className={textAction}
                data-testid="hero-order"
              >
                <ShoppingBag aria-hidden className="size-4" />
                Order now
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4 lg:col-[2/3] lg:row-[2/3] lg:pl-4">
          <PlanSelector />
          <div className="hidden sm:block lg:pl-6">
            <IconRow />
          </div>
        </div>

        <div className="relative z-30 -mx-4 sm:mx-0 lg:col-[3/4] lg:row-[1/3] lg:self-center">
          <InfoCard plan={plan} tabId={planTabId(plan.key)} />
        </div>
      </div>
    </section>
  );
}
