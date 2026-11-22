"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown, Minus, Plus, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { useCreateReviewMutation, useGetProductReviewsQuery, type ReviewSort } from "@/services/api/reviews/reviews-api";
import type { ISpecifications } from "@/services/api/products/products-api.types";
import {
  CARE_SPEC_KEY,
  DEFAULT_CARE_INSTRUCTIONS,
  DISPATCH_TIME,
  FREE_SHIPPING_THRESHOLD,
  RETURN_WINDOW_SUMMARY,
  SHIPPING_FEE,
} from "@/lib/store-policy";
import { formatInr } from "@/components/storefront/zv-product-card";

interface Props {
  productId: string;
  description: string;
  specifications: ISpecifications[];
  open: string[];
  onOpenChange: (open: string[]) => void;
}

/**
 * Figma Product > Info accordions: Details, Delivery and Return, Care
 * Instructions, Reviews. Each section: 1px bg2 divider, space-40, Geist 16 title.
 */
export function ZvProductSections({ productId, description, specifications, open, onOpenChange }: Props) {
  const care = specifications.find((s) => s.key.trim().toLowerCase() === CARE_SPEC_KEY);
  const specs = specifications.filter((s) => s !== care);

  return (
    <AccordionPrimitive.Root type="multiple" value={open} onValueChange={onOpenChange} className="border-b border-zv-bg2">
      <Section value="details" title="Details">
        {description && <p className="whitespace-pre-line">{description}</p>}
        {specs.length > 0 && (
          <dl className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-zv-20 gap-y-2">
            {specs.map((s) => (
              <div key={s.id} className="contents">
                <dt className="text-zv-bg2">{s.key}</dt>
                <dd className="text-zv-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="text-xs text-zv-bg2">Weights and measurements are approximate and may vary slightly.</p>
      </Section>

      <Section value="delivery" title="Delivery and Return">
        <p className="rounded-leaf-mirror bg-zv-bg p-zv-10 text-center text-zv-ink">
          Free shipping on orders of {formatInr(FREE_SHIPPING_THRESHOLD)} or more
        </p>
        <p>
          Dispatched within {DISPATCH_TIME}. Orders below {formatInr(FREE_SHIPPING_THRESHOLD)} have a{" "}
          {formatInr(SHIPPING_FEE)} delivery charge.{" "}
          <Link href="/shipping-policy" className="text-zv-primary underline-offset-4 hover:underline">
            Shipping policy
          </Link>
        </p>
        <p>
          Return Policy: {RETURN_WINDOW_SUMMARY}, subject to T&amp;C.{" "}
          <Link href="/refund-policy" className="text-zv-primary underline-offset-4 hover:underline">
            Refund policy
          </Link>
        </p>
      </Section>

      <Section value="care" title="Care Instructions">
        <p className="whitespace-pre-line">{care?.value || DEFAULT_CARE_INSTRUCTIONS}</p>
      </Section>

      <ReviewsSection productId={productId} />
    </AccordionPrimitive.Root>
  );
}

function Section({
  value,
  title,
  extra,
  children,
}: {
  value: string;
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AccordionPrimitive.Item value={value} id={`section-${value}`} className="group/item scroll-mt-[120px] border-t border-zv-bg2">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="flex w-full items-center justify-between gap-zv-10 py-zv-30 text-left text-base text-zv-ink outline-none focus-visible:ring-2 focus-visible:ring-zv-primary/40 lg:py-zv-40">
          <span className="flex items-center gap-zv-10">
            {title}
            {extra}
          </span>
          <Plus aria-hidden className="size-[18px] shrink-0 group-data-[state=open]/item:hidden" />
          <Minus aria-hidden className="hidden size-[18px] shrink-0 group-data-[state=open]/item:block" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="flex flex-col gap-zv-20 pb-zv-30 text-sm leading-[1.5] text-zv-ink lg:pb-zv-40">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn("size-3.5", s <= Math.round(value) ? "fill-zv-gold text-zv-gold" : "fill-zv-bg text-zv-bg2/50")}
        />
      ))}
    </span>
  );
}

const PAGE = 6;
const REVIEW_SORT_OPTIONS: { value: ReviewSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

function ReviewsSection({ productId }: { productId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [limit, setLimit] = useState(PAGE);
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [writing, setWriting] = useState(false);
  const { data, isLoading, isFetching } = useGetProductReviewsQuery({ productId, limit, sort });
  const reviews = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const average = data?.data?.averageRating ?? null;
  const sortLabel = REVIEW_SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Newest";

  const startReview = () => {
    if (!isAuthenticated) return router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    setWriting((w) => !w);
  };

  return (
    <Section
      value="reviews"
      title="Reviews"
      extra={
        total > 0 ? (
          <span className="flex items-center gap-1.5 text-xs text-zv-bg2">
            <Stars value={average ?? 0} />
            {average !== null && <span>{average.toFixed(1)}</span>}
            <span>({total})</span>
          </span>
        ) : null
      }
    >
      {/* Figma: "Write A Review" on the left, Sort dropdown on the right */}
      <div className="flex min-h-[38px] items-center justify-between gap-zv-10">
        <button
          type="button"
          onClick={startReview}
          aria-expanded={writing}
          className="text-sm text-zv-ink underline-offset-4 transition-colors hover:text-zv-primary hover:underline"
        >
          {writing ? "Close" : "Write A Review"}
        </button>
        {total > 1 && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              className="inline-flex h-[38px] w-[150px] items-center justify-between gap-2 rounded-leaf-mirror border border-zv-primary bg-white px-zv-10 outline-none focus-visible:ring-2 focus-visible:ring-zv-primary/40"
              aria-label={`Sort reviews: ${sortLabel}`}
            >
              <span className="type-serif-sm text-zv-ink-brown">{sort === "newest" ? "Sort By" : sortLabel}</span>
              <ChevronDown className="size-5 text-zv-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px] font-zv-body">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(v) => {
                  setSort(v as ReviewSort);
                  setLimit(PAGE);
                }}
              >
                {REVIEW_SORT_OPTIONS.map((o) => (
                  <DropdownMenuRadioItem key={o.value} value={o.value} className="text-sm">
                    {o.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {writing && isAuthenticated && <ReviewForm productId={productId} onDone={() => setWriting(false)} />}

      {isLoading ? (
        <div className="flex gap-zv-20 overflow-hidden">
          {[0, 1].map((i) => (
            <div key={i} className="h-[171px] w-[322px] shrink-0 animate-pulse rounded-leaf bg-zv-bg" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-zv-bg2">No reviews yet. Be the first to share how you styled it.</p>
      ) : (
        <ul
          className={cn(
            "-mx-zv-20 flex snap-x snap-mandatory scroll-px-zv-20 gap-zv-20 overflow-x-auto px-zv-20 pb-2 [scrollbar-width:thin] lg:mx-0 lg:scroll-px-0 lg:px-0",
            isFetching && "opacity-60 transition-opacity",
          )}
          aria-label="Customer reviews"
        >
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex min-h-[171px] w-[322px] max-w-[85vw] shrink-0 snap-start flex-col gap-zv-10 rounded-leaf bg-zv-bg-soft p-zv-20"
            >
              <div className="flex items-center justify-between gap-zv-10">
                <Stars value={r.rating} className="[&>svg]:size-4" />
                <span className="sr-only">{r.rating} out of 5</span>
                <time dateTime={r.createdAt} className="text-xs text-zv-bg2">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </time>
              </div>
              <p className="line-clamp-4 flex-1 whitespace-pre-line text-sm leading-[1.5] text-zv-ink" title={r.comment}>
                {r.comment}
              </p>
              <p className="type-signature text-zv-ink-brown">-{r.user?.name || "ZenVoraa customer"}</p>
            </li>
          ))}
          {reviews.length < total && (
            <li className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => setLimit((l) => l + PAGE)}
                disabled={isFetching}
                className="h-11 w-[150px] rounded-leaf-mirror border border-zv-primary bg-white type-button text-zv-primary transition-colors hover:bg-zv-primary hover:text-white disabled:opacity-60"
              >
                {isFetching ? "Loading…" : "More reviews"}
              </button>
            </li>
          )}
        </ul>
      )}
    </Section>
  );
}

function ReviewForm({ productId, onDone }: { productId: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!rating) return setError("Please choose a star rating.");
    if (comment.trim().length < 3) return setError("Please write a few words about the piece.");
    try {
      await createReview({ productId, rating, comment: comment.trim() }).unwrap();
      setRating(0);
      setComment("");
      toast.success("Thank you! Your review is live.");
      onDone();
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      setError(msg || "Couldn’t post your review. You may have already reviewed this piece.");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-zv-10 rounded-leaf bg-zv-bg-soft p-zv-20">
      <p className="font-zv-display text-xl italic text-zv-ink-brown">Write a review</p>
      <div role="radiogroup" aria-label="Your rating" className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={rating === s}
            aria-label={`${s} star${s > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(s)}
            onClick={() => setRating(s)}
            className="grid size-8 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zv-primary/40"
          >
            <Star className={cn("size-5 transition-colors", s <= (hover || rating) ? "fill-zv-gold text-zv-gold" : "text-zv-bg2/60")} />
          </button>
        ))}
      </div>
      <label className="sr-only" htmlFor="review-comment">
        Your review
      </label>
      <textarea
        id="review-comment"
        rows={4}
        maxLength={1000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How did it look, feel and wear?"
        className="resize-none rounded-zv-xs border border-zv-bg2/50 bg-white p-zv-10 text-sm text-zv-ink outline-none placeholder:text-zv-bg2/70 focus:border-zv-primary"
      />
      {error && (
        <p role="alert" className="text-sm text-zv-hover">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="h-11 self-start rounded-leaf bg-zv-primary px-zv-30 type-button text-white transition-colors hover:bg-zv-hover disabled:opacity-60"
      >
        {isLoading ? "Posting…" : "Post Review"}
      </button>
    </form>
  );
}
