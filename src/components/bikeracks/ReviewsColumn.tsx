import { productReviews } from "@/lib/verticalRackReviews";
import { reviewStats } from "@/lib/bikeRacks";
import { ReviewCard } from "./ReviewsCarousel";

// 15 hand-picked five-star reviews from /lp-vertical-bike-racks' carousel,
// stacked in a single container-width column — same cards, no carousel/
// masonry. Audited for sale-detracting sentiment: anything mentioning
// assembly/instruction trouble, fit issues, wobble, missing parts, shipping
// damage or delays, weight, or a since-expired promo was left out, even
// when rated 5 stars. Matched by author + title (not array index) so edits
// to verticalRackReviews.ts can't silently swap in a different review.
// `highlight` overrides the automatic pick where it would miss or land on
// the wrong sentence.
const picks: { author: string; title: string; highlight?: string }[] = [
  { author: "Scott G.", title: "Great Bike Rack" },
  { author: "Angus B.", title: "Great bike rack and fantastic service" },
  { author: "Shan S.", title: "Amazing Bike Rack", highlight: "I must say the quality is top notch" },
  {
    author: "Ryan J.",
    title: "4 bike rack",
    highlight: "The price is excellent, the story behind them is inspiring, the rack itself is strong and durable",
  },
  { author: "Justin V.", title: "Superb Product and Service." },
  { author: "Carl Z.", title: "Super fast delivery, great product 👍" },
  { author: "Ryan A.", title: "New 6 Bike Rack" },
  { author: "David B.", title: "JB 5 Bike Rack" },
  { author: "Edgar P.", title: "I super love it." },
  { author: "Michael J.", title: "Loving it!" },
  { author: "Shaun T.", title: "In racks" },
  { author: "Danie S.", title: "4 Bike Rack" },
  { author: "marc-paul d. g.", title: "👍🏻👍🏻👍🏻" },
  { author: "Phil S.", title: "Love the bike rack!" },
  { author: "Sandy M.", title: "So far so good" },
];

const curatedReviews = picks.flatMap((p) => {
  const review = productReviews.find((r) => r.author === p.author && r.title === p.title && r.rating === 5);
  return review ? [{ review, highlight: p.highlight }] : [];
});

export function ReviewsColumn() {
  return (
    // White section with brand-cream cards (same cream as the closing CTA),
    // so each review reads as its own block.
    <div className="border-t border-brand-line bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1000px] px-5">
        <div className="mx-auto mb-3 max-w-[62ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">VERIFIED REVIEWS</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">
            What riders are saying
          </h2>
        </div>
        <p className="mb-8 text-center text-sm text-brand-black/70">
          <span className="text-brand-star">★★★★★</span> {reviewStats.average}/5 average · {reviewStats.percentRecommended}% would
          recommend
        </p>

        <div className="flex flex-col gap-4">
          {curatedReviews.map(({ review, highlight }) => (
            <ReviewCard key={`${review.author}-${review.title}`} review={review} highlight={highlight} tinted />
          ))}
        </div>
      </div>
    </div>
  );
}
