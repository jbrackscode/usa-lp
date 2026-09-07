// Content pulled directly from the live jb-racks-lp-newsroom page (an
// editorial/advertorial-style layout, distinct from the demonstration LP).

import { storeUrl } from "./config";

export const dealsUrl = `${storeUrl}/collections/vertical-bike-racks`;

export type Reason = {
  number: string;
  kicker: string;
  image: string;
  imageAlt: string;
  heading: string;
  paragraphs: string[];
  stat?: { headline: string; detail: string };
  pills: string[];
  flip?: boolean;
};

export const reasons: Reason[] = [
  {
    number: "1.",
    kicker: "No more platform rack chaos - load in seconds",
    image: "/images/newsroom/reason-1.jpg",
    imageAlt: "JB Racks 4 bike vertical rack loaded with bikes",
    heading: "Your whole family's bikes loaded in under 60 seconds",
    paragraphs: [
      "With a platform rack, you're lifting bikes up and over, threading them through arms, adjusting frame clamps. With a vertical rack, you simply roll each bike up and clip the front wheel in - one motion, done.",
      "JB Racks holds your bikes by the front wheel in a vertical position, meaning they load faster, take up less width behind your car, and stay completely secure at highway speeds.",
    ],
    stat: { headline: "4–6 bikes loaded", detail: "In the time it takes a platform rack to load two" },
    pills: ["Front wheel holder", "No frame contact", "Vertical = compact"],
  },
  {
    number: "2.",
    kicker: "The Swing Arm - access your boot without unloading a single bike",
    image: "/images/newsroom/reason-2.jpg",
    imageAlt: "JB Racks Swing Arm pivoting away from vehicle",
    heading: "One pull and the whole rack swings clear of your boot",
    paragraphs: [
      "Every parent knows this moment: you're at the trailhead, bikes are on, and someone left their shoes, helmet or snacks in the boot. With a standard rack - vertical or platform - you're unloading to get in.",
      "The JB Racks Swing Arm fixes this permanently. Pull the release, and the entire loaded rack pivots 90 degrees, giving you full boot access without touching a single bike.",
      "It's the accessory most families don't know they need until they have it. Then they can't imagine going back.",
    ],
    stat: { headline: "JB Swing Arm - $360", detail: "Full boot access with all bikes loaded. Fits all JB Racks models." },
    pills: ["90° pivot", "One-pull release", "Boot access in seconds"],
    flip: true,
  },
  {
    number: "3.",
    kicker: "The Slow-Fold Strut - no more rack smashing your bumper",
    image: "/images/newsroom/reason-3.jpg",
    imageAlt: "JB Racks slow-fold strut detail",
    heading: "The rack folds down gently - every single time",
    paragraphs: [
      "If you've ever owned a rack that drops hard when folded, you know the anxiety: the sudden clang, the paint scratch risk, the kids jumping back. JB Racks' Slow-Fold Strut changes this entirely.",
      "Gas-assisted struts slow the fold-down to a controlled, smooth motion. The rack eases down, not crashes down - the kind of detail that shows a product built with families in mind.",
      "The Slow-Fold Strut is included in all JB Racks bundles - no extra cost when you buy the rack, strut and shed stand together.",
    ],
    stat: { headline: "Included in all bundles", detail: "Rack + Slow-Fold Strut + Shed Stand from $1,499" },
    pills: ["Gas-assisted", "Controlled fold"],
  },
  {
    number: "4.",
    kicker: "E-bike rated - carry any bike your family owns",
    image: "/images/newsroom/reason-4.jpg",
    imageAlt: "JB Racks loaded with various bike types including e-bikes",
    heading: "110kg capacity. Heavy e-bikes? Not a problem.",
    paragraphs: [
      "As families upgrade to e-bikes, most older racks become useless. A typical adult e-bike weighs 22–28kg - put four on a platform rack and you're well over the limit and dealing with a wobbling, stressed hitch.",
      "JB Racks is rated to 110kg total, designed and tested specifically for heavy e-bikes from day one. Mountain bikes, kids' bikes, fat bikes, e-bikes - it handles the full family quiver without drama.",
    ],
    stat: { headline: "110kg total capacity", detail: "Tested for the heaviest e-bikes on Australian trails" },
    pills: ["E-bike rated", "110kg capacity", "All bike types", "Load & vibration tested"],
    flip: true,
  },
  {
    number: "5.",
    kicker: "Compact behind the car - no width creep, no carpark anxiety",
    image: "/images/newsroom/reason-5.jpg",
    imageAlt: "JB Racks showing compact width behind vehicle",
    heading: "Platform racks get wide. Vertical racks stay narrow.",
    paragraphs: [
      "Platform racks fan bikes out sideways. Load four bikes and you're suddenly a wide load - squeezing through drive-throughs, reversing into tight spots, negotiating car parks all become stressful.",
      "Vertical racks keep bikes stacked in a tight row behind the vehicle. The footprint is narrower, visibility is better, and reversing gets a lot easier.",
      "For families doing trail runs at busy car parks, this is genuinely a difference-maker.",
    ],
    pills: ["Narrow footprint", "Better rear visibility", "Tight car parks - no drama"],
  },
  {
    number: "6.",
    kicker: "4-year warranty & direct-from-manufacturer pricing",
    image: "/images/newsroom/reason-6.jpg",
    imageAlt: "JB Racks quality construction detail",
    heading: "Built to last - and backed to prove it",
    paragraphs: [
      "JB Racks sells direct, cutting out distributors and retail mark-ups. That's why a rack this well-built costs what it does - no paying for shelf space at a bike shop.",
      "The steel construction is load and vibration tested before release. The 4-year warranty isn't fine print - it's a genuine statement of confidence in the build.",
      "20,000+ customers and counting - a track record, not a new brand hoping for the best.",
    ],
    stat: { headline: "20,000+ customers", detail: "4-year warranty · Direct-to-you pricing · Free shipping*" },
    pills: ["4-year warranty", "Direct pricing", "Free shipping*", "Secure checkout"],
    flip: true,
  },
  {
    number: "7.",
    kicker: "Family sizes for every family - 4, 5 or 6 bikes, RRP $950",
    image: "/images/newsroom/reason-7.jpg",
    imageAlt: "JB Racks family of bikes loaded on rack at trailhead",
    heading: "One rack for the whole crew - kids' bikes included",
    paragraphs: [
      "JB Racks comes in 4, 5 and 6-bike configurations, all at RRP $950. With optional 16–20 inch wheel brackets, even the smallest family member's bike fits perfectly.",
      "The rack, strut and shed stand bundle currently saves $300 off individual pricing - the rack, the slow-fold strut, and a shed storage stand to keep the rack when it's not on the car.",
    ],
    stat: { headline: "Bundle from $1,499", detail: "Rack + Slow-Fold Strut + Shed Stand - everything included" },
    pills: ["4, 5 or 6 bikes", "Kids' bikes fit too"],
  },
];

