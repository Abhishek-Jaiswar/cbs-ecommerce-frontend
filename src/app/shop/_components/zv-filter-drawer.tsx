"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ShopTagGroup } from "@/services/api/products/products-api.types";
import type { ShopUrlState } from "./shop-url";

/** Figma order first; any other "Group: Value" groups follow alphabetically. */
const GROUP_ORDER = ["Style", "Occasion", "Material"];

type CategoryOption = { slug: string; name: string };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: ShopUrlState;
  categories: CategoryOption[];
  tagGroups: ShopTagGroup[];
  priceRange: { min: number; max: number } | undefined;
  onApply: (next: ShopUrlState) => void;
}

export function ZvFilterDrawer(props: Props) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        aria-describedby={undefined}
        className="flex w-[300px] max-w-[85vw] flex-col gap-0 border-r-0 bg-white p-0 font-zv-body sm:max-w-[300px]"
      >
        {/* remount per open so the draft always starts from the applied filters */}
        {props.open && <DrawerBody {...props} />}
      </SheetContent>
    </Sheet>
  );
}

function DrawerBody({ value, categories, tagGroups, priceRange, onApply, onOpenChange }: Props) {
  const [draft, setDraft] = useState<ShopUrlState>(value);
  const [minText, setMinText] = useState(value.minPrice?.toString() ?? "");
  const [maxText, setMaxText] = useState(value.maxPrice?.toString() ?? "");

  const groups = [...tagGroups].sort((a, b) => {
    const ia = GROUP_ORDER.indexOf(a.group);
    const ib = GROUP_ORDER.indexOf(b.group);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.group.localeCompare(b.group);
  });

  const toggleTag = (slug: string) =>
    setDraft((d) => ({
      ...d,
      tags: d.tags.includes(slug) ? d.tags.filter((t) => t !== slug) : [...d.tags, slug],
    }));
  const clearGroup = (group: ShopTagGroup) =>
    setDraft((d) => ({ ...d, tags: d.tags.filter((t) => !group.tags.some((g) => g.slug === t)) }));

  const parsePrice = (s: string) => {
    const n = Number(s.replace(/[^\d.]/g, ""));
    return s.trim() === "" || !Number.isFinite(n) ? undefined : Math.round(n);
  };

  const apply = () => {
    let minPrice = parsePrice(minText);
    let maxPrice = parsePrice(maxText);
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }
    onApply({ ...draft, minPrice, maxPrice });
    onOpenChange(false);
  };

  const clear = () => {
    // keep the search term (it comes from the header search, not this drawer)
    onApply({ ...draft, category: "", tags: [], isNew: false, sale: false, featured: false, minPrice: undefined, maxPrice: undefined });
    onOpenChange(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-zv-20 pb-zv-10 pt-zv-20">
        <SheetTitle className="font-zv-display text-[28px] font-normal text-zv-ink-brown">Filters</SheetTitle>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close filters"
          className="grid size-9 place-items-center rounded-full text-zv-ink-brown transition-colors hover:bg-zv-bg"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-zv-20">
        <Section title="Category">
          <Option
            type="radio"
            checked={!draft.category}
            onChange={() => setDraft((d) => ({ ...d, category: "" }))}
            label="All"
          />
          {categories.map((c) => (
            <Option
              key={c.slug}
              type="radio"
              checked={draft.category === c.slug}
              onChange={() => setDraft((d) => ({ ...d, category: c.slug }))}
              label={c.name}
            />
          ))}
        </Section>

        <Section title="Price">
          <div className="flex items-center gap-zv-10">
            <PriceBox label="Min" value={minText} onChange={setMinText} placeholder={priceRange ? String(priceRange.min) : "0"} />
            <span className="text-zv-bg2">–</span>
            <PriceBox label="Max" value={maxText} onChange={setMaxText} placeholder={priceRange ? String(priceRange.max) : "Any"} />
          </div>
        </Section>

        <Section title="Collections">
          <Option type="checkbox" checked={draft.isNew} onChange={() => setDraft((d) => ({ ...d, isNew: !d.isNew }))} label="New arrivals" />
          <Option type="checkbox" checked={draft.sale} onChange={() => setDraft((d) => ({ ...d, sale: !d.sale }))} label="On sale" />
          <Option type="checkbox" checked={draft.featured} onChange={() => setDraft((d) => ({ ...d, featured: !d.featured }))} label="Bestsellers" />
        </Section>

        {groups.map((group) => {
          const none = !group.tags.some((t) => draft.tags.includes(t.slug));
          return (
            <Section key={group.group} title={group.group}>
              <Option type="checkbox" checked={none} onChange={() => clearGroup(group)} label="All" />
              {group.tags.map((t) => (
                <Option
                  key={t.slug}
                  type="checkbox"
                  checked={draft.tags.includes(t.slug)}
                  onChange={() => toggleTag(t.slug)}
                  label={t.label}
                />
              ))}
            </Section>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-zv-10 border-t border-zv-bg2/30 p-zv-20">
        <button
          type="button"
          onClick={clear}
          className="h-11 rounded-leaf border border-zv-primary bg-white type-button text-zv-primary transition-colors hover:bg-zv-bg"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={apply}
          className="h-11 rounded-leaf-mirror bg-zv-primary type-button text-white transition-colors hover:bg-zv-hover"
        >
          Apply
        </button>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-zv-bg2/40 py-zv-20 last:border-b-0">
      <legend className="float-left mb-zv-10 w-full font-zv-display text-xl font-semibold text-zv-ink-brown">{title}</legend>
      <div className="clear-both flex flex-col gap-2">{children}</div>
    </fieldset>
  );
}

function Option({
  type,
  checked,
  onChange,
  label,
}: {
  type: "radio" | "checkbox";
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-zv-10 py-0.5 text-sm text-zv-ink-brown">
      <input type={type} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "grid size-4 shrink-0 place-items-center border border-zv-primary transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-zv-primary/40",
          type === "radio" ? "rounded-full" : "rounded-[3px]",
          checked && "bg-zv-primary",
        )}
      >
        {checked && <span className={cn("bg-white", type === "radio" ? "size-1.5 rounded-full" : "size-1.5 rounded-[1px]")} />}
      </span>
      <span className={cn("transition-colors group-hover:text-zv-primary", checked && "font-semibold")}>{label}</span>
    </label>
  );
}

function PriceBox({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex h-10 flex-1 items-center gap-1 rounded-zv-xs border border-zv-bg2/60 px-zv-10 text-sm focus-within:border-zv-primary">
      <span className="text-zv-bg2">₹</span>
      <input
        inputMode="numeric"
        aria-label={`${label} price`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, "").slice(0, 7))}
        className="w-full min-w-0 bg-transparent text-zv-ink-brown outline-none placeholder:text-zv-bg2/70"
      />
    </label>
  );
}
