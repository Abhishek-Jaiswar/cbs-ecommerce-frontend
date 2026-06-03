"use client";

import React from "react";
import {
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetProductTagsQuery,
} from "@/services/api/products/products-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Plus, Check, X } from "lucide-react";
import {
  IBrands,
  ICategories,
  ITag,
} from "@/services/api/products/products-api.types";

interface StepCategoryBrandProps {
  brandId: string;
  setBrandId: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  tagIds: string[];
  setTagIds: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCategoryBrand({
  brandId,
  setBrandId,
  categoryId,
  setCategoryId,
  tagIds,
  setTagIds,
  onNext,
  onBack,
}: StepCategoryBrandProps) {
  // Query backend data
  const { data: categoriesData, isLoading: isLoadingCats } =
    useGetCategoriesQuery();
  const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery();
  const { data: tagsData, isLoading: isLoadingTags } = useGetProductTagsQuery();

  const categories = categoriesData?.data?.items ?? [];
  const brands = brandsData?.data?.items ?? [];
  const tags = tagsData?.data?.items ?? [];

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTags = tags.filter((tag: ITag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tagId: string, checked: boolean) => {
    if (checked) {
      setTagIds([...tagIds, tagId]);
    } else {
      setTagIds(tagIds.filter((id) => id !== tagId));
    }
  };

  const isFormValid = categoryId.trim().length > 0;

  const handleNextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
  };

  const isLoading = isLoadingCats || isLoadingBrands || isLoadingTags;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">
          Loading classification metadata...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleNextSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Category and Brand Dropdowns in a single Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Dropdown Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Product Category *
            </label>
            <div className="flex items-center gap-2">
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="flex-1 bg-background border-input text-foreground">
                  <SelectValue placeholder="Select Product Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: ICategories) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      className="cursor-pointer"
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 hover:bg-accent hover:text-foreground"
                title="Create New Category"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Brand Dropdown Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Product Brand (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger className="flex-1 bg-background border-input text-foreground">
                  <SelectValue placeholder="Select Product Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="cursor-pointer text-muted-foreground italic">
                    None (No Brand)
                  </SelectItem>
                  {brands.map((b: IBrands) => (
                    <SelectItem
                      key={b.id}
                      value={b.id}
                      className="cursor-pointer"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 hover:bg-accent hover:text-foreground"
                title="Create New Brand"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Tags list selection */}
        <div className="space-y-3" ref={containerRef}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Product Tags
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs gap-1 hover:bg-accent hover:text-foreground"
              title="Create New Tag"
            >
              <Plus className="h-3 w-3" /> Create Tag
            </Button>
          </div>

          {/* Selected Tags Badges Container */}
          {tagIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-border/60 bg-muted/10">
              {tagIds.map((tagId) => {
                const tag = tags.find((t: ITag) => t.id === tagId);
                if (!tag) return null;
                return (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="gap-1 px-2.5 py-0.5 text-xs bg-secondary text-secondary-foreground font-semibold flex items-center rounded-md"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleTagToggle(tag.id, false)}
                      className="text-muted-foreground hover:text-foreground shrink-0 rounded-full focus:outline-none ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Search Input and Dropdown Menu */}
          <div className="relative">
            <input
              type="text"
              placeholder={tags.length > 0 ? "Search and select tags..." : "No tags available"}
              disabled={tags.length === 0}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            {isOpen && tags.length > 0 && (
              <div className="absolute z-50 w-full bottom-full mb-1.5 max-h-48 overflow-y-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-50 slide-in-from-bottom-1">
                <div className="p-1 space-y-0.5">
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag: ITag) => {
                      const isSelected = tagIds.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.id, !isSelected)}
                          className="flex items-center justify-between w-full px-2.5 py-2 text-sm text-left rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                          <span className="font-semibold">{tag.name}</span>
                          {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-3 text-center text-xs text-muted-foreground italic">
                      No matching tags found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="gap-2 border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Previous Step
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid}
          className="gap-2 shadow-sm rounded-lg"
        >
          Next Step <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
