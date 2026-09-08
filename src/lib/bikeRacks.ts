// Real product, pricing, and variant data pulled from jbracks.com's public
// Storefront JSON endpoints (/products/<handle>.json) — not invented. Variant
// IDs are numeric Shopify IDs; toVariantGid() converts them for the
// Storefront GraphQL API used in lib/shopify.ts.
//
// The price/compareAtPrice fields below are a fallback snapshot only — once
// NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN/TOKEN are set, getLiveBikeRackData() in
// bikeRacksLive.ts overwrites them with live values fetched from Shopify, so
// this file never needs manual repricing.

export function toVariantGid(id: number): string {
  return `gid://shopify/ProductVariant/${id}`;
}

export type Color = "Black" | "Velo Turquoise" | "Leaf Green";

export const colors: { name: Color; hex: string }[] = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "Velo Turquoise", hex: "#2ec4c6" },
  { name: "Leaf Green", hex: "#5a8f3c" },
];

export type RackSize = {
  bikes: 4 | 5 | 6;
  label: string;
  sublabel: string;
  badge?: string;
  handle: string;
  price: number;
  compareAtPrice: number;
  imagesByColor: Record<Color, string[]>;
  // Stand-only bundle (rack + Garage Stand)
  standBundle: { handle: string; price: number; compareAtPrice: number; variants: Record<Color, number> };
  // Full bundle (rack + Garage Stand + Slow-Fold Strut)
  fullBundle: { handle: string; price: number; compareAtPrice: number; variants: Record<Color, number> };
  variants: Record<Color, number>;
};

const CDN = "https://cdn.shopify.com/s/files/1/0694/1117/6660/files";

// Shared "benefit" lifestyle photos — not tied to any specific color, so on
// the real product page Shopify appends the same set to the end of every
// variant's gallery (they carry empty variant_ids). Same 6 images/URLs
// across all three sizes.
const benefitImages = [
  `${CDN}/jb-racks_ready_in_seconds.webp?v=1784529004`,
  `${CDN}/jb-racks_park_and_ride.webp?v=1784528949`,
  `${CDN}/jb-racks_cheap_adventures.webp?v=1784528956`,
  `${CDN}/jb-racks_fits_almost_any_vehicle.webp?v=1784528995`,
  `${CDN}/jb-racks_easy_to_attach.webp?v=1784529021`,
  `${CDN}/jb-racks_take_the_whole_crew.webp?v=1784528980`,
];

