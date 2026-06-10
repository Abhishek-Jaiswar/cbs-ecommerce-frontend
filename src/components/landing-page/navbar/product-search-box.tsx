"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSearchBoxProps {
  className?: string;
  onClick?: () => void;
  placeholder?: string;
}

export default function ProductSearchBox({
  className,
  onClick,
  placeholder = "Search entire store here",
}: ProductSearchBoxProps) {
  const [isMac, setIsMac] = React.useState(false);

  // Determine platform for keyboard shortcut hint
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-11 w-full items-center justify-between border border-[#e4dfd7] bg-white px-4 text-left transition-colors hover:border-[#c29958] cursor-pointer",
        className
      )}
    >
      <span className="text-sm text-[#999999] font-normal truncate">
        {placeholder}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-[#e4dfd7] bg-[#faf8f4] px-1.5 font-mono text-[9px] font-bold text-[#999999]">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
        <Search className="h-4 w-4 text-[#c29958] transition-colors group-hover:text-[#222222]" />
      </div>
    </button>
  );
}