export const reviews = [
  {
    quote:
      "Very surprised at the quality for the price. I was a little unsure about JB Racks but now I'm so happy I went with it. Three kids' bikes load in under a minute.",
    author: "Roger D.",
  },
  {
    quote:
      "Great rack! Just took it out for the first time fully loaded and it handled everything with ease. Our e-bikes sit perfectly - so much better than our old platform rack.",
    author: "Dale W.",
  },
  {
    quote:
      "Very good for the money - our e-bikes are so much easier to transport now. The swing arm is a game-changer, I can grab things from the boot without unloading anything.",
    author: "Helen M.",
  },
  {
    quote:
      "Very happy with the rack, better than I expected. Customer service helped me get the build right. Loading all four family bikes takes less than 2 minutes. Highly recommended!",
    author: "Rowan B.",
  },
  {
    quote:
      "Easy to load and unload and looks great. The slow-fold strut is such a good addition - no more worrying about the rack dropping onto the bumper.",
    author: "Andrew S.",
  },
  {
    quote:
      "Awesome rack. Material is sturdy and feels high quality. We've done four road trips with it since it arrived. Couldn't be happier - this thing doesn't move at all at highway speeds.",
    author: "Austin E.",
  },
] as const;

export const photoStrip = [
  "/images/newsroom/ugc-1.jpg",
  "/images/newsroom/ugc-2.jpg",
  "/images/newsroom/ugc-3.jpg",
  "/images/newsroom/ugc-4.jpg",
  "/images/newsroom/ugc-5.jpg",
  "/images/newsroom/ugc-6.jpg",
  "/images/newsroom/ugc-7.jpg",
  "/images/newsroom/ugc-8.jpg",
  "/images/newsroom/ugc-9.jpg",
];
