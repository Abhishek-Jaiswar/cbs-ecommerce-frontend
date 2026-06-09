import { ShopBreadcrumb } from "./_components/shop-breadcrumb";
import { ShopCatalog } from "./_components/shop-catalog";

type ShopPageProps = {
  searchParams?: Promise<{
    search?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-white">
      <ShopBreadcrumb />
      <ShopCatalog initialSearch={params?.search ?? ""} />
    </main>
  );
}
