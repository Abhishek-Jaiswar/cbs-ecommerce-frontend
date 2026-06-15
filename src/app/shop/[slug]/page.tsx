import React from "react";
import ProductDetails from "./product-details";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${API_URL}/products/slug/${slug}`);
    const result = await res.json();
    const product = result?.data;

    if (!product) {
      return {
        title: "Design Not Found | ZenVora Premium Jewelry",
        description: "This jewelry design could not be found in our catalog.",
      };
    }

    const title = `${product.name} | ZenVora Handcrafted Jewelry`;
    const description =
      product.excerpt ||
      product.description?.substring(0, 150) ||
      `Discover the elegant ${product.name} at ZenVora. Handcrafted to perfection.`;
    const imageUrl = product.images?.[0]?.media?.url || "";

    return {
      title,
      description,
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
      title: "Handcrafted Jewelry | ZenVora",
      description: "Explore our premium handcrafted jewelry collection.",
    };
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
};

export default Page;
