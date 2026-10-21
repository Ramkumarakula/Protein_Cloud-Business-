"use client";

import { useRef, useState, type FormEvent } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactSchema, TIME_TRAP_MS, type ContactInput } from "@/lib/validation";
import { mailtoLink, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type Channel = "whatsapp" | "email";
type Errors = Partial<Record<keyof ContactInput, string>>;

const PLAN_OPTIONS: { value: ContactInput["plan"]; label: string }[] = [
  { value: "elite", label: "Elite" },
  { value: "protein", label: "Just Protein" },
  { value: "custom", label: "Customize" },
  { value: "sandwiches", label: "Sandwiches" },
  { value: "other", label: "Something else" },
];

const field =
  "mt-1.5 w-full rounded-2xl border border-ink/10 bg-wall/60 px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/40 focus:border-ink/40 focus:bg-white";

export function Contact() {
  const mountedAt = useRef<number>(0);
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");

  const onFocusForm = () => {
    if (!mountedAt.current) mountedAt.current = Date.now();
  };

  const submit = (channel: Channel) => (e?: FormEvent) => {
    e?.preventDefault();
    const form = document.getElementById("contact-form") as HTMLFormElement | null;
    if (!form) return;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        if (key !== "company") next[key] ??= issue.message;
      }
      setErrors(next);
      setNotice(
        parsed.error.issues.some((i) => i.path[0] === "company")
          ? "Something went wrong. Please message us on WhatsApp instead."
          : "Please check the highlighted fields.",
      );
      return;
    }
    // Time trap: bots submit instantly. Humans take longer than 3 seconds.
    if (!mountedAt.current || Date.now() - mountedAt.current < TIME_TRAP_MS) {
      setNotice("That was quick! Please take a moment to check your details and try again.");
      return;
    }

    setErrors({});
    const { name, phone, plan, message } = parsed.data;
    const planLabel = PLAN_OPTIONS.find((p) => p.value === plan)?.label ?? plan;
    const body = `Name: ${name}\nPhone: ${phone}\nInterested in: ${planLabel}\n\n${message}`;
    const url =
      channel === "whatsapp"
        ? whatsappLink(`Hi ${siteConfig.name}!\n\n${body}`)
        : mailtoLink(`Meal plan enquiry from ${name}`, body);
    setNotice(channel === "whatsapp" ? "Opening WhatsApp..." : "Opening your email app...");
    if (channel === "whatsapp") window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
  };

  const errorText = (key: keyof ContactInput) =>
    errors[key] ? (
      <span id={`${key}-error`} className="text-protein-ink mt-1 block text-xs font-medium">
        {errors[key]}
      </span>
    ) : null;

  const describedBy = (key: keyof ContactInput) => (errors[key] ? `${key}-error` : undefined);

  return (
    <section id="contact" aria-labelledby="contact-heading" className="px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.3fr]">
        <Reveal className="lg:col-span-2">
          <SectionHeading id="contact-heading" light="LOVED IT? DON'T WAIT" heavy="LET US KNOW" />
        </Reveal>
        <Reveal>
          <p className="text-muted max-w-sm text-[15px] leading-relaxed">
            We are launching soon around {siteConfig.location.area}, {siteConfig.location.city}.
            Leave your name and number to know when we go live. We will deliver across{" "}
            {siteConfig.deliveryAreas}.
          </p>
          <div className="mt-8 flex flex-col gap-2 text-sm font-medium">
            <a
              href={whatsappLink("Hi! I have a question about your meal plans.")}
              target="_blank"
              rel="noopener noreferrer"
              className="shadow-soft inline-flex w-fit items-center gap-3 rounded-full bg-white px-4 py-3"
            >
              <MessageCircle aria-hidden className="size-4" /> WhatsApp us
            </a>
            <a
              href={`tel:${siteConfig.contact.phoneE164}`}
              className="shadow-soft inline-flex w-fit items-center gap-3 rounded-full bg-white px-4 py-3"
            >
              <Phone aria-hidden className="size-4" /> Call {siteConfig.contact.phoneDisplay}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="shadow-soft inline-flex w-fit items-center gap-3 rounded-full bg-white px-4 py-3"
            >
              <Mail aria-hidden className="size-4" /> {siteConfig.contact.email}
            </a>
          </div>
        </Reveal>

        <Reveal>
          <form
            id="contact-form"
            noValidate
            onSubmit={submit("whatsapp")}
            onFocus={onFocusForm}
            className="bg-card shadow-card rounded-3xl p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={80}
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy("name")}
                  className={cn(field, errors.name && "border-protein-ink")}
                  placeholder="Yumm"
                />
                {errorText("name")}
              </label>
              <label className="block text-sm font-medium">
                Mobile number
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  maxLength={15}
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy("phone")}
                  className={cn(field, errors.phone && "border-protein-ink")}
                  placeholder={siteConfig.contact.phoneDisplay}
                />
                {errorText("phone")}
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium">
              Interested in
              <select name="plan" defaultValue="elite" className={field}>
                {PLAN_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium">
              Message
              <textarea
                name="message"
                rows={4}
                required
                maxLength={600}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy("message")}
                className={cn(field, "resize-none", errors.message && "border-protein-ink")}
                placeholder="Tell me when you go live. I would love lunch at SRM KTR."
              />
              {errorText("message")}
            </label>
            {/* Honeypot: hidden from people and screen readers. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="submit">
                <MessageCircle aria-hidden className="size-4" />
                Send on WhatsApp
              </Button>
              <Button type="button" variant="ghost" onClick={() => submit("email")()}>
                <Mail aria-hidden className="size-4" />
                Send by email
              </Button>
            </div>
            <p role="status" aria-live="polite" className="text-muted mt-4 min-h-5 text-sm">
              {notice}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
