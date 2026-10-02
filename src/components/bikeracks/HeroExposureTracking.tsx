"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// Reports this visitor's bucket for the "bike-racks-headline" 4-way split
// test (src/lib/splitTest.ts, assigned by src/proxy.ts) to PostHog. The
// real cookie values are control / variant-2-nobodys-bike /
// variant-3-move-with-ease / variant-4-new-way — mapped here to the clean
// control/v2/v3/v4 labels PostHog queries expect. This mapping is
// presentation-only: it never touches the actual cookie or proxy.ts's
// bucketing logic, so it can't reshuffle anyone already assigned.
const COOKIE_NAME = "ab_bike-racks-headline";
const VARIANT_LABELS: Record<string, string> = {
  control: "control",
  "variant-2-nobodys-bike": "v2",
  "variant-3-move-with-ease": "v3",
  "variant-4-new-way": "v4",
};

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Rendered from Hero.tsx, which every /lp-bike-racks(-v2/v3/v4) page
// renders — one insertion point covers all four variants instead of
// duplicating this in each page.tsx.
export function HeroExposureTracking() {
  useEffect(() => {
    if (window.location.hostname !== "go.jbracks.com") return;

    const rawVariant = readCookie(COOKIE_NAME);
    const variant = rawVariant ? VARIANT_LABELS[rawVariant] : undefined;
    if (!variant) return;

    posthog.register({ lp_test: "lp-bike-racks", lp_variant: variant });
    posthog.setPersonProperties({}, { lp_bike_racks_variant: variant });
    posthog.capture("$feature_flag_called", {
      $feature_flag: "lp-bike-racks-test",
      $feature_flag_response: variant,
    });
  }, []);

  return null;
}
