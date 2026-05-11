import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/settings", "/dashboard", "/history"],
    },
    sitemap: "https://prompts.uyonoh.com/sitemap.xml",
  };
}
