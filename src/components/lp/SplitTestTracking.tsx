"use client";

import { useEffect } from "react";
import { splitTests } from "@/lib/splitTest";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Reports which split-test variant this visitor was assigned (the cookie
// proxy.ts already set) as a GA4 event — lets you filter or compare
// any downstream conversion event by variant_id in GA4 Explore without
// registering a custom dimension first. Mounted once in the root layout,
// so it covers every active test in splitTest.ts automatically.
export function SplitTestTracking() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    for (const test of splitTests) {
      const variantId = readCookie(`ab_${test.id}`);
      if (!variantId) continue;
      window.gtag("event", "split_test_view", { test_id: test.id, variant_id: variantId });
    }
  }, []);

  return null;
}
