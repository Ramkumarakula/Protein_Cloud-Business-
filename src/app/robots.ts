import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}${base}/sitemap.xml`,
  };
}
