import { reviews } from "@/lib/newsroom";

export function ReviewsGrid() {
  return (
    <div className="border-t border-nr-rule bg-nr-bg px-5 py-12 sm:px-10">
      <h2 className="mb-8 text-center text-[28px] font-black text-nr-ink">
        Join Over 20,000+ Happy Families
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.author} className="rounded-[10px] border border-nr-rule bg-white p-5">
            <div className="mb-2.5 tracking-[2px] text-nr-orange">★★★★★</div>
            <blockquote className="mb-3 text-sm italic leading-[1.65] text-nr-ink-mid">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <div className="text-[13px] font-semibold text-nr-ink">
              {r.author} <span className="font-normal text-nr-ink-muted">· Verified Buyer</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
