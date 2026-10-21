import type { Transition } from "motion/react";

/** Section 4.4: springs for anything that moves position. */
export const SPRING: Transition = { type: "spring", stiffness: 120, damping: 18, mass: 0.9 };
/** Softer vertical spring so plates arc instead of travelling in a straight line. */
export const SPRING_Y: Transition = { type: "spring", stiffness: 90, damping: 18, mass: 0.9 };
/** Snappier spring for small UI pieces (builder items, pills). */
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 380, damping: 30, mass: 0.8 };

export const CROSSFADE: Transition = { duration: 0.2, ease: "easeOut" };

export function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
