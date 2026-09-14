// Step definitions for the custom quiz funnel on /lp-quiz (QuizFunnel.tsx).
// Branching is driven entirely by `next` on each button, so the component
// stays generic — this file is the only place that needs to change if the
// question flow changes.
//
// Every choice step can also carry real, factual content (checklist / facts
// / note) rendered above its buttons — this is what lets the quiz actually
// answer the shopper's real barrier (can I fit this? does my bike fit?
// how does this compare?) instead of just routing them toward the product
// page. Specs quoted here match the live PDP/FAQ copy in lib/config.ts —
// keep the two in sync if the real specs ever change.

export type ChoiceButton = {
  label: string;
  next: number;
  variant?: "default" | "other";
  // Only set on the bike-count step — lets the recommendation at the
  // Mystery Deal step map straight to a real 4/5/6-bike SKU instead of
  // guessing from unrelated earlier answers.
  bikeCount?: 4 | 5 | 6;
  // Set on the fold/storage questions — surfaces the Slow-Fold Strut and
  // Garage Stand add-ons in the recommendation when relevant.
  wantsStrut?: boolean;
  wantsStand?: boolean;
  // When true, `next` is ignored and the funnel instead routes to whichever
  // bike-detail follow-up (kids wheel size / fat-tire width / e-bike
  // weight) is still outstanding for this shopper's inventory, falling
  // through to the fold-preference question once none are left. Only used
  // by steps in that chain (10, 18, 19, 20, 21) — see resolveBikeDetailChain
  // in QuizFunnel.tsx.
  chainNext?: boolean;
  // Small muted line under the label (an age range, a weight-band example)
  // — set together with `cardButtons` on the step.
  hint?: string;
  // A longer reassurance line shown inline on the button itself (used for
  // the "Not sure" option on the e-bike weight step) rather than requiring
  // a click to reveal it.
  note?: string;
};

export type ChoiceStep = {
  type: "choice";
  id: number;
  question: string;
  subtitle: string;
  // Real, factual content shown above the buttons — a "how to check"
  // checklist, a spec key/value grid, or a plain callout. Optional: most
  // steps don't need it, but the ones addressing a real shopper barrier
  // (hitch fitment, bike compatibility, price comparison) do.
  checklist?: string[];
  facts?: { label: string; value: string }[];
  note?: string;
  // Renders buttons as a card grid (label + hint) instead of the default
  // full-width pill list — used by the bike-detail steps where each option
  // needs a short example/age-range under it.
  cardButtons?: boolean;
  buttons: ChoiceButton[];
  // An expandable "Not sure?" self-check shown under the buttons — lets the
  // shopper answer confidently without leaving the quiz to go measure
  // something blind.
  helper?: { label: string; body: string; showTireDiagram?: boolean };
  // Small print under everything else (e.g. the e-bike battery-weight tip).
  footerNote?: string;
};

// The six bike types the inventory step (10) tracks — order matches what's
// actually common to carry, e-bikes and kids bikes right up front since
// they're the ones that need a follow-up question.
export type BikeCategory = "mountainBike" | "eBike" | "roadGravel" | "kidsBike" | "fatBike" | "hybrid";

export const bikeCategories: { key: BikeCategory; label: string }[] = [
  { key: "mountainBike", label: "Mountain bike" },
  { key: "eBike", label: "E-bike" },
  { key: "roadGravel", label: "Road / gravel" },
  { key: "kidsBike", label: "Kids bike" },
  { key: "fatBike", label: "Fat bike" },
  { key: "hybrid", label: "Hybrid / commuter" },
];

export type InventoryStep = {
  type: "inventory";
  id: number;
  heading: string;
  subtitle: string;
  cta: string;
};

export type EmailStep = {
  type: "email";
  id: number;
  heading: string;
  body: string;
  cta: string;
  declineLabel: string;
};

export type TextStep = {
  type: "text";
  id: number;
  heading: string;
  placeholder: string;
  cta: string;
  next: number;
};

export type EndStep = {
  type: "end";
  id: number;
  heading: string;
  body: string[];
};

export type QuizStep = ChoiceStep | InventoryStep | EmailStep | TextStep | EndStep;

export const START_STEP = 1;

// Longest real path through the funnel — e.g. someone with a kids bike, a
// fat bike, and a heavy e-bike hits every detail follow-up in the chain:
// 1 → 3 → 2 → 10 → 18 → 19 → 20 → 21 → 11 → 12 → 6. Used for the
// "Step X of Y" progress indicator — most shoppers take a much shorter
// path since the bike-detail steps only appear when actually relevant.
export const MAX_STEPS = 11;

