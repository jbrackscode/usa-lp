// Content for /lp-quiz. The quiz itself lives in ConvertBox (same widget
// used on the live jbracks.com/pages/quiz page) — this page's job is just to
// sell the click. Every CTA here uses the exact same trigger link and script
// UUID as the real page, so it opens the same live quiz.

export const convertBox = {
  triggerHref: "#cb448c0464",
  scriptUuid: "78b30db1-9aff-48e3-ad56-27f8763a2ab3",
};

export const hero = {
  kicker: "60-SECOND RACK FINDER",
  headline: "Not sure which JB Rack is right for you?",
  sub: "Bike racks aren't the easiest thing to buy sight-unseen. Answer a few quick questions and we'll help you land on the right size and setup — or tell you honestly if now isn't the right time.",
  cta: "Take the Quiz",
};

export const benefits = [
  {
    title: "Personalized to your setup",
    body: "Your vehicle, how many bikes, and how you actually ride — the quiz factors in what matters for your situation, not a generic bestseller list.",
  },
  {
    title: "Avoid the wrong-size headache",
    body: "Ordering the wrong rack size is the #1 reason for returns. A minute of questions now saves a return shipment later.",
  },
  {
    title: "No pressure, just clarity",
    body: "If a vertical rack isn't the right fit for you yet, we'll tell you that too. The goal is the right answer, not just a sale.",
  },
];

export const trustStrip = [
  { value: "4.7/5", label: "Average rating" },
  { value: "144", label: "Verified reviews" },
  { value: "20,000+", label: "Customers" },
  { value: "4-Year", label: "Warranty" },
];

export const finalCta = {
  headline: "Two minutes now beats a return later.",
  body: "Answer a few quick questions and get a rack recommendation built around how you actually ride.",
  cta: "Take the Quiz",
};
