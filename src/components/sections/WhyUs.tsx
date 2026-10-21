import { Leaf, RefreshCw, Scale, ShieldCheck, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons: { title: string; body: string; icon: LucideIcon; tint: string }[] = [
  {
    title: "Fresh daily",
    body: "Nothing frozen, nothing reheated. Vegetables are bought fresh every morning.",
    icon: Leaf,
    tint: "#4CAF7A",
  },
  {
    title: "Macro-balanced",
    body: "Every plate is weighed so the calories and protein you see are what you eat.",
    icon: Scale,
    tint: "#F2994A",
  },
  {
    title: "No preservatives",
    body: "Cold pressed oils, no added colour, no MSG and no packaged sauces.",
    icon: ShieldCheck,
    tint: "#E05A5A",
  },
  {
    title: "Change anytime",
    body: "Switch plans, swap items or pause a day. Just message us by 8 pm.",
    icon: RefreshCw,
    tint: "#F2C94C",
  },
];

export function WhyUs() {
  return (
    <section aria-labelledby="why-heading" className="px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading id="why-heading" light="WHY" heavy="EAT WITH US" />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06} className="h-full">
              <div className="bg-card shadow-card h-full rounded-3xl p-6">
                <span
                  className="grid size-12 place-items-center rounded-2xl"
                  style={{ background: `${r.tint}33` }}
                >
                  <r.icon aria-hidden className="size-5" />
                </span>
                <h3 className="font-display mt-5 text-xl font-extrabold">{r.title}</h3>
                <p className="text-muted mt-1.5 text-sm leading-relaxed">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
