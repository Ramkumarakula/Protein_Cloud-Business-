"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Plan } from "@/data/plans";
import { Chip } from "@/components/ui/Chip";
import { Button, LinkButton } from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatPrice } from "@/lib/format";
import { requestOrder } from "@/lib/orderPrompt";
import { cn } from "@/lib/cn";

const TABS = ["Overview", "Ingredients"] as const;
type Tab = (typeof TABS)[number];

/** The card stays put; only its contents crossfade (150ms out, 250ms in after 100ms). */
export function InfoCard({ plan, tabId }: { plan: Plan; tabId: string }) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("Overview");
  const uid = useId();
  const fadeIn = { opacity: 1, transition: { duration: 0.25, delay: reduce ? 0 : 0.1 } };
  const fadeOut = { opacity: 0, transition: { duration: 0.15 } };

  const onTabKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    // Keep these arrows from switching plans.
    e.stopPropagation();
    e.preventDefault();
    const next = TABS[(TABS.indexOf(tab) + 1) % TABS.length];
    setTab(next);
    document.getElementById(`${uid}-${next}`)?.focus();
  };

  const isCustom = plan.key === "custom";

  return (
    <div
      id="plan-panel"
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      data-testid="info-card"
      className="bg-card shadow-card relative rounded-t-[2rem] p-5 sm:rounded-3xl sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          role="tablist"
          aria-label="Plan details"
          className="bg-wall flex gap-1 rounded-full p-1"
        >
          {TABS.map((t) => (
            <button
              key={t}
              id={`${uid}-${t}`}
              role="tab"
              type="button"
              aria-selected={tab === t}
              aria-controls={`${uid}-panel`}
              tabIndex={tab === t ? 0 : -1}
              onClick={() => setTab(t)}
              onKeyDown={onTabKey}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                tab === t ? "text-ink bg-white shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <motion.div
          className="grid size-16 shrink-0 place-items-center rounded-2xl"
          initial={false}
          animate={{ backgroundColor: plan.accent }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={plan.rating + plan.key}
              className="font-display text-ink text-2xl font-extrabold"
              initial={{ opacity: 0 }}
              animate={fadeIn}
              exit={fadeOut}
              aria-label={`Rated ${plan.rating} out of 5`}
            >
              {plan.rating}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={plan.key + tab}
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-${tab}`}
          initial={{ opacity: 0 }}
          animate={fadeIn}
          exit={fadeOut}
          className="mt-4"
        >
          <h2 className="font-display text-2xl font-extrabold">{plan.name}</h2>
          <p className="text-ink/80 mt-0.5 text-sm font-medium">{plan.subtitle}</p>

          {tab === "Overview" ? (
            <>
              <p className="text-muted mt-3 text-sm leading-relaxed">{plan.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {plan.includes.map((inc) => (
                  <Chip key={inc} accent={plan.accent}>
                    {inc}
                  </Chip>
                ))}
              </div>
            </>
          ) : (
            <ul className="text-ink/85 mt-3 space-y-1.5 text-sm">
              {plan.ingredients.map((ing) => (
                <li key={ing} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full"
                    style={{ background: plan.accent }}
                  />
                  {ing}
                </li>
              ))}
            </ul>
          )}

          <div className="border-ink/5 mt-4 border-t pt-4">
            <p className="text-muted text-xs">{plan.priceNote ? "Starting" : "Per day"}</p>
            <p className="font-display text-2xl font-extrabold">
              {plan.priceNote && (
                <span className="text-muted mr-1 text-sm font-medium">{plan.priceNote}</span>
              )}
              {formatPrice(plan.pricePerDay)}
              <span className="text-muted text-sm font-medium">/day</span>
            </p>
            <p className="text-muted text-xs">{formatPrice(plan.pricePerWeek)} for 7 days</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {isCustom ? (
        <LinkButton href="#build" className="mt-4 w-full" data-testid="info-card-cta">
          {plan.ctaLabel}
        </LinkButton>
      ) : (
        <Button onClick={requestOrder} className="mt-4 w-full" data-testid="info-card-cta">
          {plan.ctaLabel}
        </Button>
      )}
    </div>
  );
}
