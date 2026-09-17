# Split testing (no database required)

How to run an A/B/n test between different landing pages, control the
traffic split, and read the results — without a database. The system is
`src/proxy.ts` + `src/lib/splitTest.ts`, and it's already running one live
test (see below).

## How it works

1. A visitor requests a **test URL** (e.g. `/lp-vertical-bike-racks`).
2. `src/proxy.ts` runs before the page renders. If that URL matches an
   `enabled` test in `src/lib/splitTest.ts`, it checks for a bucketing
   cookie (`ab_<test id>`).
   - **No cookie** → picks a variant by weighted random, then sets the
     cookie (30 days) so this visitor always lands in the same bucket.
   - **Cookie already set** → reuses that variant. No re-rolling on every
     visit.
3. The response is an internal **rewrite** to that variant's real page —
   the URL bar always stays on the test URL. Nobody needs to know
   `/lp-vertical-bike-racks` is secretly serving `/lp-demonstration`'s HTML
   this time.
4. Once the page loads, `SplitTestTracking` (mounted site-wide in
   `src/app/layout.tsx`) reads the same cookie and fires a GA4 event —
   `split_test_view` with `test_id` / `variant_id` — so you can see and
   filter by variant without touching GA4's admin settings first.
5. Search engine and social crawlers (Googlebot, bingbot, facebookexternalhit,
   etc.) always get the first variant and never get a cookie, so the
   canonical URL doesn't get indexed with three different bodies depending
   on which crawl drew which bucket.

No database, no third-party A/B tool, no client-side flash of the wrong
variant — the rewrite happens server-side before any HTML is sent.

## The live test

```ts
// src/lib/splitTest.ts
{
  id: "vertical-rack-lp",
  sourcePath: "/lp-vertical-bike-racks",
  enabled: true,
  variants: [
    { id: "control", path: "/lp-vertical-bike-racks", weight: 1 },
    { id: "variant-1-demo", path: "/lp-demonstration", weight: 1 },
    { id: "variant-2-demo-video", path: "/lp-demonstration-videos", weight: 1 },
  ],
},
```

Equal weights (1/1/1) — roughly an even three-way split.

## Controlling the split

Everything is controlled from `src/lib/splitTest.ts`. Edit, commit, push,
redeploy — same workflow as every other change to this repo.

- **Change the ratio** — weights are relative, not percentages.
  `{ 1, 1, 1 }` ≈ 33/33/33. `{ 2, 1, 1 }` sends half of traffic to the
  first variant and a quarter each to the other two.
- **Pause one variant** — set its `weight` to `0`. New visitors stop being
  assigned to it; anyone already bucketed into it (cookie already set)
  keeps seeing it for the rest of the test, so you don't yank the rug out
  from under people mid-session.
- **Pause the whole test** — set `enabled: false`. Every visitor gets the
  first variant (control, by convention) and no cookie is set at all. Flip
  it back to `true` to resume — already-bucketed visitors pick up right
  where they left off.
- **Declare a winner** — once you're done, either delete the test entry
  entirely, or just change `sourcePath`'s single winning variant's `path`
  to itself and delete the others; either way, redeploy.

## Why the split is "even" without a database

There's no shared counter, so this isn't a hard guarantee like "exactly
333 of the next 1,000 visitors get variant B." It's **statistical**: each
new visitor gets an independent weighted-random roll, and the sticky
cookie means that roll only happens once per visitor. Over enough traffic
(a few hundred visitors is usually plenty for a 3-way split), the actual
split converges tightly to the configured weights — this is the same
approach nearly every cookie-based split-testing tool uses under the
hood, database or not.

If you ever need a *hard* cap (e.g. "stop variant B at exactly 500
conversions"), that does require some persistent counter — Vercel Edge
Config or a lightweight KV store would be the next step up, but nothing
here needs that yet.

## Reading results in GA4

Every page view of a bucketed visitor fires:

```
event: split_test_view
  test_id: "vertical-rack-lp"
  variant_id: "control" | "variant-1-demo" | "variant-2-demo-video"
```

- **Quick check**: GA4 → Reports → Realtime → look for `split_test_view`
  in the event list, or Reports → Engagement → Events.
- **Comparing conversions by variant**: GA4 → Explore → Free form. Add
  `variant_id` as a dimension (search for it — it'll show up under Event
  Parameter once the event has fired a few times) and your conversion
  event (e.g. `quiz_complete`, `Add to Cart`) as the metric. This works
  without registering anything in GA4 admin first — event-scoped
  parameters are queryable in Explore automatically. If you later want
  `variant_id` to appear in the *standard* Reports UI (not just Explore),
  register it as a custom dimension: Admin → Custom definitions → Create
  custom dimension → scope "Event", parameter `variant_id`. That's the
  same one-time step the `/lp-quiz` funnel's answer data would need if you
  ever want *those* in standard reports too — optional, not required to
  see results.

## Setting up a new split test

1. **Build the variant pages first** (or pick existing routes) — the test
   just rewrites between real, already-working Next.js routes.
2. **Add the test to `src/lib/splitTest.ts`**:
   ```ts
   {
     id: "my-new-test",              // becomes the cookie name ab_my-new-test
     sourcePath: "/some-real-page",  // the URL that gets traffic
     enabled: true,
     variants: [
       { id: "control", path: "/some-real-page", weight: 1 },
       { id: "variant-a", path: "/some-other-page", weight: 1 },
     ],
   },
   ```
3. **Add `sourcePath` to the matcher in `src/proxy.ts`** — Next.js requires
   matcher paths to be static string literals it can analyze at build
   time, so this can't be generated from the array above automatically:
   ```ts
   export const config = {
     matcher: ["/lp-vertical-bike-racks", "/some-real-page"],
   };
   ```
4. Commit, push, redeploy. That's it — no other wiring needed. GA4 tracking
   and the sticky cookie both work automatically for any test in the array.

## Files

| File | Role |
| --- | --- |
| `src/lib/splitTest.ts` | The config — every test, its variants, and weights. Edit this to control a split. |
| `src/proxy.ts` | Reads/sets the bucketing cookie and rewrites the request. Also where a new test's URL gets added to `matcher`. |
| `src/components/lp/SplitTestTracking.tsx` | Client component, mounted in `src/app/layout.tsx`, that reports the assignment to GA4. |
