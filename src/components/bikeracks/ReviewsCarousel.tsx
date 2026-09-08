"use client";

import { useEffect, useRef, useState } from "react";
import { productReviews } from "@/lib/verticalRackReviews";
import { reviewStats } from "@/lib/bikeRacks";

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

function highlightBody(body: string) {
  const sentences = splitIntoSentences(body);

  // Pick the first sentence that (a) mentions a positive trigger word and
  // (b) reads as a full clause rather than a stray fragment.
  const target = sentences.find((s) => {
    const words = s.split(/\s+/).length;
    return words >= 5 && words <= 32 && triggerRegex.test(s);
  });

  if (!target) return body;

  const index = body.indexOf(target);
  if (index === -1) return body;

  const before = body.slice(0, index);
  const after = body.slice(index + target.length);

  return (
    <>
      {before}
      <mark className="rounded bg-brand-yellow/60 px-1 py-0.5 font-semibold text-brand-black">{target}</mark>
      {after}
    </>
  );
}

function ReviewCard({ review }: { review: (typeof productReviews)[number] }) {
  return (
    <div className="flex flex-col rounded-lg border border-brand-line bg-white p-5 lg:p-6">
      <div className="mb-2 tracking-[2px] text-brand-star" aria-hidden>
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>
      {review.title && <div className="mb-1.5 text-sm font-bold tracking-tight text-brand-black lg:text-base">{review.title}</div>}
      <p className="flex-1 text-[13.5px] leading-relaxed tracking-tight text-brand-black/75 lg:text-base lg:leading-[1.7]">
        &ldquo;{highlightBody(review.body)}&rdquo;
      </p>
      <div className="mt-3.5 text-[12.5px] font-bold tracking-tight text-brand-black/50 lg:text-sm">
        {review.author} — Verified Buyer
        {review.variant && <span className="font-normal text-brand-black/35"> · {review.variant}</span>}
      </div>
    </div>
  );
}

export function ReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  // Only one of the two layouts is ever actually mounted — rendering both
  // simultaneously (one CSS-hidden) doubled ~70 review cards' worth of text
  // in the DOM, bloating the page for no visible benefit.
  const [layout, setLayout] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setLayout(mq.matches ? "desktop" : "mobile");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function scrollByCards(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * (track.clientWidth * 0.85), behavior: "smooth" });
  }

  return (
    <div className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-3 max-w-[62ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">VERIFIED REVIEWS</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">
            What riders are saying
          </h2>
        </div>
        <p className="mb-8 text-center text-sm text-brand-black/60">
          <span className="text-brand-star">★★★★★</span> {reviewStats.average}/5 average · {reviewStats.percentRecommended}% would
          recommend
        </p>
      </div>

      {layout === "mobile" && (
        <div className="relative mx-auto max-w-[1100px]">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {productReviews.map((r, i) => (
              <div key={i} className="w-[270px] shrink-0 snap-start sm:w-[300px]">
                <ReviewCard review={r} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll reviews left"
            className="absolute -left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-brand-black shadow-md hover:bg-brand-cream sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Scroll reviews right"
            className="absolute -right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-brand-black shadow-md hover:bg-brand-cream sm:flex"
          >
            ›
          </button>
        </div>
      )}

      {layout === "desktop" && (
        <div className="w-full px-6 xl:px-10">
          <div className="columns-3 gap-5 xl:columns-4 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {productReviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
