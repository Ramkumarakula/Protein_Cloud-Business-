// OWNER: edit the text, prices and items here
// Images: each item points at /food/items/<id>.svg. To use a real photo instead, drop a
// transparent cutout named <id>.png into public/food/items/ and the site picks it up.
export type FoodItem = {
  id: string;
  name: string;
  group: "protein" | "carb" | "veg" | "fruit" | "extra";
  image: string;
  kcal: number;
  protein: number; // grams
  price: number; // INR add-on
};

export const MAX_PLATE_ITEMS = 6;

export const items: FoodItem[] = [
  {
    id: "grilled-chicken",
    name: "Grilled chicken",
    group: "protein",
    image: "/food/items/grilled-chicken.svg",
    kcal: 198,
    protein: 37,
    price: 120,
  },
  {
    id: "paneer",
    name: "Paneer cubes",
    group: "protein",
    image: "/food/items/paneer.svg",
    kcal: 265,
    protein: 18,
    price: 95,
  },
  {
    id: "boiled-eggs",
    name: "Boiled eggs",
    group: "protein",
    image: "/food/items/boiled-eggs.svg",
    kcal: 155,
    protein: 13,
    price: 40,
  },
  {
    id: "brown-rice",
    name: "Brown rice",
    group: "carb",
    image: "/food/items/brown-rice.svg",
    kcal: 216,
    protein: 5,
    price: 45,
  },
  {
    id: "quinoa",
    name: "Quinoa",
    group: "carb",
    image: "/food/items/quinoa.svg",
    kcal: 222,
    protein: 8,
    price: 70,
  },
  {
    id: "sweet-potato",
    name: "Sweet potato",
    group: "carb",
    image: "/food/items/sweet-potato.svg",
    kcal: 112,
    protein: 2,
    price: 40,
  },
  {
    id: "broccoli",
    name: "Broccoli",
    group: "veg",
    image: "/food/items/broccoli.svg",
    kcal: 55,
    protein: 4,
    price: 45,
  },
  {
    id: "spinach",
    name: "Spinach",
    group: "veg",
    image: "/food/items/spinach.svg",
    kcal: 23,
    protein: 3,
    price: 30,
  },
  {
    id: "bell-peppers",
    name: "Bell peppers",
    group: "veg",
    image: "/food/items/bell-peppers.svg",
    kcal: 31,
    protein: 1,
    price: 40,
  },
  {
    id: "apple",
    name: "Apple slices",
    group: "fruit",
    image: "/food/items/apple.svg",
    kcal: 95,
    protein: 0,
    price: 35,
  },
  {
    id: "papaya",
    name: "Papaya",
    group: "fruit",
    image: "/food/items/papaya.svg",
    kcal: 62,
    protein: 1,
    price: 35,
  },
  {
    id: "berries",
    name: "Berries",
    group: "fruit",
    image: "/food/items/berries.svg",
    kcal: 85,
    protein: 1,
    price: 90,
  },
];

export const itemById: Record<string, FoodItem> = Object.fromEntries(
  items.map((item) => [item.id, item]),
);
