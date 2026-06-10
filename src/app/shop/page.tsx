import { ShopBreadcrumb } from "./_components/shop-breadcrumb";
import { ShopCatalog } from "./_components/shop-catalog";

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
