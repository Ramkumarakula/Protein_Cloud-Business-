import { siteConfig } from "@/config/site";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(value: number): string {
  return `₹${inr.format(value)}`;
}

/** Price as shown to visitors. Shows "₹ ?" until siteConfig.showPrices is turned on. */
export function formatPrice(value: number): string {
  return siteConfig.showPrices ? formatINR(value) : "₹ ?";
}
