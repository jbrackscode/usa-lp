# JB Racks — Landing Pages

Next.js + Tailwind shell for building fast, high-converting landing pages for
JB Racks, hosted on Vercel and hooked up to the Shopify Storefront API for
checkout. Pages link back to the main store rather than replicating it.

## Pages

- **`/`** — just the JB Racks logo, centered, linking to the store.
- **`/lp-demonstration`** — rebuild of the `jb-racks-lp-demonstration-old`
  campaign page (hero, feature rows, comparison table, pricing, testimonials,
  FAQ, closing CTA). Content lives in `src/lib/config.ts`, components in
  `src/components/lp/`.
- **`/lp-newsroom`** — rebuild of the `jb-racks-lp-newsroom` advertorial page
  (numbered reasons, inline CTA, review grid, UGC photo strip). Content in
  `src/lib/newsroom.ts`, components in `src/components/newsroom/`.
- **`/lp-bike-racks`** — listicle-style LP modeled on IM8 Health's GLP1 page,
  built around a headless buy box (size/color/add-on picker → real Shopify
  cart → checkout). Content in `src/lib/bikeRacksListicle.ts` and
  `src/lib/bikeRacks.ts`, components in `src/components/bikeracks/`. Pricing
  is live — see below.

All three share the `Header`/`Footer` in `src/components/lp/` (logo + a
"back to store" link, no full site nav). Duplicate a page folder as the
starting point for the next campaign.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_STORE_URL` | Your live store URL (`https://jbracks.com`) |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Shopify admin → Settings → Apps → Develop apps → create/select an app → Storefront API → install → copy the token |
| `NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE` | The product's URL handle |
| `NEXT_PUBLIC_SHOPIFY_VARIANT_ID` | `gid://shopify/ProductVariant/...` — find via Shopify admin API or the product's GraphQL id |
| `NEXT_PUBLIC_SALE_ENDS_AT` | ISO timestamp the hero countdown targets |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | Meta Events Manager → Data Sources → your pixel → Settings. Optional — leave blank and the pixel simply doesn't render (site-wide, in `src/app/layout.tsx`) |
| `NEXT_PUBLIC_OFFER_TEXT` / `NEXT_PUBLIC_OFFER_LINK` | Current-offer banner on `/lp-bike-racks`, below the header/ticker. Optional — leave `NEXT_PUBLIC_OFFER_TEXT` blank to hide it; `_LINK` is optional too (text renders unlinked without it) |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | GA4 → Admin → Data Streams → your web stream → Measurement ID (`G-XXXXXXXXXX`). Optional — leave blank and gtag.js doesn't load. Once set, the `/lp-quiz` funnel (`src/components/quiz`) fires `quiz_answer`/`quiz_complete` events with the selected choices |
| `KLAVIYO_PRIVATE_API_KEY` | Klaviyo → Settings → API Keys → Private API Keys (needs Profiles + Events write scope, plus Lists write if using `KLAVIYO_LIST_ID`). Server-only — never exposed to the browser. Optional — `/api/quiz-submit` still logs and returns success without it, it just skips the Klaviyo call |
| `KLAVIYO_LIST_ID` | A Klaviyo list ID to subscribe quiz leads to (List Detail page URL, or Settings → Lists). Optional — without it, quiz leads are still tracked as a profile + event, just not added to a list |
| `RESEND_API_KEY` | resend.com → API Keys. Server-only. Optional — without it `/api/quiz-submit` still logs and returns success, it just skips emailing the lead notification |
| `RESEND_FROM_EMAIL` | The sender address, e.g. `"JB Racks Quiz <hello@jbracks.com>"` — must be on a domain verified in Resend (resend.com → Domains). Defaults to Resend's sandbox `onboarding@resend.dev`, which only delivers to your own Resend account email until you verify a domain |
| `QUIZ_NOTIFY_EMAIL` | Who gets emailed for every quiz submission. Defaults to `reed@jbracks.com` |

Until Shopify env vars are set, "Claim My Rack" / "Add to Cart" buttons fall
back to linking at the live store instead of erroring, and `/lp-bike-racks`
shows its static fallback pricing (see below) instead of live prices.

### Live pricing on `/lp-bike-racks`

`src/lib/bikeRacks.ts` holds a static snapshot of every rack, bundle, and
add-on price — that's what renders until `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` are set. Once they are,
`src/lib/bikeRacksLive.ts` fetches live price/compare-at-price for every
variant from the Storefront API on every request (the page is opted out of
static caching via `export const dynamic = "force-dynamic"`) and overwrites
the snapshot — so a price change in Shopify shows up here with no redeploy.
If the Storefront API is unreachable, it silently falls back to the static
snapshot rather than breaking the page. Product handles, variant IDs, and
images still live in `bikeRacks.ts` (those don't change); only price and
compare-at-price come from the live API.

```bash
npm run dev
```

## Fonts

- **Gotham Pro** (body/UI) — already in `public/fonts/gotham/`, wired up in
  `src/app/globals.css` via `@font-face`, exposed as the `font-sans` token.
- **Tungsten** (headlines/display) — drop the woff/woff2 files into
  `public/fonts/tungsten/` using the names already referenced in
  `globals.css` (`Tungsten-Semibold`, `Tungsten-Bold`, `Tungsten-Black`), or
  update those paths to match whatever you're given. Headings use the
  `font-display` utility class and fall back to a bold system stack until
  the files exist, so nothing breaks in the meantime.

## Images

Product photography is either checked into `public/images/` or hotlinked
straight from Shopify's CDN (`cdn.shopify.com`, already allow-listed in
`next.config.ts`) and rendered with `next/image`. Vercel's image optimizer
re-encodes to WebP/AVIF at request time — no manual conversion pipeline
needed, just drop new originals into `public/images/` or reference a
`cdn.shopify.com` URL directly.

## Deploying

Push to a GitHub repo and import it in Vercel, or run `vercel` from this
directory. No special build config needed — it's a standard Next.js app.
Set the same environment variables from `.env.local` in the Vercel project
settings (Production + Preview).
