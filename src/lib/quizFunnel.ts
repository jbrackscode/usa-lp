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

// Longest real path through the funnel (e.g. 1 → 2 → 5 → 10 → 11 → 12 → 6)
// — used for the "Step X of Y" progress indicator.
export const MAX_STEPS = 7;

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
    question: "What do you drive?",
    subtitle: "Choose one",
    buttons: [
      { label: "Sedan/Hatch", next: 5 },
      { label: "SUV", next: 5 },
      { label: "Pick Up", next: 5 },
      { label: "No tow bar / not sure", next: 9, variant: "other" },
    ],
  },
  3: {
    type: "choice",
    id: 3,
    question: "What are you needing to carry?",
    subtitle: "Choose one",
    buttons: [
      { label: "E-bikes", next: 5 },
      { label: "Fat tire/mtb", next: 5 },
      { label: "Kids bikes", next: 5 },
      { label: "3+ bikes", next: 5 },
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
    question: "Do you have a 2-inch hitch?",
    subtitle: "Choose one",
    buttons: [
      { label: "Yes", next: 10 },
      { label: "No", next: 9 },
    ],
  },
  10: {
    type: "choice",
    id: 10,
    question: "How many bikes do you need to carry?",
    subtitle: "Choose one — this is what decides your recommended rack",
    buttons: [
      { label: "1-4 bikes", next: 11, bikeCount: 4 },
      { label: "5 bikes", next: 11, bikeCount: 5 },
      { label: "6 or more bikes", next: 11, bikeCount: 6 },
    ],
  },
  11: {
    type: "choice",
    id: 11,
    question: "What happens when you fold your rack back up after a ride?",
    subtitle: "Choose one",
    buttons: [
      { label: "It drops with a bit of a bang - no big deal", next: 12 },
      { label: "Honestly? I'd love it to ease down instead of slam", next: 12, wantsStrut: true, variant: "other" },
    ],
  },
  12: {
    type: "choice",
    id: 12,
    question: "Where does the rack live when it's not on the car?",
    subtitle: "Choose one",
    buttons: [
      { label: "Propped in a corner of the garage", next: 6, wantsStand: true },
      { label: "It's got a proper spot already", next: 6 },
      { label: "Good question... no idea yet", next: 6, wantsStand: true, variant: "other" },
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
