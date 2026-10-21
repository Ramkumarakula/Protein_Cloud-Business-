"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { items, type FoodItem } from "@/data/items";
import { FoodImage } from "@/components/ui/FoodImage";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Transition } from "motion/react";

export const itemLayoutId = (id: string) => `plate-item-${id}`;

/**
 * The 12 items. On md+ they sit on a true circle around the plate using
 * rotate(θ) translate(radius) rotate(-θ); below md the same buttons become a
 * horizontally scrolling chip row under the plate.
 */
export function ItemRing({
  selected,
  onToggle,
  transition,
}: {
  selected: string[];
  onToggle: (item: FoodItem) => void;
  transition: Transition;
}) {
  const step = 360 / items.length;
  return (
    <motion.ul
      layoutScroll
      aria-label="Food items"
      data-testid="item-ring"
      className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-3 md:pointer-events-none md:absolute md:inset-0 md:mx-0 md:block md:overflow-visible md:p-0"
    >
      {items.map((item, i) => {
        const isOn = selected.includes(item.id);
        return (
          <li
            key={item.id}
            className="shrink-0 snap-start md:absolute md:top-1/2 md:left-1/2 md:w-[13%] md:[transform:translate(-50%,-50%)_rotate(var(--a))_translateX(var(--r))_rotate(calc(var(--a)*-1))]"
            style={{ "--a": `${-90 + i * step}deg`, "--r": "min(41cqw, 300px)" } as CSSProperties}
          >
            <button
              type="button"
              aria-pressed={isOn}
              aria-label={`${item.name}, ${item.kcal} kcal, ${item.protein} g protein`}
              onClick={() => onToggle(item)}
              data-testid={`builder-item-${item.id}`}
              className={cn(
                "group flex w-[5.5rem] flex-col items-center gap-1 rounded-2xl p-1.5 text-center transition-colors md:pointer-events-auto md:w-full md:rounded-full",
                "hover:bg-white/60 max-md:bg-white/50",
                isOn && "max-md:bg-white",
              )}
            >
              <span className="relative block aspect-square w-14 md:w-full">
                {isOn ? (
                  <span
                    aria-hidden
                    className="border-custom/60 bg-custom/10 absolute inset-[8%] grid place-items-center rounded-full border-2 border-dashed"
                  >
                    <Check className="text-custom size-5" strokeWidth={3} />
                  </span>
                ) : (
                  <motion.span
                    layoutId={itemLayoutId(item.id)}
                    transition={transition}
                    className="block transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95"
                  >
                    <FoodImage
                      src={item.image}
                      alt=""
                      label={item.name}
                      fallback="chip"
                      accent="#4CAF7A"
                      sizes="96px"
                    />
                  </motion.span>
                )}
              </span>
              <span className="text-ink text-[11px] leading-tight font-medium">{item.name}</span>
              <span className="text-muted text-[10px] leading-none">
                +{formatPrice(item.price)}
              </span>
            </button>
          </li>
        );
      })}
    </motion.ul>
  );
}
