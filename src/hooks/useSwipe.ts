"use client";

import { useRef, type PointerEvent } from "react";

/** Horizontal swipe detection with pointer events. Vertical scrolling is left alone. */
export function useSwipe({
  onLeft,
  onRight,
  threshold = 48,
}: {
  onLeft: () => void;
  onRight: () => void;
  threshold?: number;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: PointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      if (dx < 0) onLeft();
      else onRight();
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
