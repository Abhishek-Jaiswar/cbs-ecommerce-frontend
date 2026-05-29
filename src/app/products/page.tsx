import React from "react";
import { mainProduct } from "@/lib/utils/data";
import ProductGallery from "./_components/product-galary";
import ProductInfo from "./_components/product-info";
import ProductTabs from "./_components/products-tab";
import type { Product } from "./_components/product-types";

const page = () => {
  const product = mainProduct as Product;

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)] lg:gap-12 lg:px-8 lg:py-14">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <ProductTabs product={product} />
      </section>
    </main>
  );
};

export default page;
