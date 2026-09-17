// Cookie-based, database-free split testing. A visitor's variant is decided
// once (weighted random, in proxy.ts) and pinned in a cookie so every
// later visit — and every event that visit fires — serves/reports the same
// variant. See docs/split-testing.md for how results get into GA4 and how
// to add a new test.

export type SplitTestVariant = {
  // Shown in GA4 events and stored as the cookie value — keep it short and
  // stable once a test is live. Renaming a live variant's id effectively
  // starts a fresh bucket for it (anyone already assigned the old id keeps
  // seeing the old id's path, since it's no longer in this list to match).
  id: string;
  // The real route this variant's traffic gets served, via an internal
  // rewrite — the visitor's URL bar always stays on the test's sourcePath.
  path: string;
  // Relative weight, not a percentage — { 1, 1, 1 } is an even three-way
  // split; { 2, 1, 1 } sends half the traffic to the first variant. Set a
  // variant's weight to 0 to stop assigning *new* visitors to it without
  // pulling anyone already bucketed into it out mid-test.
  weight: number;
};

export type SplitTest = {
  // Cookie is named `ab_<id>` — keep this stable once live, same reason as
  // variant id above.
  id: string;
  // The public URL this test runs on. Next.js needs proxy.ts's matcher
  // paths written statically, so adding a test means adding this path to
  // the matcher array in proxy.ts too — see docs/split-testing.md.
  sourcePath: string;
  // Flip to false to pause the whole test — every visitor gets the first
  // variant (by convention, "control") and no bucketing cookie is set,
  // without deleting the config.
  enabled: boolean;
  variants: SplitTestVariant[];
};

export const splitTests: SplitTest[] = [
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
];

/** Weighted-random pick among variants with weight > 0 (falls back to the
 * full list if every weight is 0, so a misconfigured test never 500s). */
export function pickWeightedVariant(variants: SplitTestVariant[]): SplitTestVariant {
  const eligible = variants.filter((v) => v.weight > 0);
  const pool = eligible.length > 0 ? eligible : variants;
  const total = pool.reduce((sum, v) => sum + v.weight, 0);
  if (total <= 0) return pool[0];
  let roll = Math.random() * total;
  for (const variant of pool) {
    if (roll < variant.weight) return variant;
    roll -= variant.weight;
  }
  return pool[pool.length - 1];
}
