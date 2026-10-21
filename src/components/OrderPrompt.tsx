"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { scrollToId } from "@/components/layout/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ORDER_PROMPT_EVENT } from "@/lib/orderPrompt";

const VISIBLE_MS = 6000;

/**
 * Pre-launch: order buttons show this message and take the visitor to the contact form,
 * where they can leave their details to hear when ordering opens.
 */
export function OrderPrompt() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onOrder = () => {
      setOpen(true);
      scrollToId("contact");
      // Put the cursor in the form once the scroll has settled.
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('#contact-form input[name="name"]')?.focus({
          preventScroll: true,
        });
      }, 900);
      clearTimeout(timer);
      timer = setTimeout(() => setOpen(false), VISIBLE_MS);
    };
    window.addEventListener(ORDER_PROMPT_EVENT, onOrder);
    return () => {
      window.removeEventListener(ORDER_PROMPT_EVENT, onOrder);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 lg:justify-start lg:px-[max(4rem,calc((100vw-72rem)/2+2rem))]"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="prompt"
            role="status"
            data-testid="order-prompt"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="bg-ink shadow-card pointer-events-auto flex max-w-md items-start gap-3 rounded-3xl p-4 pr-3 text-white"
          >
            <span className="bg-custom/25 grid size-10 shrink-0 place-items-center rounded-full">
              <Heart aria-hidden className="text-custom size-5 fill-current" />
            </span>
            <div className="text-sm leading-snug">
              <p className="font-display text-base font-extrabold">Hope you liked it!</p>
              <p className="mt-0.5 text-white/80">
                {siteConfig.name} is launching soon. Subscribe below to know when we go live.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close message"
              onClick={() => setOpen(false)}
              className="grid size-8 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X aria-hidden className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
