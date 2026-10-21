"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useAnimate } from "motion/react";
import { RotateCcw, ShoppingBag, Sparkles } from "lucide-react";
import { itemById, MAX_PLATE_ITEMS, type FoodItem } from "@/data/items";
import { planByKey } from "@/data/plans";
import { FoodImage } from "@/components/ui/FoodImage";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePlanSwitcher } from "@/hooks/usePlanSwitcher";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { plateOrderSchema } from "@/lib/validation";
import { requestOrder } from "@/lib/orderPrompt";
import { CROSSFADE } from "@/lib/motion";
import { ItemRing } from "./ItemRing";
import { PlateSlot } from "./PlateSlot";
import { SummaryChip, type PlateTotals } from "./SummaryChip";

const ITEM_SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.8 } as const;

export function PlateBuilder() {
  const { plan, goToKey } = usePlanSwitcher();
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [full, setFull] = useState(false);
  const [plateScope, animatePlate] = useAnimate();
  const transition = reduce ? { duration: 0 } : ITEM_SPRING;
  const isOpen = plan.key === "custom";

  const chosen = selected.map((id) => itemById[id]);
  const totals: PlateTotals = chosen.reduce(
    (acc, item) => ({
      count: acc.count + 1,
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein,
      price: acc.price + item.price,
    }),
    { count: 0, kcal: 0, protein: 0, price: 0 },
  );

  const remove = (item: FoodItem) => {
    setSelected((s) => s.filter((id) => id !== item.id));
    setFull(false);
    setStatus(`Removed ${item.name}. ${selected.length - 1} of ${MAX_PLATE_ITEMS} items.`);
  };

  const toggle = (item: FoodItem) => {
    if (selected.includes(item.id)) return remove(item);
    if (selected.length >= MAX_PLATE_ITEMS) {
      setFull(true);
      setStatus(`Your plate is full. Remove an item to add ${item.name}.`);
      if (!reduce && plateScope.current) {
        animatePlate(plateScope.current, { x: [0, -10, 10, -7, 7, -3, 0] }, { duration: 0.45 });
      }
      return;
    }
    setSelected((s) => [...s, item.id]);
    setStatus(`Added ${item.name}. ${selected.length + 1} of ${MAX_PLATE_ITEMS} items.`);
  };

  const canOrder = plateOrderSchema.safeParse({ itemIds: selected }).success;
  const emptyPlate = planByKey.custom.plate;

  return (
    <section
      id="build"
      aria-labelledby="build-heading"
      className="scroll-mt-4 px-4 py-16 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <AnimatePresence mode="wait" initial={false}>
          {!isOpen ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={CROSSFADE}
              className="glass shadow-soft flex flex-col items-center justify-between gap-3 rounded-full px-6 py-4 text-center sm:flex-row sm:text-left"
            >
              <h2 id="build-heading" className="text-ink text-sm font-medium">
                Want to build your own? Pick Customize above.
              </h2>
              <Button
                variant="light"
                onClick={() => goToKey("custom")}
                data-testid="open-builder"
                className="py-2"
              >
                <Sparkles aria-hidden className="size-4" />
                Open the plate builder
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              data-testid="plate-builder"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <SectionHeading
                  id="build-heading"
                  light="BUILD"
                  heavy="YOUR PLATE"
                  eyebrow={`Tap up to ${MAX_PLATE_ITEMS} items. Tap them on the plate to send them back.`}
                  align="center"
                />
              </div>

              <LayoutGroup id="builder">
                {/* Stage: square on md+ so the items sit on a true circle. */}
                <div className="@container relative mx-auto mt-6 w-full max-w-[720px] md:mt-10 md:aspect-square">
                  <div
                    ref={plateScope}
                    role="region"
                    aria-label="Your plate"
                    className="relative mx-auto aspect-square w-[82vw] max-w-[360px] md:absolute md:top-1/2 md:left-1/2 md:w-[54%] md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2"
                    data-testid="builder-plate"
                  >
                    <div aria-hidden className="shadow-plate absolute inset-[5%] rounded-full" />
                    <FoodImage
                      src={emptyPlate}
                      alt="Empty plate"
                      label="Your plate"
                      accent={planByKey.custom.accent}
                      sizes="(min-width: 768px) 400px, 82vw"
                      className="relative"
                    />
                    {chosen.map((item, i) => (
                      <PlateSlot
                        key={item.id}
                        item={item}
                        slot={i}
                        onRemove={remove}
                        transition={transition}
                      />
                    ))}
                    {chosen.length === 0 && (
                      <p className="text-ink/50 pointer-events-none absolute inset-0 grid place-items-center px-10 text-center text-sm font-medium">
                        Tap an item to add it
                      </p>
                    )}
                    <p aria-live="polite" className="sr-only" data-testid="builder-status">
                      {status}
                    </p>
                  </div>
                  <ItemRing selected={selected} onToggle={toggle} transition={transition} />
                </div>
              </LayoutGroup>

              <div className="mt-6 flex flex-col items-center gap-4 md:mt-4">
                <SummaryChip totals={totals} />
                <AnimatePresence>
                  {full && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-protein-ink text-sm font-medium"
                      data-testid="builder-full"
                    >
                      Your plate holds {MAX_PLATE_ITEMS} items. Tap one on the plate to swap it out.
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button disabled={!canOrder} onClick={requestOrder} data-testid="order-plate">
                    <ShoppingBag aria-hidden className="size-4" />
                    Order this plate
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelected([]);
                      setFull(false);
                      setStatus("Plate cleared.");
                    }}
                    disabled={selected.length === 0}
                  >
                    <RotateCcw aria-hidden className="size-4" />
                    Clear plate
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
