import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Chip({
  children,
  accent,
  className,
}: {
  children: ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-ink inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        className,
      )}
      style={{ background: accent ? `${accent}2E` : "rgb(30 30 30 / 0.06)" }}
    >
      {children}
    </span>
  );
}
