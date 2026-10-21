"use client";

import { motion, type Transition } from "motion/react";
import type { FoodItem } from "@/data/items";
import { FoodImage } from "@/components/ui/FoodImage";
import { itemLayoutId } from "./ItemRing";

/** Six landing spots on a hexagon around the plate centre, as % offsets of the plate size. */
const SLOTS = [-90, -30, 30, 90, 150, 210].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * 22, y: Math.sin(rad) * 22 };
});

export function PlateSlot({
  item,
  slot,
  onRemove,
  transition,
}: {
  item: FoodItem;
  slot: number;
  onRemove: (item: FoodItem) => void;
  transition: Transition;
}) {
  const pos = SLOTS[slot % SLOTS.length];
  return (
    <motion.button
      type="button"
      layoutId={itemLayoutId(item.id)}
      transition={transition}
      onClick={() => onRemove(item)}
      aria-label={`Remove ${item.name} from plate`}
      data-testid={`plate-slot-${item.id}`}
      className="absolute w-[30%] rounded-full focus-visible:outline-offset-0"
      style={{ left: `${50 + pos.x - 15}%`, top: `${50 + pos.y - 15}%` }}
    >
      <FoodImage
        src={item.image}
        alt=""
        label={item.name}
        fallback="chip"
        accent="#4CAF7A"
        sizes="160px"
        className="drop-shadow-[0_6px_8px_rgba(0,0,0,0.12)]"
      />
    </motion.button>
  );
}
