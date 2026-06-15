"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import { initializeUtm, trackEvent } from "@/lib/analytics";

function UtmTrackerInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams) {
      initializeUtm(searchParams);
    }
    // Log general page view event
    trackEvent("page_view", { path: pathname });
  }, [searchParams, pathname]);

  return null;
}

export function UtmTracker() {
  return (
    <Suspense fallback={null}>
      <UtmTrackerInner />
    </Suspense>
  );
}
