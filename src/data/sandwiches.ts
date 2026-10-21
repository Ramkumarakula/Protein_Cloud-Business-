// OWNER: edit the text, prices and items here
// To add a 4th sandwich, add an entry below and an image in public/food/.
export type Sandwich = {
  key: "veg" | "nonveg" | "egg";
  name: string;
  hero: string;
  description: string;
  image: string;
  accent: string;
  price: number; // INR
  tags: string[];
};

export const sandwiches: Sandwich[] = [
  {
    key: "veg",
    name: "Veg",
    hero: "Paneer",
    description:
      "Pepper grilled paneer, mint chutney, crunchy lettuce, tomato, cucumber and red onion on toasted multigrain.",
    image: "/food/sandwich-paneer.png",
    accent: "#F5B544",
    price: 149,
    tags: ["21 g protein", "Grilled", "No mayo"],
  },
  {
    key: "nonveg",
    name: "Non-Veg",
    hero: "Chicken",
    description:
      "Shredded tandoori chicken, hung curd dressing, lettuce, tomato and onion on toasted multigrain.",
    image: "/food/sandwich-chicken.png",
    accent: "#D9663C",
    price: 179,
    tags: ["32 g protein", "Grilled", "Hung curd"],
  },
  {
    key: "egg",
    name: "Egg",
    hero: "Egg",
    description:
      "Sliced boiled eggs and a light egg bhurji with green chutney, lettuce and tomato on seeded bread.",
    image: "/food/sandwich-egg.png",
    accent: "#F2C94C",
    price: 139,
    tags: ["24 g protein", "Seeded bread", "No mayo"],
  },
];
