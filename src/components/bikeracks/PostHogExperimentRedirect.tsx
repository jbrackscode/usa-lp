"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// Redirects a visitor landing on the control URL (/lp-bike-racks) to the
// matching variant page based on the PostHog Experiment
// "lp-bike-racks-ab-test" feature flag. PostHog owns bucketing and
// persistence for this test now — the old cookie-based proxy.ts split test
// ("bike-racks-headline") is disabled, see src/lib/splitTest.ts.
//
// Only rendered on /lp-bike-racks itself (see that page's page.tsx) — the
// variant pages are redirect destinations, not sources, so they don't need
// this check.
export function PostHogExperimentRedirect() {
  useEffect(() => {
    // Matches the same hostname gate instrumentation-client.ts uses to
    // init PostHog — without it, posthog is never initialized on preview
    // deployments/localhost, so onFeatureFlags would just hang.
    if (window.location.hostname !== "go.jbracks.com") return;

    posthog.onFeatureFlags(() => {
      const variant = posthog.getFeatureFlag("lp-bike-racks-ab-test");
      if (variant === "v2") {
        window.location.replace("/lp-bike-racks-v2" + window.location.search);
      } else if (variant === "v3") {
        window.location.replace("/lp-bike-racks-v3" + window.location.search);
      } else if (variant === "v4") {
        window.location.replace("/lp-bike-racks-v4" + window.location.search);
      }
      // 'control' (or any other/missing value) does nothing — visitor
      // stays on this page.
    });
  }, []);

  return null;
}
