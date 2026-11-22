"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Loader2, X } from "lucide-react";
import { ZvProductCard } from "@/components/storefront/zv-product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetShopListingInfiniteQuery } from "@/services/api/products/products-api";
import { cn } from "@/lib/utils";
import { buildShopQuery, parseShopUrl, SORT_OPTIONS, toApiFilters, type ShopSortKey, type ShopUrlState } from "./shop-url";
import { ZvFilterDrawer } from "./zv-filter-drawer";

const CHUNK_SIZE = 20;
/** Chunks loaded automatically on scroll before asking for a click (keeps the footer reachable). */
const AUTO_CHUNKS = 3;
const DEFAULT_BANNER = "/zenvoraa/home/shop-split-model.webp";

export function ZvShop() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = useMemo(() => parseShopUrl(new URLSearchParams(searchParams.toString())), [searchParams]);
  const apiFilters = useMemo(() => toApiFilters(state, CHUNK_SIZE), [state]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading, isFetching, isFetchingNextPage, isError, hasNextPage, fetchNextPage, refetch } =
    useGetShopListingInfiniteQuery(apiFilters);

  const pages = useMemo(() => data?.pages ?? [], [data]);
  const first = pages[0]?.data;
  const products = useMemo(() => {
    // de-duplicate defensively in case the catalogue changes between chunks
    const seen = new Set<string>();
    return pages.flatMap((p) => p.data.items).filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  }, [pages]);
  const total = first?.total ?? 0;

  // categories that actually have listed products (from the server), kept across filter changes
  const facetCategories = first?.facets?.categories;
  const [knownCategories, setKnownCategories] = useState<{ slug: string; name: string }[]>([]);
  if (facetCategories && facetCategories !== knownCategories) setKnownCategories(facetCategories);
  const currentCategory =
    first?.category ?? null;
  const categoryName =
    currentCategory?.name ??
    knownCategories.find((c) => c.slug === state.category)?.name ??
    (state.category ? humanise(state.category) : "All");

  // ---- URL updates: filters are the URL, changing them restarts at chunk 1
  const navigate = useCallback(
    (next: ShopUrlState) => {
      router.push(`${pathname}${buildShopQuery(next)}`, { scroll: false });
    },
    [router, pathname],
  );

  // ---- chunked loading: auto-load a few chunks on scroll, then Load More
  const [autoBudget, setAutoBudget] = useState(AUTO_CHUNKS);
  const [lastFilters, setLastFilters] = useState(apiFilters);
  if (lastFilters !== apiFilters) {
    setLastFilters(apiFilters);
    setAutoBudget(AUTO_CHUNKS);
  }
  const canAutoLoad = hasNextPage && pages.length < autoBudget && !isError;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !canAutoLoad || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !isFetching) void fetchNextPage();
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canAutoLoad, isFetching, fetchNextPage]);

  const loadMore = () => {
    setAutoBudget(pages.length + 1 + AUTO_CHUNKS);
    void fetchNextPage();
  };

  // ---- active filter badges (each one removable)
  const badges: { key: string; label: string; remove: () => void }[] = [];
  if (state.category) badges.push({ key: "cat", label: categoryName, remove: () => navigate({ ...state, category: "" }) });
  if (state.search) badges.push({ key: "q", label: `“${state.search}”`, remove: () => navigate({ ...state, search: "" }) });
  if (state.isNew) badges.push({ key: "new", label: "New arrivals", remove: () => navigate({ ...state, isNew: false }) });
  if (state.sale) badges.push({ key: "sale", label: "On sale", remove: () => navigate({ ...state, sale: false }) });
  if (state.featured) badges.push({ key: "feat", label: "Bestsellers", remove: () => navigate({ ...state, featured: false }) });
  if (state.minPrice !== undefined || state.maxPrice !== undefined) {
    badges.push({
      key: "price",
      label: `₹${state.minPrice ?? 0} – ${state.maxPrice !== undefined ? `₹${state.maxPrice}` : "any"}`,
      remove: () => navigate({ ...state, minPrice: undefined, maxPrice: undefined }),
    });
  }
  const tagLabels = new Map(first?.facets?.tagGroups.flatMap((g) => g.tags.map((t) => [t.slug, t.label] as const)) ?? []);
  for (const slug of state.tags) {
    badges.push({
      key: `t:${slug}`,
      label: tagLabels.get(slug) ?? humanise(slug),
      remove: () => navigate({ ...state, tags: state.tags.filter((t) => t !== slug) }),
    });
  }

  const bannerImage = currentCategory?.image || DEFAULT_BANNER;
  const showingFresh = isFetching && !isFetchingNextPage && !isLoading; // filter change in flight

  return (
    <>
      {/* Jumbotron — the site header overlays this */}
      <section className="relative h-[320px] overflow-hidden bg-zv-ink-brown lg:h-[520px]">
        <img
          key={bannerImage}
          src={bannerImage}
          alt={currentCategory?.altText || ""}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith(DEFAULT_BANNER)) e.currentTarget.src = DEFAULT_BANNER;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zv-ink-brown/45 via-zv-ink-brown/20 to-zv-ink-brown/50" />
        <div className="relative flex h-full flex-col items-center justify-center px-zv-20 pt-16 text-center">
          <h1 className="font-zv-display text-[40px] italic leading-tight text-white drop-shadow-sm lg:type-display lg:text-[64px]">
            {categoryName}
          </h1>
          {state.search && <p className="mt-2 type-body text-white/90">Results for “{state.search}”</p>}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1760px] px-zv-10 pb-zv-40 lg:px-zv-40">
        {/* Sort & Filter bar */}
        <div className="flex flex-col gap-zv-10 py-zv-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-zv-10">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="h-[39px] w-[150px] rounded-leaf bg-zv-primary type-button text-white transition-colors hover:bg-zv-hover"
              aria-haspopup="dialog"
            >
              Filters{badges.length ? ` (${badges.length})` : ""}
            </button>
            {badges.map((b) => (
              <span key={b.key} className="inline-flex h-8 items-center gap-1 rounded-full bg-zv-bg pl-3 pr-1 text-sm text-zv-hover">
                {b.label}
                <button
                  type="button"
                  onClick={b.remove}
                  aria-label={`Remove filter ${b.label}`}
                  className="grid size-6 place-items-center rounded-full transition-colors hover:bg-zv-hover/10"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
            {badges.length > 1 && (
              <button
                type="button"
                onClick={() => navigate({ ...state, category: "", tags: [], isNew: false, sale: false, featured: false, search: "", minPrice: undefined, maxPrice: undefined })}
                className="text-sm text-zv-primary underline-offset-4 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-zv-20 lg:justify-end">
            <p className="type-body-sm text-zv-bg2" aria-live="polite">
              {isLoading ? "Loading…" : `${products.length} of ${total}`}
            </p>
            <SortMenu value={state.sortBy} onChange={(sortBy) => navigate({ ...state, sortBy })} />
          </div>
        </div>

        {/* Grid */}
        {isError && products.length === 0 ? (
          <StateBox title="We couldn’t load products." action={{ label: "Try again", onClick: () => void refetch() }}>
            Please check your connection and try again.
          </StateBox>
        ) : !isLoading && products.length === 0 ? (
          <StateBox
            title="No pieces match these filters."
            action={badges.length ? { label: "Clear filters", onClick: () => navigate({ ...state, category: "", tags: [], isNew: false, sale: false, featured: false, search: "", minPrice: undefined, maxPrice: undefined }) } : undefined}
          >
            Try removing a filter or browsing all jewellery.
          </StateBox>
        ) : (
          <ul
            className={cn(
              "grid grid-cols-2 gap-zv-10 transition-opacity sm:grid-cols-3 lg:grid-cols-4 lg:gap-zv-20 2xl:grid-cols-5",
              showingFresh && "opacity-60",
            )}
            aria-busy={isFetching}
          >
            {isLoading
              ? Array.from({ length: 10 }, (_, i) => (
                  <li key={i}>
                    <Skeleton className="aspect-[4/5] w-full rounded-leaf bg-zv-bg" />
                  </li>
                ))
              : products.map((p) => (
                  <li key={p.id}>
                    <ZvProductCard product={p} className="w-full" />
                  </li>
                ))}
            {isFetchingNextPage &&
              Array.from({ length: 5 }, (_, i) => (
                <li key={`next-${i}`}>
                  <Skeleton className="aspect-[4/5] w-full rounded-leaf bg-zv-bg" />
                </li>
              ))}
          </ul>
        )}

        {/* Chunk loader */}
        <div ref={sentinelRef} aria-hidden className="h-px" />
        {products.length > 0 && (
          <div className="flex flex-col items-center gap-zv-10 pt-zv-30">
            {hasNextPage ? (
              <>
                {isError && <p className="type-body-sm text-zv-hover">Couldn’t load more products.</p>}
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isFetchingNextPage}
                  className="inline-flex h-11 w-[150px] items-center justify-center gap-2 rounded-leaf-mirror border border-zv-primary bg-white type-button text-zv-primary transition-colors hover:bg-zv-primary hover:text-white disabled:opacity-60"
                >
                  {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : isError ? "Retry" : "Load More"}
                </button>
              </>
            ) : (
              total > CHUNK_SIZE && <p className="type-body-sm text-zv-bg2">You’ve seen all {total} pieces.</p>
            )}
          </div>
        )}
      </div>

      <ZvFilterDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        value={state}
        categories={knownCategories}
        tagGroups={first?.facets?.tagGroups ?? []}
        priceRange={first?.facets?.priceRange}
        onApply={navigate}
      />
    </>
  );
}

function SortMenu({ value, onChange }: { value: ShopSortKey; onChange: (v: ShopSortKey) => void }) {
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="inline-flex h-[38px] min-w-[150px] items-center justify-between gap-2 rounded-leaf-mirror border border-zv-primary bg-white px-zv-10 outline-none focus-visible:ring-2 focus-visible:ring-zv-primary/40"
        aria-label={`Sort by: ${current.label}`}
      >
        <span className="type-serif-sm text-zv-ink-brown">{value === "relevance" ? "Sort By" : current.label}</span>
        <ChevronDown className="size-5 text-zv-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px] font-zv-body">
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as ShopSortKey)}>
          {SORT_OPTIONS.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value} className="text-sm">
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StateBox({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: { label: string; onClick: () => void } | undefined;
}) {
  return (
    <div className="flex flex-col items-center gap-zv-10 rounded-leaf-lg bg-zv-bg-soft px-zv-20 py-zv-40 text-center">
      <p className="type-h4 text-zv-ink-brown">{title}</p>
      <p className="type-body-sm text-zv-bg2">{children}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-zv-10 h-11 w-[150px] rounded-leaf bg-zv-primary type-button text-white transition-colors hover:bg-zv-hover"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

const humanise = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
