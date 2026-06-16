import React from "react";
import ProductDetails from "./product-details";
import { Metadata } from "next";
import { getApiUrl, fetchWithTimeout } from "@/lib/utils";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zenvoraa.in";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const API_URL = getApiUrl();

  try {
    const res = await fetchWithTimeout(`${API_URL}/products/slug/${slug}`);
    const result = await res.json();
    const product = result?.data;

    if (!product) {
      return {
        title: "Design Not Found | ZenVoraa Premium Jewelry",
        description: "This jewelry design could not be found in our catalog.",
      };
    }

    const title = `${product.name} | ZenVoraa Handcrafted Jewelry`;
    const description =
      product.excerpt ||
      product.description?.substring(0, 150) ||
      `Discover the elegant ${product.name} at ZenVoraa. Handcrafted to perfection.`;
    const imageUrl = product.images?.[0]?.media?.url || "";

    return {
      title,
      description,
      alternates: {
        canonical: `/shop/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Failed to generate dynamic product metadata:", error);
    return {
      title: "Handcrafted Jewelry | ZenVoraa",
      description: "Explore our premium handcrafted jewelry collection.",
      alternates: {
        canonical: `/shop/${slug}`,
      },
    };
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const API_URL = getApiUrl();

  let productSchema = null;

  try {
    const res = await fetchWithTimeout(`${API_URL}/products/slug/${slug}`);
    const result = await res.json();
    const product = result?.data;

    if (product) {
      const imageUrls = product.images?.map((img: any) => img.media?.url).filter(Boolean) || [];
      const primaryImage = imageUrls[0] || "";

      productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": imageUrls.length > 0 ? imageUrls : [primaryImage],
        "description": product.excerpt || product.description || "",
        "sku": product.variants?.[0]?.sku || `ZV-${product.id}`,
        "brand": {
          "@type": "Brand",
          "name": product.brand?.name || "ZenVoraa",
        },
        "offers": {
          "@type": "Offer",
          "url": `${siteUrl}/shop/${slug}`,
          "priceCurrency": "INR",
          "price": product.price,
          "priceValidUntil": "2030-12-31",
          "availability": product.variants?.some((v: any) => v.stock > 0)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition",
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch product data for schema injection:", error);
  }

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductDetails slug={slug} />
    </>
  );
};

export default Page;
