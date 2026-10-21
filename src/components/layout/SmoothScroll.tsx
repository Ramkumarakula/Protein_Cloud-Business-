"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling. Skipped entirely for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -16 }, lerp: 0.11 });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window.__lenis;
  if (!lenis) {
    el.scrollIntoView({ block: "start" });
    return;
  }
  // Native scrolls (keyboard, focus, scrollIntoView) can leave Lenis with a stale target and
  // momentum; resync to where the page really is, then glide to the section.
  lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  lenis.scrollTo(el, { offset: -16, force: true });
}

export function setScrollLocked(locked: boolean) {
  if (window.__lenis) {
    if (locked) window.__lenis.stop();
    else window.__lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
