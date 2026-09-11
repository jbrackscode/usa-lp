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
  buttons: ChoiceButton[];
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

export type QuizStep = ChoiceStep | EmailStep | TextStep | EndStep;

export const START_STEP = 1;

// Longest real path through the funnel (e.g. 1 → 3 → 2 → 10 → 11 → 12 → 6)
// — used for the "Step X of Y" progress indicator.
export const MAX_STEPS = 7;

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
    type: "choice",
    id: 10,
    question: "How many bikes do you need to carry?",
    subtitle: "Almost there — this decides your recommended rack",
    buttons: [
      { label: "1-4 bikes", next: 11, bikeCount: 4 },
      { label: "5 bikes", next: 11, bikeCount: 5 },
      { label: "6 or more bikes", next: 11, bikeCount: 6 },
    ],
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
    heading: "Our racks aren't built for true fat-tire bikes.",
    body: [
      "Wheel holders top out at 3\" wide, so 4\"+ fat-tire and snow bikes won't seat properly — we'd rather tell you now than have it not fit at home.",
      "If most of your bikes are standard, road, hybrid, mountain or e-bikes with just one true fat-tire in the mix, email reed@jbracks.com — we can talk through workarounds.",
    ],
  },
};
