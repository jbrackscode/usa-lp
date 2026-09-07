// Server-only: fetches live price/compare-at-price for every rack, bundle,
// and add-on variant from the Shopify Storefront API and merges it over the
// static fallback data in bikeRacks.ts. Falls back to the static snapshot
// whenever Shopify isn't configured yet or the request fails, so the page
// never breaks for lack of credentials.

import { rackSizes as staticRackSizes, addons as staticAddons, type RackSize, type Addons } from "./bikeRacks";
import { getVariantPrices, isShopifyConfigured, type LiveVariantPrice } from "./shopify";

function pricedFields(
  live: Map<number, LiveVariantPrice>,
  variantId: number,
  fallbackPrice: number,
  fallbackCompareAtPrice: number
): { price: number; compareAtPrice: number } {
  const match = live.get(variantId);
  return {
    price: match?.price ?? fallbackPrice,
    compareAtPrice: match?.compareAtPrice ?? fallbackCompareAtPrice,
  };
}

function pricedPriceOnly(live: Map<number, LiveVariantPrice>, variantId: number, fallbackPrice: number): number {
  return live.get(variantId)?.price ?? fallbackPrice;
}

export async function getLiveBikeRackData(): Promise<{ rackSizes: RackSize[]; addons: Addons }> {
  if (!isShopifyConfigured) {
    return { rackSizes: staticRackSizes, addons: staticAddons };
  }

  const variantIds = [
    ...staticRackSizes.flatMap((s) => [
      ...Object.values(s.variants),
      ...Object.values(s.standBundle.variants),
      ...Object.values(s.fullBundle.variants),
    ]),
    ...Object.values(staticAddons).map((a) => a.variantId),
  ];

  let live: Map<number, LiveVariantPrice>;
  try {
    live = await getVariantPrices(variantIds);
  } catch {
    // Shopify unreachable/misconfigured — keep showing the static snapshot.
    return { rackSizes: staticRackSizes, addons: staticAddons };
  }

  // All three colors share one price per product on the live store, so the
  // Black variant's price represents the whole size/bundle.
  const rackSizes: RackSize[] = staticRackSizes.map((s) => ({
    ...s,
    ...pricedFields(live, s.variants.Black, s.price, s.compareAtPrice),
    standBundle: {
      ...s.standBundle,
      ...pricedFields(live, s.standBundle.variants.Black, s.standBundle.price, s.standBundle.compareAtPrice),
    },
    fullBundle: {
      ...s.fullBundle,
      ...pricedFields(live, s.fullBundle.variants.Black, s.fullBundle.price, s.fullBundle.compareAtPrice),
    },
  }));

  const addons: Addons = {
    garageStand: {
      ...staticAddons.garageStand,
      ...pricedFields(live, staticAddons.garageStand.variantId, staticAddons.garageStand.price, staticAddons.garageStand.compareAtPrice),
    },
    slowFoldStrut: {
      ...staticAddons.slowFoldStrut,
      price: pricedPriceOnly(live, staticAddons.slowFoldStrut.variantId, staticAddons.slowFoldStrut.price),
    },
    swingArm: {
      ...staticAddons.swingArm,
      price: pricedPriceOnly(live, staticAddons.swingArm.variantId, staticAddons.swingArm.price),
    },
  };

  return { rackSizes, addons };
}
