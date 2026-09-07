// Editorial content for /lp-bike-racks. Layout/section order is modeled on
// a design mockup the user supplied (ticker → hero → problem → reasons →
// sizes → tested → compare → testimonials → bundle → warranty → FAQ → final
// CTA), restyled with our own type/color system. Copy is the user's, kept
// close to verbatim; anything the mockup itself flagged as an unconfirmed
// placeholder (rack weight/width/height, the finish/load/durability test
// claims) is either dropped in favor of verified specs or kept with the
// same honesty caveat the mockup used — never presented as fact we haven't
// confirmed.

export const ticker = [
  "4-YEAR WARRANTY ON EVERY RACK",
  "FREE US SHIPPING, 4-7 BUSINESS DAYS",
  "20,000+ RACKS ON THE ROAD",
  "E-BIKE RATED — 65 LBS PER WHEEL HOLDER",
];

export const hero = {
  kicker: "4, 5 & 6 BIKE VERTICAL HITCH RACK",
  headline: "Are You Struggling to Get the Right Bike Rack?",
  sub: "A hitch rack that's rated for the job - not the rack that was cheapest to stock. JB is engineered to carry 65 lbs per wheel holder before the wobble, the scratched frame, or the strap failure ever gets the chance to happen.",
  ctaPrimary: "Find your size — from $597",
  ctaSecondary: "See why it's different",
  trustStrip: [
    { value: "4-Year", label: "Warranty" },
    { value: "65 lb", label: "per wheel holder" },
    { value: "20,000+", label: "customers" },
    { value: "4-7 Day", label: "US shipping" },
  ],
};

// Masthead gallery — modeled on IM8's hero carousel: mixed slide types
// (plain image, a stats slide, a "what this replaces" grid) rather than one
// static photo. Every stat and image here is real — no fabricated experts
// or invented numbers, unlike IM8's "doctors" panel slide, which we skip.
export type HeroSlide =
  | { type: "image"; image: string; alt: string; pill?: string; badge?: { num: string; label: string }; fit?: "cover" | "contain" }
  | { type: "stats"; headline: string; stats: { value: string; label: string }[] }
  | { type: "replaces"; headline: string; items: string[] };

// Trimmed to just the two fall lifestyle shots for now — the stats/replaces/
// ambassador slides are still valid HeroSlide variants (see the type above),
// just commented out below rather than deleted, in case they come back in.
export const heroGallery: HeroSlide[] = [
  {
    type: "image",
    image: "/images/texas-fall.jpg",
    alt: "Truck with a JB Racks vertical bike rack loaded with bikes on a fall road through Texas Hill Country",
    pill: "Texas Hill Country",
  },
  {
    type: "image",
    image: "/images/virginia-fall.jpg",
    alt: "Truck with a JB Racks vertical bike rack loaded with bikes on a fall mountain road in Virginia",
    pill: "Virginia Blue Ridge",
  },
  // {
  //   type: "image",
  //   image: "https://cdn.shopify.com/s/files/1/0694/1117/6660/files/6-bike-rack-black-new-photo-1_43f5e1c9-1783-44b6-b132-7e8c47027995.webp?v=1767759172",
  //   alt: "JB Vertical Bike Rack loaded with six bikes",
  //   badge: { num: "240 lb", label: "Total combined load rating, tested fully loaded" },
  // },
  // {
  //   type: "image",
  //   image: "/images/bikeracks/whole-crew.jpg",
  //   alt: "Mom loading a JB Racks vertical rack while kids wait on their bikes",
  //   pill: "Room for the whole crew",
  // },
  // {
  //   type: "stats",
  //   headline: "TRUSTED ON THE TRAIL",
  //   stats: [
  //     { value: "4.7/5", label: "Average rating" },
  //     { value: "144", label: "Verified reviews" },
  //     { value: "94%", label: "Would recommend" },
  //     { value: "20,000+", label: "Customers" },
  //   ],
  // },
  // {
  //   type: "replaces",
  //   headline: "ONE RACK REPLACES",
  //   items: ["Roof rack rattle", "Platform rack sway", "Bike shop rentals", "A second trip for straps"],
  // },
  // {
  //   type: "image",
  //   image: "/images/bikeracks/ambassadors.jpg",
  //   alt: "Mike Guy and Adam Miller, mountain biking influencers, actively supported by riders",
  //   pill: "Backed by real riders",
  //   fit: "contain",
  // },
];

