// OWNER: edit your business details here. Nothing else in the code should hardcode these.
export const siteConfig = {
  name: "RK Protein Cloud", // OWNER: replace
  tagline: "Real food. Planned for you.",
  description:
    "Fresh, balanced meal plans delivered daily around SRM KTR, Chennai. Choose Elite, Just Protein, or build your own plate.",
  location: { city: "Chennai", area: "SRM KTR", state: "Tamil Nadu", country: "India" }, // OWNER: confirm
  contact: {
    phoneDisplay: "+91 90592 57599",
    phoneE164: "+919059257599",
    whatsapp: "9059257599", // 10 digit Indian numbers get +91 added automatically
    email: "ramkumarafw@gmail.com", // OWNER: replace
  },
  social: { instagram: "", facebook: "", youtube: "" },
  nav: [
    { label: "Plans", href: "#plans" },
    { label: "Sandwiches", href: "#sandwiches" },
    { label: "How it works", href: "#how" },
    { label: "Contact", href: "#contact" },
  ],
  sandwichesFootnote: "More fillings coming soon",
  deliveryAreas: "SRM KTR campus, Potheri, Kattankulathur, Guduvanchery and Maraimalai Nagar",
  // Pre-launch: prices show as "₹ ?". OWNER: set to true to show the prices in src/data/.
  showPrices: false,
  url: "https://example.com", // OWNER: update when domain is final
} as const;
