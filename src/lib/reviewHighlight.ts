// Picks the sentence of a review body that gets the yellow highlight on
// review cards (ReviewCard in ReviewsCarousel.tsx). Lives outside that
// client component so server components like ReviewsColumn can call it.

// Words that flag a sentence as worth calling out — not what gets
// highlighted itself. We highlight the whole sentence/clause they appear
// in, so the reader sees a complete thought rather than one bare word.
const TRIGGER_WORDS = [
  "recommend",
  "quality",
  "sturdy",
  "solid",
  "excellent",
  "impressed",
  "worth",
  "perfect",
  "amazing",
  "fantastic",
  "happy",
  "love",
  "great",
  "easy",
  "value",
  "smooth",
  "reliable",
  "surprised",
];
const triggerRegex = new RegExp(`\\b(${TRIGGER_WORDS.join("|")})\\b`, "i");

// Splits on sentence-ending punctuation while keeping the punctuation
// attached to the sentence it closes.
function splitIntoSentences(body: string) {
  const matches = body.match(/[^.!?]+[.!?]*/g);
  return matches ? matches.map((s) => s.trim()).filter(Boolean) : [body];
}

// Pick the first sentence that (a) mentions a positive trigger word and
// (b) reads as a full clause rather than a stray fragment.
export function findHighlight(body: string) {
  return splitIntoSentences(body).find((s) => {
    const words = s.split(/\s+/).length;
    return words >= 5 && words <= 32 && triggerRegex.test(s);
  });
}
