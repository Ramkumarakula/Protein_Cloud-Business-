"use client";

import { Check, Crown, Medal, ShoppingBag, Sparkles, type LucideIcon } from "lucide-react";
import { plans, type PlanKey } from "@/data/plans";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/lib/format";
import { requestOrder } from "@/lib/orderPrompt";
import { cn } from "@/lib/cn";

type Tier = {
  name: string;
  icon: LucideIcon;
  /** Outer frame: a 1.5px gradient border painted as the wrapper background. */
  frame: string;
  card: string;
  title: string;
  muted: string;
  badge: string;
  check: string;
  button: string;
  glow?: string;
};

/** Each plan's card is styled by its level: Elite gold, Just Protein silver, Customize bronze. */
const TIERS: Record<PlanKey, Tier> = {
  elite: {
    name: "Gold",
    icon: Crown,
    frame: "bg-[linear-gradient(140deg,#f7e3a1,#b8862f_35%,#fff1c1_55%,#9a6b1f_80%,#e9c870)]",
    card: "bg-[radial-gradient(120%_80%_at_80%_0%,#3a2a12_0%,#1b140b_45%,#0f0c08_100%)] text-[#f6ead0]",
    title:
      "bg-[linear-gradient(100deg,#f9e7ad,#d7a94b_40%,#fff4cf_55%,#c8963b_80%)] bg-clip-text text-transparent",
    muted: "text-[#e9d9b4]/80",
    badge: "bg-[#d7a94b]/15 text-[#f3d98f] ring-1 ring-[#d7a94b]/40",
    check: "text-[#e2b85c]",
    button:
      "bg-[linear-gradient(100deg,#f3d98f,#d2a245_45%,#f7e3a1)] text-[#1b140b] shadow-[0_10px_30px_-10px_rgba(215,169,75,0.7)] hover:brightness-105",
    glow: "shadow-[0_30px_80px_-30px_rgba(215,169,75,0.55)]",
  },
  protein: {
    name: "Silver",
    icon: Medal,
    frame: "bg-[linear-gradient(140deg,#ffffff,#b9c0c9_40%,#f4f6f8_60%,#9aa3ae)]",
    card: "bg-[linear-gradient(160deg,#fbfcfd,#eef1f4_55%,#e2e6eb)] text-ink",
    title: "text-[#2b323b]",
    muted: "text-[#4f5864]",
    badge: "bg-[#8d97a3]/15 text-[#3e4650] ring-1 ring-[#8d97a3]/40",
    check: "text-[#6c7682]",
    button: "bg-[#2b323b] text-white hover:bg-[#1f252c]",
  },
  custom: {
    name: "Bronze",
    icon: Sparkles,
    frame: "bg-[linear-gradient(140deg,#f1d3b3,#a8693a_40%,#f6e1c9_60%,#8a5228)]",
    card: "bg-[linear-gradient(160deg,#fdf8f3,#f5e9dd_55%,#ecdac7)] text-ink",
    title: "text-[#5a3418]",
    muted: "text-[#6e4a2f]",
    badge: "bg-[#a8693a]/15 text-[#6e3f1c] ring-1 ring-[#a8693a]/40",
    check: "text-[#a8693a]",
    button: "bg-[#5a3418] text-white hover:bg-[#482914]",
  },
};

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading id="pricing-heading" light="SIMPLE" heavy="PRICING" />
        </Reveal>
        <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
          {plans.map((plan, i) => {
            const tier = TIERS[plan.key];
            const Icon = tier.icon;
            const gold = plan.key === "elite";
            return (
              <Reveal key={plan.key} delay={i * 0.08} className="h-full">
                <div
                  data-testid={`pricing-card-${plan.key}`}
                  data-tier={tier.name.toLowerCase()}
                  className={cn(
                    "h-full rounded-[1.6rem] p-[1.5px]",
                    tier.frame,
                    tier.glow ?? "shadow-card",
                  )}
                >
                  <div
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden rounded-[calc(1.6rem-1.5px)] p-6",
                      tier.card,
                    )}
                  >
                    {gold && (
                      <>
                        {/* Warm light from the top corner and a slow diagonal sheen. */}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-[#d7a94b]/25 blur-3xl"
                        />
                        <span
                          aria-hidden
                          className="gold-sheen pointer-events-none absolute inset-0"
                        />
                      </>
                    )}
                    <div className="relative flex items-center justify-between gap-3">
                      <p className={cn("text-xs font-medium", tier.muted)}>{plan.eyebrow}</p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
                          tier.badge,
                        )}
                      >
                        <Icon aria-hidden className="size-3.5" />
                        {tier.name}
                      </span>
                    </div>
                    <h3
                      className={cn(
                        "font-display relative mt-3 text-3xl font-extrabold tracking-tight uppercase",
                        tier.title,
                      )}
                    >
                      {plan.name}
                    </h3>
                    <p className="font-display relative mt-4 text-4xl font-extrabold">
                      {plan.priceNote && (
                        <span className={cn("mr-1 text-base font-medium", tier.muted)}>
                          {plan.priceNote}
                        </span>
                      )}
                      {formatPrice(plan.pricePerDay)}
                      <span className={cn("text-base font-medium", tier.muted)}>/day</span>
                    </p>
                    <p className={cn("relative mt-1 text-sm", tier.muted)}>
                      {formatPrice(plan.pricePerWeek)} for a 7 day week
                    </p>
                    <ul className="relative mt-6 mb-8 space-y-2 text-sm">
                      {plan.includes.map((inc) => (
                        <li key={inc} className="flex items-center gap-2">
                          <Check aria-hidden className={cn("size-4 shrink-0", tier.check)} />
                          {inc}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={requestOrder}
                      className={cn(
                        "relative mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-[transform,filter,background-color] duration-200 active:scale-[0.97]",
                        tier.button,
                      )}
                      aria-label={`Order ${plan.name}`}
                      data-testid={`pricing-order-${plan.key}`}
                    >
                      <ShoppingBag aria-hidden className="size-4" />
                      Order now
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
