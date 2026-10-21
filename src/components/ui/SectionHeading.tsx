import { cn } from "@/lib/cn";

/** The two-line light/heavy headline style shared with the hero. */
export function SectionHeading({
  light,
  heavy,
  eyebrow,
  id,
  className,
  align = "left",
  tone = "dark",
}: {
  light: string;
  heavy: string;
  eyebrow?: string;
  id?: string;
  className?: string;
  align?: "left" | "center";
  /** "light" for headings sitting on a dark photo or video. */
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        tone === "light" && "text-white",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-medium",
            tone === "light" ? "text-white/85" : "text-muted",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-display leading-[0.9] uppercase">
        <span className="block text-[clamp(1.5rem,3.4vw,2.75rem)] font-light tracking-[0.08em]">
          {light}
        </span>
        <span className="block text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold tracking-[-0.02em]">
          {heavy}
        </span>
      </h2>
    </div>
  );
}
