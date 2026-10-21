"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ReactNode } from "react";

/** Fades content in and lifts it 24px the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.2 : 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
