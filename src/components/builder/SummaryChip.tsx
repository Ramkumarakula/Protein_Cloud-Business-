"use client";

import { AnimatePresence, motion } from "motion/react";
import { formatPrice } from "@/lib/format";

export type PlateTotals = { count: number; kcal: number; protein: number; price: number };

function Ticker({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <span className="relative inline-flex overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="whitespace-pre">{suffix}</span>
    </span>
  );
}

/** Floating live summary under the plate: N items · X kcal · Y g protein · ₹Z/day */
export function SummaryChip({ totals }: { totals: PlateTotals }) {
  const { count, kcal, protein, price } = totals;
  return (
    <p
      data-testid="summary-chip"
      className="glass text-ink shadow-soft inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full px-5 py-2.5 text-sm font-medium"
    >
      <Ticker value={String(count)} suffix={count === 1 ? " item" : " items"} />
      <span aria-hidden className="text-ink/30">
        ·
      </span>
      <Ticker value={String(kcal)} suffix=" kcal" />
      <span aria-hidden className="text-ink/30">
        ·
      </span>
      <Ticker value={String(protein)} suffix=" g protein" />
      <span aria-hidden className="text-ink/30">
        ·
      </span>
      <span className="font-semibold">
        <Ticker value={formatPrice(price)} suffix="/day" />
      </span>
    </p>
  );
}