export const problem = {
  headline: "Your hitch works. Here's what it doesn't do.",
  lede: "A 2\" receiver will hold almost anything you bolt to it. It won't tell you whether what's bolted to it was actually designed for a 65-lb e-bike, or for the 35-lb road bike racks were built around a decade ago.",
  items: [
    { mark: "01", title: "Weight ratings that predate e-bikes", body: "A lot of racks on the market were designed before e-bikes were common, and it shows the first time you load one on." },
    { mark: "02", title: "Sway you feel through the whole cabin", body: "Without something locking the rack to the hitch itself, every pothole becomes a rattle you can hear from the driver's seat." },
    { mark: "03", title: "Frame contact where straps should be", body: "Hard plastic cradles and bare metal hooks are how a $3,000 frame ends up with a $30 problem." },
    { mark: "04", title: "A price that's paying for a badge, not steel", body: "Plenty of the premium-looking racks add a few hundred dollars for a name — not for anything that changes how securely your bikes travel." },
  ],
};

export const reasonsEyebrow = "WHY FAMILIES ARE SWITCHING";
export const reasonsHeadline = "5 reasons riders are moving to the JB Vertical Rack before their old one lets them down";

// Same 5 image+copy pairs as the feature rows on /lp-demonstration
// (src/lib/config.ts featureRows) — reused verbatim here, just numbered and
// restyled to match this page's reason-block design.
export const reasons = [
  {
    number: "01",
    title: "Unload Fast. Ride Sooner.",
    body: "Pull into the trailhead and get your bikes off in well under a minute instead of wrestling with straps and buckles. More time on the trail, less time at the tailgate.",
    image: "/images/jb-racks_ready_in_seconds.jpg",
  },
  {
    number: "02",
    title: "More Rides. Less Cost.",
    body: "At an estimated $2.30 per ride, the JB 4 Rack pays for itself fast. Built to last for years of adventures, it's an affordable way to get out more — without the ongoing cost of rentals or roof boxes.",
    image: "/images/jb-racks_cheap_adventures.jpg",
  },
  {
    number: "03",
    title: "Rubber-Gripped, Scratch-Free Hold",
    body: "Rubber straps grip the tires, not the frame, so there's minimal contact with your bike's paint and components. Less rattling against metal means less wear on the ride you actually care about.",
    image: "/images/jb-racks_easy_to_attach.jpg",
  },
  {
    number: "04",
    title: "Versatile Hitch Fit",
    body: "The 18\" hitch bar clears spare tires and extended trays on almost any vehicle, and fits 2\" (50mm) Class III receivers — the most common hitch in the US.",
    image: "/images/jb-racks_fits_almost_any_vehicle.jpg",
  },
  {
    number: "05",
    title: "Arrive. Unload. Ride.",
    body: "Pull into the trailhead and unclip your bike in seconds — no wrestling with straps or buckles. Less time setting up, more time on the trail.",
    image: "/images/jb-racks_park_and_ride.jpg",
  },
];

export const sizesNote =
  "All sizes fit a 2\" Class III hitch receiver and 21-29\" wheels up to 3\" wide.";

