import { siteConfig } from "@/config/site";

/** wa.me needs the full international number with digits only. */
export function whatsappNumber(raw: string = siteConfig.contact.whatsapp): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

/** Build a wa.me link. The message is always passed through encodeURIComponent. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
