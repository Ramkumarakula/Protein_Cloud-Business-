"use client";

import { motion } from "motion/react";
import { hexToRgba } from "@/lib/motion";

/** Large blurred accent arc behind the plate; its colour tweens with the active plan. */
export function BackdropArc({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]"
    >
      <motion.div
        className="absolute top-[4%] left-1/2 aspect-square w-[130vw] -translate-x-1/2 rounded-full blur-3xl md:w-[90vw] lg:top-[-10%] lg:left-[-12%] lg:w-[62vw] lg:translate-x-0"
        initial={false}
        animate={{ backgroundColor: hexToRgba(accent, 0.18) }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] bottom-[-20%] hidden aspect-square w-[40vw] rounded-full blur-3xl lg:block"
        initial={false}
        animate={{ backgroundColor: hexToRgba(accent, 0.08) }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}
