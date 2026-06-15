import { ShopBreadcrumb } from "./_components/shop-breadcrumb";
import { ShopCatalog } from "./_components/shop-catalog";
import { Metadata } from "next";

type ShopPageProps = {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    tag?: string;
    featured?: string;
    sale?: string;
    brand?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = params?.category;

  if (!categorySlug) {
    return {
      title: "Shop Premium Handcrafted Jewelry | ZenVoraa Catalog",
      description:
        "Browse our curated artificial jewelry collections. Shop elegant designer rings, necklaces, earrings, bracelets, and complete sets at ZenVoraa.",
      alternates: {
        canonical: "/shop",
      },
      openGraph: {
        title: "Shop Premium Handcrafted Jewelry | ZenVoraa Catalog",
        description:
          "Browse our curated artificial jewelry collections. Shop elegant designer rings, necklaces, earrings, bracelets, and complete sets at ZenVoraa.",
        type: "website",
      },
    };
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.zenvora.com/api/v1";
    const res = await fetch(`${API_URL}/categories/slug/${categorySlug}`);
    const result = await res.json();
    const category = result?.data;

    if (!category) {
      return {
        title: "Shop Premium Handcrafted Jewelry | ZenVoraa Catalog",
        description:
          "Browse our curated artificial jewelry collections. Shop elegant designer rings, necklaces, earrings, bracelets, and complete sets at ZenVoraa.",
        alternates: {
          canonical: `/shop?category=${categorySlug}`,
        },
      };
    }

    const title = `${category.name} | Premium Handcrafted Jewelry | ZenVoraa`;
    const description =
      category.excerpt ||
      `Browse our collection of ${category.name} at ZenVoraa. Handcrafted, premium jewelry designed for every occasion.`;
    const imageUrl = category.image || "";

    return {
      title,
      description,
      alternates: {
        canonical: `/shop?category=${categorySlug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        images: imageUrl ? [{ url: imageUrl, alt: category.name }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Failed to generate dynamic category metadata:", error);
    return {
      title: "Shop Premium Handcrafted Jewelry | ZenVoraa Catalog",
      description: "Browse our curated artificial jewelry collections.",
      alternates: {
        canonical: `/shop?category=${categorySlug}`,
      },
    };
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-white">
      <ShopBreadcrumb />
      <ShopCatalog
        initialSearch={params?.search ?? ""}
        initialCategory={params?.category ?? ""}
        initialTag={params?.tag ?? ""}
        initialFeatured={params?.featured === "true"}
        initialSale={params?.sale === "true"}
        initialBrand={params?.brand ?? ""}
      />
    </main>
  );
}