export const rackSizes: RackSize[] = [
  {
    bikes: 4,
    label: "4 Bikes",
    sublabel: "Small families",
    handle: "4-e-bike-rack",
    price: 597,
    compareAtPrice: 670,
    imagesByColor: {
      Black: [
        `${CDN}/4-bike-rack-black-new-photo-1-1.webp?v=1781659158`,
        `${CDN}/4-bike-rack-black-new-photo-1.png?v=1772585640`,
        `${CDN}/4-bike-rack-black-new-photo-2.png?v=1773111793`,
        `${CDN}/4-bike-rack-black-new-photo-3.png?v=1773111793`,
        `${CDN}/4-bike-rack-black-new-photo-5.png?v=1773111793`,
        `${CDN}/4-bike-rack-black-new-photo-4.png?v=1773111793`,
        ...benefitImages,
      ],
      "Velo Turquoise": [
        `${CDN}/4-velo-black-plate.webp?v=1773111793`,
        `${CDN}/4-bike-rack-velo-new-photo-2.png?v=1773111793`,
        `${CDN}/4-bike-rack-velo-new-photo-3.png?v=1773111793`,
        `${CDN}/4-bike-rack-velo-new-photo-4.png?v=1773111793`,
        `${CDN}/4-bike-rack-velo-new-photo-5.png?v=1773111793`,
        ...benefitImages,
      ],
      "Leaf Green": [
        `${CDN}/4-bike-leaf-green-velo-straps-black-top-plate.webp?v=1774311053`,
        `${CDN}/4-bike-leaf-green-3.webp?v=1774311053`,
        `${CDN}/4-bike-leaf-green-2.webp?v=1774311053`,
        `${CDN}/4-bike-leaf-green-5.webp?v=1774311053`,
        `${CDN}/4-bike-leaf-green-4.webp?v=1774311053`,
        ...benefitImages,
      ],
    },
    variants: { Black: 46385606951124, "Velo Turquoise": 46381230784724, "Leaf Green": 47193324028116 },
    standBundle: {
      handle: "4-bike-rack-stand-bundle",
      price: 750,
      compareAtPrice: 870,
      variants: { Black: 48572292694228, "Velo Turquoise": 48572292726996, "Leaf Green": 48572292759764 },
    },
    fullBundle: {
      handle: "4-e-bike-rack-stand-strut-bundle",
      price: 820,
      compareAtPrice: 1020,
      variants: { Black: 46431055544532, "Velo Turquoise": 46431055642836, "Leaf Green": 47201059045588 },
    },
  },
  {
    bikes: 5,
    label: "5 Bikes",
    sublabel: "Room to grow",
    badge: "Most Popular",
    handle: "5-e-bike-rack",
    price: 617,
    compareAtPrice: 670,
    imagesByColor: {
      Black: [
        `${CDN}/5-bike-rack-black-new-photo-1_2de2334d-a7a1-4113-9225-3adcaf9e4bd6.webp?v=1772584840`,
        `${CDN}/5-bike-rack-black-new-photo-1.png?v=1772586819`,
        `${CDN}/5-bike-rack-black-new-photo-3.png?v=1772586819`,
        `${CDN}/5-bike-rack-black-new-photo-2.png?v=1772586819`,
        `${CDN}/5-bike-rack-black-new-photo-5.png?v=1772586819`,
        `${CDN}/5-bike-rack-black-new-photo-4.png?v=1772586819`,
        ...benefitImages,
      ],
      "Velo Turquoise": [
        `${CDN}/5-velo-black-plate_87296b08-1358-4e38-a88c-80a4137b5ddf.webp?v=1772586819`,
        `${CDN}/5-bike-rack-velo-new-photo-2.png?v=1772586819`,
        `${CDN}/5-bike-rack-velo-new-photo-3.png?v=1772586819`,
        `${CDN}/5-bike-rack-velo-new-photo-4.png?v=1772586819`,
        `${CDN}/5-bike-rack-velo-new-photo-5.png?v=1772586819`,
        ...benefitImages,
      ],
      "Leaf Green": [
        `${CDN}/5-bike-leaf-green-velo-straps-black-top-plate.webp?v=1774311079`,
        `${CDN}/5-bike-leaf-green-2.webp?v=1774311079`,
        `${CDN}/5-bike-leaf-green-3.webp?v=1774311079`,
        `${CDN}/5-bike-leaf-green-5.webp?v=1774311079`,
        `${CDN}/5-bike-leaf-green-4.webp?v=1774311079`,
        ...benefitImages,
      ],
    },
    variants: { Black: 46501061165268, "Velo Turquoise": 46501061198036, "Leaf Green": 47193331794132 },
    standBundle: {
      handle: "5-bike-rack-stand-bundle",
      price: 750,
      compareAtPrice: 870,
      variants: { Black: 48572293152980, "Velo Turquoise": 48572293185748, "Leaf Green": 48572293218516 },
    },
    fullBundle: {
      handle: "5-e-bike-rack-stand-strut-bundle",
      price: 820,
      compareAtPrice: 1020,
      variants: { Black: 46431089754324, "Velo Turquoise": 46431089852628, "Leaf Green": 47201059209428 },
    },
  },
  {
    bikes: 6,
    label: "6 Bikes",
    sublabel: "The whole crew",
    handle: "6-e-bike-rack",
    price: 637,
    compareAtPrice: 670,
    imagesByColor: {
      Black: [
        `${CDN}/6-bike-rack-black-new-photo-1_43f5e1c9-1783-44b6-b132-7e8c47027995.webp?v=1767759172`,
        `${CDN}/6-bike-rack-black-new-photo-1a.png?v=1767759172`,
        `${CDN}/6-bike-rack-black-new-photo-2.png?v=1772584719`,
        `${CDN}/6-bike-rack-black-new-photo-3.png?v=1772584719`,
        `${CDN}/6-bike-rack-black-new-photo-4.png?v=1772584719`,
        `${CDN}/6-bike-rack-black-new-photo-5.png?v=1772584719`,
        ...benefitImages,
      ],
      "Velo Turquoise": [
        `${CDN}/6-velo-black-plate.webp?v=1772584719`,
        `${CDN}/6-bike-rack-velo-new-photo-2.png?v=1772584719`,
        `${CDN}/6-bike-rack-velo-new-photo-3.png?v=1772584719`,
        `${CDN}/6-bike-rack-velo-new-photo-4.png?v=1772584719`,
        `${CDN}/6-bike-rack-velo-new-photo-5.png?v=1772584719`,
        ...benefitImages,
      ],
      "Leaf Green": [
        `${CDN}/6-bike-leaf-green-velo-strap-black-top-plate.webp?v=1774311111`,
        `${CDN}/6-bike-leaf-green-2.webp?v=1774311111`,
        `${CDN}/6-bike-leaf-green-3.webp?v=1774311111`,
        `${CDN}/6-bike-leaf-green-4.webp?v=1774311111`,
        `${CDN}/6-bike-leaf-green-5.webp?v=1774311111`,
        ...benefitImages,
      ],
    },
    variants: { Black: 46215035060436, "Velo Turquoise": 46215035158740, "Leaf Green": 47193364529364 },
    standBundle: {
      handle: "6-bike-rack-stand-bundle",
      price: 750,
      compareAtPrice: 870,
      variants: { Black: 48572293284052, "Velo Turquoise": 48572293316820, "Leaf Green": 48572293349588 },
    },
    fullBundle: {
      handle: "6-e-bike-rack-stand-strut-bundle",
      price: 820,
      compareAtPrice: 1020,
      variants: { Black: 46431122489556, "Velo Turquoise": 46431122587860, "Leaf Green": 47201059504340 },
    },
  },
];

