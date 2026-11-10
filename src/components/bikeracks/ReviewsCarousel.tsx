"use client";

import { useEffect, useRef, useState } from "react";
import { productReviews } from "@/lib/verticalRackReviews";
import { reviewStats } from "@/lib/bikeRacks";
import { findHighlight } from "@/lib/reviewHighlight";

function highlightBody(body: string, override?: string) {
  const target = override ?? findHighlight(body);

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

// Exported for ReviewsColumn on /lp-demo-black-friday — same card and
// highlight treatment, just stacked in a single column. `highlight` picks
// the exact passage to mark instead of the automatic trigger-word pick.
// `tinted` is the /lp-demo-black-friday card: brand-cream fill on a white
// section, with three distinct type voices — an uppercase heavy headline
// (an h3, like the page's other uppercase headings), readable sentence-case
// body, and a mono "AUTHOR / VERIFIED BUYER / COLOUR" footer matching the
// page's mono labels (reason counts, "Summary:").
export function ReviewCard({
  review,
  highlight,
  tinted = false,
}: {
  review: (typeof productReviews)[number];
  highlight?: string;
  tinted?: boolean;
}) {
  if (tinted) {
    // Variants are stored as "Colour / Colour" — the first half is enough.
    const colour = review.variant?.split(" / ")[0];
    return (
      <div className="flex flex-col rounded-xl bg-brand-cream p-6 lg:p-8">
        <div className="mb-3 text-[15px] tracking-[2px] text-brand-star" aria-hidden>
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
        {review.title && (
          <h3 className="text-[18px] font-extrabold uppercase leading-[1.15] tracking-tight text-brand-black sm:text-[22px]">{review.title}</h3>
        )}
        <p className="mt-3 flex-1 text-[16px] leading-[1.7] text-brand-black/80 lg:text-[17px]">
          &ldquo;{highlightBody(review.body, highlight)}&rdquo;
        </p>
        <div className="mt-5 border-t border-brand-black/10 pt-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-brand-black/70">
          <span className="text-brand-black">{review.author}</span> / Verified buyer
          {colour && <span className="text-brand-black/60"> / {colour}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-brand-line bg-white p-5 lg:p-6">
      <div className="mb-2 tracking-[2px] text-brand-star" aria-hidden>
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>
      {review.title && <div className="mb-1.5 text-sm font-bold tracking-tight text-brand-black lg:text-base">{review.title}</div>}
      <p className="flex-1 text-[13.5px] leading-relaxed tracking-tight text-brand-black/75 lg:text-base lg:leading-[1.7]">
        &ldquo;{highlightBody(review.body, highlight)}&rdquo;
      </p>
      <div className="mt-3.5 text-[12.5px] font-bold tracking-tight text-brand-black/50 lg:text-sm">
        {review.author} - Verified Buyer
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