export const tested = {
  eyebrow: "ENGINEERED & TESTED",
  headline: "Built to a standard, not just a budget",
  cells: [
    { label: "MATERIAL", title: "ASTM A36-comparable structural steel", body: "Selected for strength, consistency, and suitability for structural load-bearing applications." },
    { label: "FINISH", title: "Powder-coated corrosion resistance", body: "Target: 500-hour salt-spray exposure per ASTM B117 with no visible substrate corrosion." },
    { label: "LOAD", title: "240 lb combined capacity, verified fully loaded", body: "Target: static load test at rated capacity plus a safety margin before sign-off." },
    { label: "DURABILITY", title: "Highway vibration simulation", body: "Target: simulated highway-mile vibration cycle with no hardware loosening." },
  ],
  footnote:
    "The finish, load, and durability claims above are internal test targets, not yet independently verified — treat as directional until confirmed test data replaces them.",
};

export const compare = {
  eyebrow: "HOW IT STACKS UP",
  headline: "Everything the $900 racks do. For under $670.",
  columns: ["Feature", "JB Vertical Rack", "Typical $900 rack"],
  rows: [
    { feature: "Roll-in loading, 3 angles", jb: true, other: true },
    { feature: "Lightweight design", jb: true, other: false },
    { feature: "Pedal tie-down straps included", jb: true, other: false },
    { feature: "Adjustable bar for smaller bikes", jb: true, other: false },
    { feature: "Optional slow-fold strut", jb: true, other: false },
    { feature: "Free shipping", jb: true, other: true },
  ],
  callout: "Keep $300-$400 in your pocket — based on a selection of comparable hitch racks currently on the market.",
};

export const testimonialsEyebrow = "20,000+ CUSTOMERS";
export const testimonialsHeadline = "What riders say after it's loaded up and out the driveway";

export const videoQuote = {
  avatar: "/images/bikeracks/mtb-rad-dad-avatar.webp",
  quote: "I really like this rack, it's my go to rack when I have family outings!",
  name: "Adam Miller",
  role: "MTB Rad Dad",
};

export const bundle = {
  eyebrow: "BUNDLE & SAVE",
  headline: "Most 5-bike and 6-bike orders add the stand and strut",
  body: "A garage stand makes storing a fully-built rack painless, and the slow-fold strut turns lifting a loaded rack into a one-hand job.",
  barLabel: "Frequently bundled with 5 & 6 bike racks",
};

export const warranty = {
  headline: "4-Year Warranty",
  body: "At JB Racks, we take pride in the research and engineering that go into every hitch rack. We demand the very best — top-quality racks with structural integrity — so we know that each rack is built to take a beating. Our four-year guarantee will give you peace of mind, knowing you can trust JB Racks to take this worry off your shoulders.",
};

export const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Free shipping typically takes 4-7 business days depending on your location. Shipping is free in major metro areas — contact support for a quote outside those zones.",
  },
  {
    question: "Will this fit a car with a spare wheel on the back?",
    answer: "Yes — the 18\" hitch bar is designed to clear spare tires and extended trays. We recommend pairing it with an anti-wobble mechanism and a 5/8\" pin for a properly secured fit.",
  },
  {
    question: "What's the rack actually made from?",
    answer: "Structural steel with mechanical properties comparable to ASTM A36, finished with a durable powder coat for protection against wear, abrasion, and corrosion in everyday use.",
  },
  {
    question: "Do I need any tools I don't already have?",
    answer: "Assembly takes about 30-45 minutes with basic hand tools. A full video walkthrough and printable fitment guide are included for every size.",
  },
  {
    question: "What if something's not right?",
    answer: "Every rack is backed by a 4-year warranty and our support team. If anything's off with your order, contact us and we'll sort it out.",
  },
];

export const finalCta = {
  headline: "Don't wait for the rack you have now to prove the point.",
  body: "Pick your size, lock in free shipping, and get a rack that was actually built for what you're hauling — backed by a four-year warranty.",
  cta: "Find your size — from $597",
};

export const stickyCta = {
  text: "20,000+ riders already switched",
  cta: "Build My Rack",
};