// Step 16 ("Comparing our own models") renders a live pricing table from the
// real rackSizes prop instead of static copy here — see QuizFunnel.tsx.
export const MODEL_COMPARE_STEP_ID = 16;

export const quizSteps: Record<number, QuizStep> = {
  1: {
    type: "choice",
    id: 1,
    question: "What would help you decide?",
    subtitle: "Choose one",
    buttons: [
      { label: "Vehicle Fit Confirmation", next: 2 },
      { label: "Bike Compatibility", next: 3 },
      { label: "Comparing Price/Options", next: 4 },
      { label: "Buying Later (Not Urgent)", next: 10 },
      { label: "Other", next: 7, variant: "other" },
    ],
  },
  2: {
    type: "choice",
    id: 2,
    question: "Do you have a 2-inch hitch?",
    subtitle: "Here's how to check in 10 seconds",
    checklist: [
      "Look underneath your rear bumper for a square tube sticking out from the frame — that's a hitch receiver.",
      "A Class III (2\") receiver opening measures 2\" × 2\". A smaller 1.25\" opening is Class I/II and won't fit our racks.",
      "Already tow a trailer or boat? You've almost certainly got a 2\" receiver — check your owner's manual for \"Class III\" or \"2 inch.\"",
      "Nothing under the bumper at all? You don't have one yet — it's a standard, inexpensive add-on at most auto shops or national installers.",
    ],
    buttons: [
      { label: "Yes, I've got one", next: 10 },
      { label: "No / still not sure", next: 9 },
    ],
  },
  3: {
    type: "choice",
    id: 3,
    question: "Will your bikes actually fit?",
    subtitle: "The real specs — not marketing fluff",
    facts: [
      { label: "Wheel size", value: "21\"–29\" — most kids', hybrid, road, gravel & mountain bikes" },
      { label: "Tire width", value: "Up to 3\" wide — covers plus-size tires, not true fat-tire bikes" },
      { label: "Weight per bike", value: "Up to 65 lbs per wheel holder — rated for e-bikes" },
      { label: "Total capacity", value: "240 lbs combined across the rack" },
      { label: "Smaller wheels", value: "Under 21\"? A wheel bracket accessory covers 16\"–20\" kids' bikes" },
    ],
    note: "The only bikes that don't fit: true fat-tire/snow bikes with 4\"+ tires. Everything else — including heavy e-bikes — is covered.",
    buttons: [
      { label: "Yep, my bikes fit this", next: 2 },
      { label: "I've got true fat-tire bikes (4\"+ tires)", next: 17, variant: "other" },
    ],
  },
  4: {
    type: "choice",
    id: 4,
    question: "What are you comparing?",
    subtitle: "Choose one",
    buttons: [
      { label: "JB Racks vs. other brands", next: 15 },
      { label: "Our own models against each other", next: MODEL_COMPARE_STEP_ID },
    ],
  },
  15: {
    type: "choice",
    id: 15,
    question: "What actually matters when comparing racks",
    subtitle: "The specs worth checking on any rack you're comparing — here's where JB Racks lands",
    facts: [
      { label: "Weight rating", value: "65 lbs per wheel holder, 240 lbs total — a lot of racks predate e-bikes and aren't rated for them" },
      { label: "Hitch fit", value: "2\" Class III receiver, 18\" bar clears spare tires and extended trays" },
      { label: "Wobble control", value: "Anti-wobble hitch bracket included standard, not an upsell" },
      { label: "Warranty", value: "4-Year Warranty" },
    ],
    buttons: [{ label: "Got it — find my size", next: 10 }],
  },
  [MODEL_COMPARE_STEP_ID]: {
    type: "choice",
    id: MODEL_COMPARE_STEP_ID,
    question: "Compare our 4, 5 & 6-bike racks",
    subtitle: "Real specs and live pricing side by side",
    buttons: [{ label: "Pick my size", next: 10 }],
  },
  10: {
    type: "inventory",
    id: 10,
    heading: "What bikes are you carrying?",
    subtitle: "Tap + for each bike. If it has a motor, count it as an e-bike.",
    cta: "Next",
  },
  18: {
    type: "choice",
    id: 18,
    question: "Your kids bike — what wheel size?",
    subtitle: "Choose one",
    cardButtons: true,
    buttons: [
      { label: "16 in", hint: "Ages 4 to 6", next: 11, chainNext: true },
      { label: "20 in", hint: "Ages 6 to 9", next: 11, chainNext: true },
      { label: "24 in", hint: "Ages 8 to 12", next: 11, chainNext: true },
    ],
    helper: {
      label: "Not sure? Check the tire sidewall",
      body: "Look for a size printed right on the tire, like \"20 x 1.75\" — the first number is the wheel size in inches.",
    },
  },
  19: {
    type: "choice",
    id: 19,
    question: "Your fat bike — how wide are the tires?",
    subtitle: "Choose one",
    cardButtons: true,
    buttons: [
      { label: "Up to 3 in", next: 11, chainNext: true },
      { label: "3 to 4 in", next: 17 },
      { label: "4 to 5 in", next: 17 },
    ],
    helper: {
      label: "Not sure? Your tire tells you",
      body: "Look at the printed marking on the tire sidewall. The first number is your wheel size, the second is your tire width in inches. \"26 x 4.0\" means a 26 in wheel with a 4 in tire.",
      showTireDiagram: true,
    },
  },
  20: {
    type: "choice",
    id: 20,
    question: "Your e-bike — how heavy is it?",
    subtitle: "The spec sticker on the frame or the brand's website has the exact figure.",
    cardButtons: true,
    buttons: [
      { label: "Under 50 lb", hint: "Most city and road e-bikes", next: 11, chainNext: true },
      { label: "50 to 65 lb", hint: "Most e-MTBs", next: 11, chainNext: true },
      { label: "65 to 80 lb", hint: "Fat tire and heavy duty e-bikes", next: 21 },
      { label: "Over 80 lb", hint: "Moped style, cargo", next: 21 },
      {
        label: "Not sure",
        next: 21,
        note: "No problem. We'll assume the heavier end (up to 80 lb) so your fit check is safe, and the next step covers a 30 second way to check the exact weight.",
      },
    ],
    footerNote: "Tip: the battery is usually 7 to 9 lb and comes off before loading.",
  },
  21: {
    type: "choice",
    id: 21,
    question: "Heads up on that e-bike",
    subtitle: "Still worth knowing before you load it",
    note: "Each wheel holder is rated to 65 lbs. A heavier e-bike can still ride in the rack, but load it into the lowest slot and double-check the strap tension before you drive — that's the one bike we'd want you to keep an eye on.",
    buttons: [{ label: "Got it, continue", next: 11, chainNext: true }],
  },
  11: {
    type: "choice",
    id: 11,
    question: "Want your rack to ease down slow and controlled, instead of slamming down?",
    subtitle: "Choose one",
    buttons: [
      { label: "Yes, that matters to me", next: 12, wantsStrut: true, variant: "other" },
      { label: "Not fussed either way", next: 12 },
    ],
  },
  12: {
    type: "choice",
    id: 12,
    question: "Want a dedicated spot to keep it stored neatly when it's off the car?",
    subtitle: "Choose one",
    buttons: [
      { label: "Yes, I'd like that", next: 6, wantsStand: true, variant: "other" },
      { label: "No, I've got storage sorted", next: 6 },
      { label: "Not sure yet", next: 6, wantsStand: true },
    ],
  },
  6: {
    type: "email",
    id: 6,
    heading: "MYSTERY DEAL: UNLOCKED",
    body: "Sign up to receive a surprise discount (on top of current discount)",
    cta: "REVEAL THE OFFER",
    declineLabel: "No I'm still not ready",
  },
  7: {
    type: "text",
    id: 7,
    heading: "Tell us in your own words - what's the one thing stopping you?",
    placeholder: "Tell us...",
    cta: "SUBMIT REASON",
    next: 8,
  },
  8: {
    type: "end",
    id: 8,
    heading: "Thanks for answering our questions. We hope you're more clear on what's needed.",
    body: ["If you need more help reach out to reed@jbracks.com and he can help you with your pre-purchase questions."],
  },
  9: {
    type: "end",
    id: 9,
    heading: "No 2-inch hitch yet — here's what to do next.",
    body: [
      "JB Racks needs a 2-inch, Class III receiver to mount to, so this isn't the right time to buy just yet.",
      "The good news: it's a common, inexpensive fit at most auto shops or national installers, usually done same-day.",
      "Once it's on, come back and finish the quiz — or email support@jbracks.com if you want a hand figuring out the right hitch for your vehicle.",
    ],
  },
  17: {
    type: "end",
    id: 17,
    heading: "That tire's wider than our wheel holders.",
    body: [
      "Wheel holders top out at 3\" wide, and your tires are over that — we'd rather flag it now than have it not seat properly at home.",
      "If most of your bikes are standard, road, hybrid, mountain or e-bikes with just one wide-tire bike in the mix, email reed@jbracks.com — we can talk through workarounds.",
    ],
  },
};
