import { FeatureMedia } from "@/components/lp/FeatureRow";

type ArticleReasonProps = {
  number: number;
  title: string;
  body: string;
  image: string;
  video?: string;
  // A real, verbatim excerpt from a 5-star review (verticalRackReviews.ts).
  quote?: { text: string; author: string };
};

// One numbered listicle section in the article column — the editorial
// version of FeatureRow: big numeral + sentence-weight heading, full-width
// media, readable body copy, and an owner pull quote.
export function ArticleReason({ number, title, body, image, video, quote }: ArticleReasonProps) {
  return (
    <section className="mx-auto max-w-[760px] px-5 pt-12 sm:pt-14">
      <h2 className="mb-5 flex items-baseline gap-3 text-[26px] font-black leading-[1.15] tracking-tight text-nr-ink sm:text-[34px]">
        <span className="shrink-0 text-[40px] leading-none text-brand-green sm:text-[52px]">{number}.</span>
        <span>{title}</span>
      </h2>
      <FeatureMedia image={image} video={video} aspect="aspect-[4/3]" />
      <p className="mt-6 text-[18px] leading-[1.75] text-nr-ink-mid">{body}</p>
      {quote && (
        <blockquote className="mt-5 border-l-4 border-brand-yellow pl-4">
          <p className="text-[17px] font-semibold italic leading-[1.6] text-nr-ink">&ldquo;{quote.text}&rdquo;</p>
          <footer className="mt-1.5 text-[13px] text-nr-ink-muted">
            <span className="text-brand-star" aria-hidden>
              ★★★★★{" "}
            </span>
            {quote.author}, verified buyer
          </footer>
        </blockquote>
      )}
    </section>
  );
}
