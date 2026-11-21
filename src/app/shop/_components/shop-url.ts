import type { ShopListingFilters, ShopSortParam } from "@/services/api/products/products-api.types";

/**
 * The Shop URL is the single source of truth for filters. Formats are kept
 * compatible with links used elsewhere (footer, home, product page, search):
 *   ?category=rings  ?tag=new  ?tag=style-minimal,new  ?sale=true  ?featured=true
 *   ?search=ring  ?minPrice=500&maxPrice=2000  ?sortBy=price-asc
 */

export const SORT_OPTIONS = [
  { value: "relevance", label: "Featured", api: "featured" },
  { value: "new", label: "Newest", api: "newest" },
  { value: "price-asc", label: "Price: Low to High", api: "price-asc" },
  { value: "price-desc", label: "Price: High to Low", api: "price-desc" },
  { value: "name-asc", label: "Name: A – Z", api: "name-asc" },
  { value: "name-desc", label: "Name: Z – A", api: "name-desc" },
] as const satisfies readonly { value: string; label: string; api: ShopSortParam }[];

export type ShopSortKey = (typeof SORT_OPTIONS)[number]["value"];

export interface ShopUrlState {
  category: string;
  tags: string[];
  isNew: boolean;
  sale: boolean;
  featured: boolean;
  search: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: ShopSortKey;
}

const toPrice = (v: string | null) => {
  if (v === null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
};

export function parseShopUrl(params: URLSearchParams): ShopUrlState {
  const rawTags = (params.get("tag") ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const sortBy = SORT_OPTIONS.find((o) => o.value === params.get("sortBy"))?.value ?? "relevance";
  let minPrice = toPrice(params.get("minPrice"));
  let maxPrice = toPrice(params.get("maxPrice"));
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  return {
    category: (params.get("category") ?? "").trim().toLowerCase(),
    tags: [...new Set(rawTags.filter((t) => t !== "new"))],
    isNew: rawTags.includes("new") || params.get("new") === "true",
    sale: params.get("sale") === "true",
    featured: params.get("featured") === "true",
    search: (params.get("search") ?? "").trim().slice(0, 100),
    minPrice,
    maxPrice,
    sortBy,
  };
}

export function buildShopQuery(state: ShopUrlState): string {
  const q = new URLSearchParams();
  if (state.category) q.set("category", state.category);
  const tags = [...state.tags, ...(state.isNew ? ["new"] : [])];
  if (tags.length) q.set("tag", tags.join(","));
  if (state.search) q.set("search", state.search);
  if (state.minPrice !== undefined) q.set("minPrice", String(state.minPrice));
  if (state.maxPrice !== undefined) q.set("maxPrice", String(state.maxPrice));
  if (state.sale) q.set("sale", "true");
  if (state.featured) q.set("featured", "true");
  if (state.sortBy !== "relevance") q.set("sortBy", state.sortBy);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function toApiFilters(state: ShopUrlState, limit: number): ShopListingFilters {
  return {
    limit,
    sort: SORT_OPTIONS.find((o) => o.value === state.sortBy)?.api ?? "featured",
    ...(state.category ? { category: state.category } : {}),
    ...(state.tags.length ? { tags: [...state.tags].sort() } : {}),
    ...(state.search ? { search: state.search } : {}),
    ...(state.minPrice !== undefined ? { minPrice: state.minPrice } : {}),
    ...(state.maxPrice !== undefined ? { maxPrice: state.maxPrice } : {}),
    ...(state.sale ? { sale: true } : {}),
    ...(state.isNew ? { isNew: true } : {}),
    ...(state.featured ? { featured: true } : {}),
  };
}

export const EMPTY_SHOP_STATE: ShopUrlState = {
  category: "",
  tags: [],
  isNew: false,
  sale: false,
  featured: false,
  search: "",
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: "relevance",
};
