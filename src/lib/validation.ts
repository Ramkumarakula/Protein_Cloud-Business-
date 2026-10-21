import { z } from "zod";
import { items } from "@/data/items";

const safeText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    // Strip control characters so nothing odd ends up in a wa.me or mailto URL.
    .transform((value) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ""));

export const contactSchema = z.object({
  name: safeText(80).pipe(z.string().min(2, "Please enter your name")),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{10,15}$/, "Please enter a valid 10 digit mobile number"),
  plan: z.enum(["elite", "protein", "custom", "sandwiches", "other"]),
  message: safeText(600).pipe(z.string().min(5, "Tell us a little about what you need")),
  // Honeypot: real people never see or fill this.
  company: z.string().max(0),
});

export type ContactInput = z.infer<typeof contactSchema>;

const itemIds = items.map((item) => item.id) as [string, ...string[]];

export const plateOrderSchema = z.object({
  itemIds: z.array(z.enum(itemIds)).min(1).max(6),
});

/** Minimum time a human needs to fill the form, in ms. */
export const TIME_TRAP_MS = 3000;
