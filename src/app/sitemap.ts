import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zenvoraa.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.zenvora.com/api/v1";

  // 1. Static Pages
  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/shop`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    { url: `${siteUrl}/blog`, lastModified: new Date() },
  ];

  // 2. Dynamic Products
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/products?limit=100`, {
      next: { revalidate: 3600 }, // Cache on server for 1 hour
    });
    const result = await res.json();
    const products = result?.data?.items || [];
    
    productEntries = products.map((product: any) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
    }));
  } catch (e) {
    console.error("Sitemap generation: Failed to fetch products:", e);
  }

  // 3. Dynamic Categories
  let categoryEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/categories?limit=100`, {
      next: { revalidate: 3600 }, // Cache on server for 1 hour
    });
    const result = await res.json();
    const categories = result?.data?.items || (Array.isArray(result?.data) ? result.data : []);
    
    categoryEntries = categories.map((cat: any) => ({
      url: `${siteUrl}/shop?category=${cat.slug}`,
      lastModified: new Date(),
    }));
  } catch (e) {
    console.error("Sitemap generation: Failed to fetch categories:", e);
  }

  return [...staticRoutes, ...productEntries, ...categoryEntries];
}
