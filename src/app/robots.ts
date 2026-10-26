import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "http://127.0.0.1:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/random"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
