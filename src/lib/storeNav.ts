import { storeUrl } from "./config";

// Generic store nav for /lp-demo-black-friday's header (StoreNavHeader),
// mirroring the items in the jbracks.com theme's "Story Rings" bar, in the
// same order — relative theme paths are resolved against storeUrl so every
// link goes back to the real store. The theme's "Pay Over Time" item is
// left out (it has no URL there either), and "Road Test" is a YouTube
// video in the theme, so here it links to the video itself.
export type StoreNavItem = {
  id: string;
  label: string;
  href: string;
  badge?: { text: string; tone: "orange" | "black" | "green" };
  // Pulsing dot, like the theme's "live" ring.
  live?: boolean;
  external?: boolean;
};

const store = (path: string) => `${storeUrl}${path}`;

export const storeNavItems: StoreNavItem[] = [
  { id: "sale", label: "Black Friday", href: store("/products/4-e-bike-rack"), badge: { text: "Live", tone: "orange" }, live: true },
  { id: "racks", label: "Vertical Racks", href: store("/collections/e-bike-racks") },
  { id: "bundles", label: "Bundles", href: store("/collections/bike-rack-bundles") },
  { id: "weekender", label: "Weekender 4", href: store("/products/weekender-4"), badge: { text: "New", tone: "black" } },
  { id: "fit", label: "Hitch Check", href: store("/pages/unsure-if-our-rack-fits-your-vehicle"), badge: { text: "30 sec", tone: "green" } },
  { id: "quiz", label: "Which Rack?", href: "https://go.jbracks.com/lp-quiz" },
  { id: "stand", label: "Garage Stand", href: store("/products/garage-stand") },
  { id: "acc", label: "Accessories", href: store("/collections/accessories") },
  { id: "test", label: "Road Test", href: "https://www.youtube.com/watch?v=R-spd-yh_XM", badge: { text: "62 mph", tone: "black" }, external: true },
  { id: "reviews", label: "Real Riders", href: store("/pages/reviews") },
  { id: "build", label: "Build Guide", href: store("/pages/build") },
];

// Items past this many go under the "Explore" dropdown on desktop.
export const STORE_NAV_INLINE_COUNT = 6;