export type Addons = typeof addons;

export const addons = {
  garageStand: {
    name: "Garage Stand",
    note: "Stores your rack off the car when it's not in use",
    price: 180,
    compareAtPrice: 200,
    variantId: 44696448663764,
    image: `${CDN}/shed-stand-5_fbc742db-77dd-4964-bd34-aaae51055bb2.webp?v=1773812428`,
  },
  slowFoldStrut: {
    name: "Slow-Fold Strut",
    note: "Gas-assisted, controlled fold — no more bumper slams",
    price: 150,
    variantId: 47310216429780,
    image: `${CDN}/twin-fold-strut-featured.webp?v=1766116334`,
  },
  swingArm: {
    name: "Swing Arm",
    note: "Full boot/trunk access without unloading a single bike",
    price: 360,
    variantId: 46723928850644,
    image: `${CDN}/swing-arm-jb-racks.webp?v=1764917111`,
  },
};

// Real aggregate review data for the 4 Bike Rack (Okendo widget, from the
// live product page's embedded config — not estimated).
export const reviewStats = {
  average: 4.7,
  count: 144,
  fiveStarCount: 104,
  percentRecommended: 94,
};

// Real customer quotes, sourced from jbracks.com's own marketing pages.
export const reviews = [
  { name: "Roger", quote: "Very surprised at the quality for the price and looks great. I was a little unsure about JB racks but now happy I went with it." },
  { name: "Dale W.", quote: "Great rack! Just took it out for the first time fully loaded, and it handled everything with ease." },
  { name: "Austin E.", quote: "Awesome rack. Plenty of play in the hitch so a stabilizer is a must. Material is sturdy and feels high quality." },
  { name: "Rowan B.", quote: "Very happy with the rack, better than I expected. Customer service were helpful as needed some help with build." },
  { name: "Andrew S.", quote: "Easy to load and unload and looks great. So, I def needed to get a hitch clamp for it, but other than that, it's perfect." },
  { name: "Helen M.", quote: "Very good for the money, our e-bikes much easier to transport now." },
];

export const faqs = [
  {
    question: "What size hitch do I need?",
    answer: "A 2\" (50mm) Class III hitch receiver — the most common size on trucks and SUVs in the US. The 18\" hitch bar clears rear-mounted spare wheels.",
  },
  {
    question: "What's the weight capacity?",
    answer: "Each wheel holder carries up to 65 lbs, with 240 lbs of total combined capacity — rated for e-bikes.",
  },
  {
    question: "Will it fit my bike?",
    answer: "Fits 21-29\" wheels and tires up to 3\" wide, covering most standard and plus-size setups.",
  },
  {
    question: "Is shipping really free?",
    answer: "Yes — free shipping to city and suburban areas, with delivery typically in 4-7 business days.",
  },
  {
    question: "How long does assembly take?",
    answer: "Most riders finish in 30-45 minutes. We provide a full assembly video to walk you through it.",
  },
  {
    question: "What if something's not right?",
    answer: "Every rack is backed by a 4-year warranty and our support team — contact us and we'll sort it out.",
  },
];
