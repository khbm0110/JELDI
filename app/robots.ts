import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /checkout: transactional, already set to noindex on the page
      // itself — disallowing here too keeps crawlers from even
      // fetching it. /api/: server routes, nothing for a crawler.
      disallow: ["/checkout", "/api/"]
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
