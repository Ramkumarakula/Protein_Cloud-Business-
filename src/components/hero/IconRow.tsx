"use client";

import { LayoutGrid, MessageCircle } from "lucide-react";
import { scrollToId } from "@/components/layout/SmoothScroll";
import { whatsappLink } from "@/lib/whatsapp";

const glass =
  "glass grid size-12 place-items-center rounded-full text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-white/80";

/** Round glass buttons under the plan selector: jump to the sandwich menu, or chat on WhatsApp. */
export function IconRow() {
  return (
    <div className="flex items-center justify-center gap-3 lg:justify-start">
      <button
        type="button"
        aria-label="Menu: jump to sandwiches"
        className={glass}
        onClick={() => scrollToId("sandwiches")}
      >
        <LayoutGrid aria-hidden className="size-5" />
      </button>
      <a
        href={whatsappLink("Hi! I have a question about your meal plans.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className={glass}
      >
        <MessageCircle aria-hidden className="size-5" />
      </a>
    </div>
  );
}
