import { cn } from "@/lib/cn";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "solid" | "ghost" | "light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-[transform,background-color,box-shadow,opacity] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-white shadow-soft hover:bg-black",
  ghost: "bg-ink/5 text-ink hover:bg-ink/10",
  light: "bg-white text-ink shadow-soft hover:bg-white/80",
};

export function Button({
  variant = "solid",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

/** External links always open in a new tab with noopener noreferrer. */
export function LinkButton({
  variant = "solid",
  className,
  external = false,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; external?: boolean }) {
  return (
    <a
      className={cn(base, variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
