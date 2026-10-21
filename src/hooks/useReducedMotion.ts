"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * True when the visitor asked the OS for reduced motion. Uses useSyncExternalStore so the
 * component re-renders after hydration (the static HTML always assumes full motion).
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
