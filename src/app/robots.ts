import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zenvoraa.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/account/",
        "/forgot-password/",
        "/checkout/",
        "/cart/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
