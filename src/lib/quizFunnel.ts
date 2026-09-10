// Step definitions for the custom quiz funnel on /lp-quiz (QuizFunnel.tsx).
// Branching is driven entirely by `next` on each button, so the component
// stays generic — this file is the only place that needs to change if the
// question flow changes.

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

// Longest real path through the funnel (e.g. 1 → 5 → 10 → 11 → 12 → 6) —
// used for the "Step X of Y" progress indicator. Kept short on purpose:
// every question here either decides the recommendation (hitch, bike count,
// fold/storage preference) or routes to a genuine bail-out — nothing is
// asked just to ask.
export const MAX_STEPS = 6;

export const quizSteps: Record<number, QuizStep> = {
  1: {
    type: "choice",
    id: 1,
    question: "What would help you decide?",
    subtitle: "Choose one",
    buttons: [
      { label: "Vehicle Fit Confirmation", next: 5 },
      { label: "Bike Compatibility", next: 5 },
      { label: "Comparing Price/Options", next: 4 },
      { label: "Buying Later (Not Urgent)", next: 10 },
      { label: "Other", next: 7, variant: "other" },
    ],
  },
  4: {
    type: "choice",
    id: 4,
    question: "Comparing on price",
    subtitle: "Choose one",
    buttons: [
      { label: "Comparing to another brand", next: 7 },
      { label: "Comparing our models", next: 8 },
    ],
  },
  5: {
    type: "choice",
    id: 5,
    question: "Quick check — got a 2-inch hitch on your vehicle?",
    subtitle: "This is all we need to confirm fitment",
    buttons: [
      { label: "Yes, I've got one", next: 10 },
      { label: "No / not sure", next: 9 },
    ],
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
    question: "Want your rack to ease down slow and controlled, instead of slamming shut?",
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
    heading: "Too bad. JB Racks only supports a 2-inch, class III hitches.",
    body: [
      "Thanks for checking us out.",
      "We recommend getting a 2-inch, class III hitch fitted to your car. We are working on getting local fitment experts that can organise this for you.",
      "If you have further queries direct them to support@jbracks.com",
    ],
  },
};
