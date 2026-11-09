import type { RackSize } from "./bikeRacks";
import { product } from "./config";

export type BlackFridayOffer = {
  // Lowest live price across the 4/5/6-bike racks (what the offer leads with).
  price: number;
  compareAtPrice: number;
  // Biggest live saving across sizes — "Save $X" only ever quotes a real one.
  maxSavings: number;
  maxPercentOff: number;
  // True when every size is on the same price, so copy can say "all $X"
  // rather than "from $X".
  allSamePrice: boolean;
};

// Single source for every offer number on /lp-demo-black-friday, derived
// from the live Shopify rack prices — so if the Black Friday pricing changes
// in Shopify, the ticker, editor's note, offer block and chips all follow
// within the page's 5-minute ISR window instead of drifting apart.
export function getBlackFridayOffer(rackSizes: RackSize[]): BlackFridayOffer {
  if (rackSizes.length === 0) {
    const savings = product.compareAtPrice - product.price;
    return {
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      maxSavings: savings,
      maxPercentOff: Math.round((savings / product.compareAtPrice) * 100),
      allSamePrice: true,
    };
  }

  const cheapest = rackSizes.reduce((a, b) => (b.price < a.price ? b : a));
  const best = rackSizes.reduce((a, b) => (b.compareAtPrice - b.price > a.compareAtPrice - a.price ? b : a));
  const maxSavings = best.compareAtPrice - best.price;

  return {
    price: cheapest.price,
    compareAtPrice: cheapest.compareAtPrice,
    maxSavings,
    maxPercentOff: Math.round((maxSavings / best.compareAtPrice) * 100),
    allSamePrice: rackSizes.every((r) => r.price === cheapest.price),
  };
}

// "4, 5 & 6-bike racks - all $499" or, if sizes ever diverge, "from $X".
export function offerPriceLine(offer: BlackFridayOffer) {
  return offer.allSamePrice ? `4, 5 & 6-bike racks - all $${offer.price}` : `4, 5 & 6-bike racks from $${offer.price}`;
}
