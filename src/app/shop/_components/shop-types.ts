import type {
  IBrands,
  ICategories,
  ProductListing,
} from "@/services/api/products/products-api.types";

export type ShopViewMode = "grid" | "list";

export type ShopSortKey =
  | "relevance"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "new";

export type ShopCategory = ICategories;

export type ShopBrand = IBrands;

export type ShopProduct = ProductListing;
