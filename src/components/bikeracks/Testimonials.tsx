import Image from "next/image";
import { testimonialsEyebrow, testimonialsHeadline, videoQuote } from "@/lib/bikeRacksListicle";
import { reviews, reviewStats } from "@/lib/bikeRacks";

export function Testimonials() {
  return (
    <div className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-3 max-w-[62ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">{testimonialsEyebrow}</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">{testimonialsHeadline}</h2>
        </div>
        <p className="mb-10 text-center text-sm text-brand-black/60">
          <span className="text-brand-star">★★★★★</span> {reviewStats.average}/5 from {reviewStats.count} verified reviews ·{" "}
          {reviewStats.percentRecommended}% would recommend
        </p>

        <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-lg border border-brand-line bg-white p-5">
              <div className="mb-2 tracking-[2px] text-brand-star" aria-hidden>
                ★★★★★
              </div>
              <p className="mb-3.5 text-[14.5px] text-brand-black/80">&ldquo;{r.quote}&rdquo;</p>
              <div className="text-[13px] font-bold text-brand-black/50">{r.name} — Verified Buyer</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-brand-line bg-white p-7 sm:p-9">
          <blockquote className="text-2xl font-extrabold leading-[1.25] text-brand-black sm:text-[28px]">
            &ldquo;{videoQuote.quote}&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image src={videoQuote.avatar} alt={videoQuote.name} fill sizes="48px" className="object-cover" />
            </div>
            <cite className="text-sm font-extrabold not-italic uppercase tracking-wide text-brand-black">
              {videoQuote.name} <span className="text-brand-black/40">— {videoQuote.role}</span>
            </cite>
          </div>
        </div>
      </div>
    </div>
  );
}
