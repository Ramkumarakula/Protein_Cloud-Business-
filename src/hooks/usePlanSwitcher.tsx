"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { plans, type Plan, type PlanKey } from "@/data/plans";

type Direction = 1 | -1;

type PlanSwitcherState = {
  plan: Plan;
  index: number;
  direction: Direction;
  /** The plan that was active before the current one, used to sequence exits. */
  previousKey: PlanKey | null;
  goTo: (index: number) => void;
  goToKey: (key: PlanKey) => void;
  next: () => void;
  prev: () => void;
};

const PlanSwitcherContext = createContext<PlanSwitcherState | null>(null);

export function PlanSwitcherProvider({ children }: { children: ReactNode }) {
  const [{ index, direction, previousKey }, setState] = useState<{
    index: number;
    direction: Direction;
    previousKey: PlanKey | null;
  }>({ index: 0, direction: 1, previousKey: null });

  const goTo = useCallback((target: number) => {
    setState((current) => {
      const nextIndex = (target + plans.length) % plans.length;
      if (nextIndex === current.index) return current;
      return {
        index: nextIndex,
        direction: target > current.index ? 1 : -1,
        previousKey: plans[current.index].key,
      };
    });
  }, []);

  const value = useMemo<PlanSwitcherState>(
    () => ({
      plan: plans[index],
      index,
      direction,
      previousKey,
      goTo,
      goToKey: (key) => goTo(plans.findIndex((p) => p.key === key)),
      next: () => goTo(index + 1),
      prev: () => goTo(index - 1),
    }),
    [index, direction, previousKey, goTo],
  );

  return <PlanSwitcherContext.Provider value={value}>{children}</PlanSwitcherContext.Provider>;
}

export function usePlanSwitcher(): PlanSwitcherState {
  const ctx = useContext(PlanSwitcherContext);
  if (!ctx) throw new Error("usePlanSwitcher must be used inside PlanSwitcherProvider");
  return ctx;
}
