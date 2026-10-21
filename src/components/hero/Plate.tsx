"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import type { Plan } from "@/data/plans";
import { items } from "@/data/items";
import { FoodImage } from "@/components/ui/FoodImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CROSSFADE, SPRING, SPRING_Y } from "@/lib/motion";

type Custom = { direction: 1 | -1; reduce: boolean; exitDelay: number };

const plateVariants: Variants = {
  enter: ({ direction, reduce }: Custom) =>
    reduce
      ? { opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }
      : { x: `${60 * direction}%`, y: "-70%", rotate: 30 * direction, scale: 0.8, opacity: 0 },
  center: ({ reduce }: Custom) => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: reduce
      ? CROSSFADE
      : { x: SPRING, y: SPRING_Y, rotate: SPRING, scale: SPRING, opacity: { duration: 0.3 } },
  }),
  exit: ({ direction, reduce, exitDelay }: Custom) =>
    reduce
      ? { opacity: 0, transition: CROSSFADE }
      : {
          x: `${-40 * direction}%`,
          y: "-60%",
          rotate: -25 * direction,
          scale: 0.85,
          opacity: 0,
          transition: {
            x: { ...SPRING, delay: exitDelay },
            y: { ...SPRING_Y, delay: exitDelay },
            rotate: { ...SPRING, delay: exitDelay },
            scale: { ...SPRING, delay: exitDelay },
            opacity: { duration: 0.45, delay: exitDelay },
          },
        },
};

/** Items ring around the empty Customize plate. Purely visual; the builder is the real control. */
function HeroItemRing({ reduce }: { reduce: boolean }) {
  const step = 360 / items.length;
  return (
    <motion.div
      aria-hidden
      data-testid="hero-item-ring"
      className="@container pointer-events-none absolute inset-0 z-30"
      initial="hidden"
      animate="shown"
      exit="gone"
      variants={{
        hidden: {},
        shown: { transition: { delayChildren: reduce ? 0 : 0.5, staggerChildren: 0.04 } },
        gone: { transition: { staggerChildren: 0 } },
      }}
    >
      {items.map((item, i) => {
        const angle = -90 + i * step;
        return (
          <div
            key={item.id}
            className="absolute top-1/2 left-1/2 w-[15cqw]"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(58cqw) rotate(${-angle}deg)`,
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: reduce ? 1 : 0.6 },
                shown: { opacity: 1, scale: 1, transition: reduce ? CROSSFADE : SPRING },
                gone: { opacity: 0, scale: reduce ? 1 : 0.8, transition: { duration: 0.15 } },
              }}
            >
              <FoodImage
                src={item.image}
                alt=""
                label={item.name}
                fallback="chip"
                accent="#4CAF7A"
                sizes="96px"
              />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

export function Plate({
  plan,
  direction,
  leavingCustom,
}: {
  plan: Plan;
  direction: 1 | -1;
  leavingCustom: boolean;
}) {
  const reduce = useReducedMotion();
  // When leaving Customize the items fade out first (150ms), then the plate exits.
  const custom: Custom = { direction, reduce, exitDelay: leavingCustom && !reduce ? 0.15 : 0 };
  const isCustom = plan.key === "custom";

  return (
    <div className="relative aspect-square w-full">
      <AnimatePresence initial={false} custom={custom}>
        <motion.div
          key={plan.key}
          data-testid="hero-plate"
          data-plan={plan.key}
          custom={custom}
          variants={plateVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 z-20 will-change-transform"
        >
          <div aria-hidden className="shadow-plate absolute inset-[5%] rounded-full" />
          <FoodImage
            src={plan.plate}
            alt={`${plan.name} plan plate, top down`}
            label={plan.name}
            accent={plan.accent}
            priority={plan.key === "elite"}
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 60vw, 80vw"
            className="relative"
          />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>{isCustom && <HeroItemRing key="ring" reduce={reduce} />}</AnimatePresence>
    </div>
  );
}
