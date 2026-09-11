// Content pulled directly from the live jb-racks-lp-demonstration-old page.
// Keep copy/pricing/dates here so future landing pages are mostly edits to
// this file plus swapping images.

export const storeUrl = process.env.NEXT_PUBLIC_STORE_URL ?? "https://jbracks.com";

export const site = {
  name: "JB Racks",
  storeUrl,
};

export const product = {
  name: "4 Bike Rack",
  price: 597,
  compareAtPrice: 670,
  handle: process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE ?? "4-e-bike-rack",
  productUrl: `${storeUrl}/products/4-e-bike-rack`,
  variantId: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_ID ?? "",
  saleEndsAt: process.env.NEXT_PUBLIC_SALE_ENDS_AT ?? "2026-09-30T00:00:00-07:00",
};

// Each row also carries a `video` — the best contextual match from
// /public/videos for that row's copy — used only by /lp-demonstration-videos
// (see FeatureRow's optional `video` prop). /lp-demonstration itself keeps
// rendering the static image.
export const featureRows = [
  {
    image: "/images/jb-racks_ready_in_seconds.jpg",
    video: "/videos/1_white-car-dirt-road.mp4",
    title: "Unload Fast. Ride Sooner.",
    body: "Pull into the trailhead and get your bikes off in well under a minute instead of wrestling with straps and buckles. More time on the trail, less time at the tailgate.",
    size: "medium",
  },
  {
    image: "/images/jb-racks_cheap_adventures.jpg",
    video: "/videos/5_gray-suv-mountain.mp4",
    title: "More Rides. Less Cost.",
    body: "At an estimated $2.30 per ride, the JB 4 Rack pays for itself fast. Built to last for years of adventures, it's an affordable way to get out more — without the ongoing cost of rentals or roof boxes.",
    size: "small",
  },
  {
    image: "/images/jb-racks_easy_to_attach.jpg",
    video: "/videos/2_bike-swingup-closeup.mp4",
    title: "Rubber-Gripped, Scratch-Free Hold",
    body: "Rubber straps grip the tires, not the frame, so there's minimal contact with your bike's paint and components. Less rattling against metal means less wear on the ride you actually care about.",
    size: "small",
  },
  {
    image: "/images/jb-racks_fits_almost_any_vehicle.jpg",
    video: "/videos/3_white-suv-paved-road.mp4",
    title: "Versatile Hitch Fit",
    body: "The 18″ hitch bar clears spare tires and extended trays on almost any vehicle, and fits 2″ Class III receivers — the most common hitch in the US.",
    size: "medium",
  },
  {
    image: "/images/jb-racks_park_and_ride.jpg",
    video: "/videos/6_red-truck-forest.mp4",
    title: "Arrive. Unload. Ride.",
    body: "Pull into the trailhead and unclip your bike in seconds — no wrestling with straps or buckles. Less time setting up, more time on the trail.",
    size: "small",
  },
] as const;

export const comparisonRows = [
  { label: "Loading", vertical: "Roll-on, less lifting", traditional: "Lift and position" },
  { label: "Solo Use", vertical: "One-person friendly", traditional: "Often needs help" },
  { label: "Heavy Bikes", vertical: "Weight stays lower", traditional: "Harder to lift" },
  { label: "Frame Care", vertical: "Minimal contact", traditional: "More contact points" },
  { label: "Stability", vertical: "Secure, anti-wobble hold", traditional: "Can sway and rattle" },
  { label: "Trailhead", vertical: "Unload fast, ride more", traditional: "Still wrestling with the rack" },
  { label: "Load Time", vertical: "Under 60 seconds", traditional: "3-5+ minutes of fuss" },
] as const;

export const pricingHighlights = [
  "E-bike rated — 65 lbs per wheel holder, 240 lbs total capacity",
  "4-Year warranty on every rack",
  "Free shipping to city & suburban areas",
  "Trusted by 20,000+ customers",
  "Pay in 4 with Affirm — as low as $149/mo",
];

export const testimonials = [
  {
    initials: "R",
    name: "Roger",
    title: "5 Stars!",
    quote: "Very surprised at the quality for the price and looks great. I was a little unsure about JB racks but now happy I went with it",
  },
  {
    initials: "DW",
    name: "Dale W.",
    title: "Great rack!",
    quote: "Great rack! Just took it out for the first time fully loaded, and it handled everything with ease. Shipping could've been faster, but overall it's a great value",
  },
  {
    initials: "AE",
    name: "Austin E.",
    title: "Awesome rack!",
    quote: "Awesome rack. Plenty of play in the hitch so a stabilizer is a must. Material is sturdy and feels high quality.",
  },
  {
    initials: "RB",
    name: "Rowan B.",
    title: "Very happy with the rack",
    quote: "Customer service were helpful as needed some help with build. Very happy with the rack, better than I expected. Highly recommended!",
  },
  {
    initials: "AS",
    name: "Andrew S.",
    title: "Easy to load and unload and looks great.",
    quote: "So, I def needed to get a hitch clamp for it, but other than that, it's perfect. Easy to load and unload and looks great.",
  },
  {
    initials: "HM",
    name: "Helen M.",
    title: "Highly recommended!",
    quote: "Very good for the money, our e-bikes much easier to transport now.",
  },
] as const;

export const faqs = [
  {
    question: "What size hitch do I need?",
    answer: "The 4 Bike Rack fits a 2″ Class III hitch receiver — the most common size on trucks and SUVs in the US. Check your owner's manual or reach out to our support team if you're not sure.",
  },
  {
    question: "What's the weight capacity?",
    answer: "Each wheel holder carries up to 65 lbs, with 240 lbs of total combined load capacity across the rack — enough for e-bikes and adult mountain bikes.",
  },
  {
    question: "Is shipping really free?",
    answer: "Yes — free shipping to city and suburban areas, with delivery typically in 4-7 business days. Reach out to our team for a quote if you're outside those zones.",
  },
  {
    question: "How long does assembly take?",
    answer: "Most riders finish assembly in 30-45 minutes. We provide a full assembly video and a printable fitment/build PDF to walk you through it step by step.",
  },
  {
    question: "Will it fit my bike?",
    answer: "The rack fits 21-29″ wheels and tires up to 3″ wide, covering most standard and plus-size setups. If you're running 20″ or smaller wheels, a separate wheel bracket is available.",
  },
  {
    question: "What if something's not right?",
    answer: "Every rack is backed by a 4-year warranty and our support team. If anything's off with your order, contact us and we'll sort it out.",
  },
] as const;
