import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return [{ url: `${siteConfig.url}${base}/`, changeFrequency: "weekly", priority: 1 }];
}
