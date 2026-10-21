// OWNER: edit the text, prices and items here
export type PlanKey = "elite" | "protein" | "custom";

export type Plan = {
  key: PlanKey;
  name: string; // display name used in cards, the selector and announcements
  eyebrow: string;
  titleLight: string;
  titleHeavy: string;
  subtitle: string;
  description: string;
  includes: string[];
  ingredients: string[];
  rating: string;
  pricePerDay: number; // INR
  pricePerWeek: number; // INR
  priceNote?: string; // e.g. "from"
  accent: string;
  plate: string;
  thumb?: string; // optional, falls back to plate
  ctaLabel: string;
};

export const plans: Plan[] = [
  {
    key: "elite",
    name: "Elite",
    eyebrow: "#1 Most loved plan",
    titleLight: "THE",
    titleHeavy: "ELITE",
    subtitle: "Everything your body needs, every day",
    description:
      "Grilled chicken, tri-colour quinoa, roasted sweet potato, broccoli, spinach, avocado and fresh berries. A complete plate balanced for vitamins, protein and fibre, cooked fresh every morning near SRM KTR.",
    includes: ["Vitamins", "Protein", "Fibre", "Fruits"],
    ingredients: [
      "Herb grilled chicken breast",
      "Tri-colour quinoa with pumpkin seeds",
      "Roasted sweet potato",
      "Steamed broccoli",
      "Baby spinach and cherry tomatoes",
      "Avocado, orange and mixed berries",
    ],
    rating: "4.9",
    pricePerDay: 449,
    pricePerWeek: 2999,
    accent: "#F2994A",
    plate: "/food/plate-elite.png",
    ctaLabel: "Order Elite",
  },
  {
    key: "protein",
    name: "Just Protein",
    eyebrow: "Built for training days",
    titleLight: "JUST",
    titleHeavy: "PROTEIN",
    subtitle: "High protein, high fibre, low fuss",
    description:
      "Tandoori chicken breast, boiled eggs, grilled paneer, masoor lentils, chickpeas, green beans and broccoli. Around 62 g of protein a plate for people training, cutting or recovering.",
    includes: ["62 g protein", "Fibre", "Low carb", "Iron"],
    ingredients: [
      "Tandoori chicken breast",
      "Two boiled eggs",
      "Grilled malai paneer",
      "Masoor dal salad",
      "Spiced chickpeas",
      "Green beans and broccoli",
    ],
    rating: "4.8",
    pricePerDay: 399,
    pricePerWeek: 2649,
    accent: "#E05A5A",
    plate: "/food/plate-protein.png",
    ctaLabel: "Order Just Protein",
  },
  {
    key: "custom",
    name: "Customize",
    eyebrow: "Your plate, your rules",
    titleLight: "MAKE IT",
    titleHeavy: "YOURS",
    subtitle: "Pick up to six items, we cook the rest",
    description:
      "Start with an empty plate and choose from our kitchen: proteins, grains, greens and fruit. We weigh, cook and pack it fresh. Change your plate any day before 8 pm.",
    includes: ["Pick 6", "Your macros", "Change daily"],
    ingredients: [
      "Proteins: chicken, paneer, eggs",
      "Grains: brown rice, quinoa, sweet potato",
      "Greens: broccoli, spinach, bell peppers",
      "Fruit: apple, papaya, berries",
    ],
    rating: "4.8",
    pricePerDay: 299,
    pricePerWeek: 1999,
    priceNote: "from",
    accent: "#4CAF7A",
    plate: "/food/plate-custom.png",
    ctaLabel: "Build my plate",
  },
];

export const planByKey = Object.fromEntries(plans.map((p) => [p.key, p])) as Record<PlanKey, Plan>;
