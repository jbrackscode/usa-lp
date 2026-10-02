import posthog from "posthog-js";

// PostHog analytics for the /lp-bike-racks 4-way headline split test (see
// src/lib/splitTest.ts, test id "bike-racks-headline"). Uses Next.js's
// instrumentation-client.ts convention (runs after HTML load, before
// hydration) instead of a layout <Script>/useEffect, so init happens as
// early as possible and the onRouterTransitionStart hook below gives us
// correct App Router pageview tracking "for free" instead of a manual
// usePathname/useSearchParams listener.
//
// Only initializes on the real production host — preview deployments and
// localhost dev traffic never send data. Left unset (no
// NEXT_PUBLIC_POSTHOG_KEY/HOST), this is a no-op everywhere.
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const posthogEnabled = Boolean(POSTHOG_KEY && POSTHOG_HOST && window.location.hostname === "go.jbracks.com");

if (posthogEnabled) {
  posthog.init(POSTHOG_KEY as string, {
    api_host: POSTHOG_HOST as string,
    persistence: "localStorage+cookie",
    cross_subdomain_cookie: true,
    person_profiles: "always",
    cookie_persisted_properties: ["lp_test", "lp_variant"],
    // We send $pageview manually (first load via `loaded` below, later
    // client-side navigations via onRouterTransitionStart) instead of
    // PostHog's own automatic pageview capture, since that's tuned for the
    // Pages Router's full navigations and double-fires/misses on App
    // Router client transitions.
    capture_pageview: false,
    loaded: (ph) => ph.capture("$pageview"),
  });
}

export function onRouterTransitionStart() {
  if (posthogEnabled) posthog.capture("$pageview");
}
