"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { withBasePath } from "@/lib/paths";
import { whatsappLink } from "@/lib/whatsapp";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scrollToId, setScrollLocked } from "./SmoothScroll";

const iconButton =
  "grid size-11 place-items-center rounded-full text-ink transition hover:bg-white/70";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const trigger = triggerRef.current;
    return () => {
      setScrollLocked(false);
      trigger?.focus();
    };
  }, [open]);

  // Keep Tab inside the drawer and close on Escape.
  const onPanelKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12"
      >
        <a href="#plans" className="flex items-center gap-2.5 rounded-full">
          <img src={withBasePath("/logo.svg")} alt="" width={36} height={36} className="size-9" />
          <span className="font-display text-lg font-extrabold tracking-tight whitespace-nowrap">
            {siteConfig.name}
          </span>
        </a>

        <ul className="glass shadow-soft hidden items-center gap-1 rounded-full px-2 py-1.5 lg:flex">
          {siteConfig.nav.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-ink/80 hover:text-ink rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition hover:bg-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            ref={triggerRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen(true)}
            className={iconButton}
            data-testid="menu-button"
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="bg-ink/30 absolute inset-0 backdrop-blur-sm"
            />
            <motion.div
              id="mobile-drawer"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              onKeyDown={onPanelKeyDown}
              className="bg-wall shadow-card absolute top-0 right-0 flex h-full w-[min(88vw,380px)] flex-col p-6"
              initial={{ x: reduce ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduce ? 0 : "100%" }}
              transition={
                reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32 }
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-extrabold">{siteConfig.name}</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className={iconButton}
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>
              <ul className="mt-8 flex flex-col gap-1">
                {[...siteConfig.nav, { label: "Build your plate", href: "#build" }].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        // Scrolling is locked while the drawer is open: close first, then scroll.
                        e.preventDefault();
                        setOpen(false);
                        setTimeout(() => scrollToId(link.href.slice(1)), 60);
                      }}
                      className="font-display block rounded-2xl px-4 py-3 text-2xl font-extrabold tracking-tight uppercase transition hover:bg-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto space-y-2 text-sm">
                <a
                  href={whatsappLink("Hi! I have a question about your meal plans.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-medium"
                >
                  <MessageCircle aria-hidden className="size-4" /> WhatsApp us
                </a>
                <a
                  href={`tel:${siteConfig.contact.phoneE164}`}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-medium"
                >
                  <Phone aria-hidden className="size-4" /> {siteConfig.contact.phoneDisplay}
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-medium"
                >
                  <Mail aria-hidden className="size-4" /> {siteConfig.contact.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
