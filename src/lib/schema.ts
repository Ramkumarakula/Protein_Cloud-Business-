import { siteConfig } from "@/config/site";
import { plans } from "@/data/plans";
import { sandwiches } from "@/data/sandwiches";

/** schema.org FoodEstablishment with a menu built from the data files. */
export function buildJsonLd() {
  // No offers until prices are public (siteConfig.showPrices).
  const offer = (price: number) =>
    siteConfig.showPrices
      ? { "@type": "Offer", price: String(price), priceCurrency: "INR" }
      : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phoneE164,
    email: siteConfig.contact.email,
    servesCuisine: ["Healthy", "Indian"],
    areaServed: siteConfig.deliveryAreas,
    address: {
      "@type": "PostalAddress",
      addressLocality: `${siteConfig.location.area}, ${siteConfig.location.city}`,
      addressRegion: siteConfig.location.state,
      addressCountry: "IN",
    },
    hasMenu: {
      "@type": "Menu",
      name: "Meal plans and sandwiches",
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Meal plans",
          hasMenuItem: plans.map((p) => ({
            "@type": "MenuItem",
            name: p.name,
            description: p.description,
            offers: offer(p.pricePerDay),
          })),
        },
        {
          "@type": "MenuSection",
          name: "Sandwiches",
          hasMenuItem: sandwiches.map((s) => ({
            "@type": "MenuItem",
            name: `${s.name} (${s.hero}) sandwich`,
            description: s.description,
            offers: offer(s.price),
          })),
        },
      ],
    },
  };
}

/** JSON for an inline ld+json script. "<" is escaped so the payload can never close the tag. */
export function jsonLdString(): string {
  return JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");
}
