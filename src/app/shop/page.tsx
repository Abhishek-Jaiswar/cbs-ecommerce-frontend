import { ShopBreadcrumb } from "./_components/shop-breadcrumb";
import { ShopCatalog } from "./_components/shop-catalog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Premium Handcrafted Jewelry | ZenVora Catalog",
  description:
    "Browse our curated artificial jewelry collections. Shop elegant designer rings, necklaces, earrings, bracelets, and complete sets at ZenVora.",
  openGraph: {
    title: "Shop Premium Handcrafted Jewelry | ZenVora Catalog",
    description:
      "Browse our curated artificial jewelry collections. Shop elegant designer rings, necklaces, earrings, bracelets, and complete sets at ZenVora.",
    type: "website",
  },
};

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
