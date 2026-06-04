import React from "react";
import ProductDetails from "./product-details";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
};

export default Page;
