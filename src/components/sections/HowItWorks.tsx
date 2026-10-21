import { ChefHat, ClipboardList, SlidersHorizontal, Truck, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Choose plan",
    body: "Pick Elite, Just Protein or build your own plate. Weekly or daily.",
    icon: ClipboardList,
  },
  {
    title: "We cook fresh",
    body: "Every plate is cooked the same morning in our kitchen near SRM KTR.",
    icon: ChefHat,
  },
  {
    title: "Delivered daily",
    body: "Packed warm and delivered between 12 and 1:30 pm, or 7 and 8:30 pm.",
    icon: Truck,
  },
  {
    title: "Track and tweak",
    body: "Swap items, pause a day or change plans on WhatsApp by 8 pm.",
    icon: SlidersHorizontal,
  },
];

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-heading" className="px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading id="how-heading" light="HOW IT" heavy="WORKS" />
        </Reveal>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <span
            aria-hidden
            className="border-ink/15 absolute top-7 right-[12%] left-[12%] hidden border-t-2 border-dashed md:block"
          />
          {steps.map((step, i) => (
            <li key={step.title}>
              <Reveal
                delay={i * 0.08}
                className="relative flex gap-4 md:flex-col md:items-center md:text-center"
              >
                <span className="shadow-soft relative grid size-14 shrink-0 place-items-center rounded-full bg-white">
                  <step.icon aria-hidden className="size-6" />
                  <span className="bg-ink absolute -top-1 -right-1 grid size-6 place-items-center rounded-full text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold">{step.title}</h3>
                  <p className="text-muted mt-1 text-sm leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
