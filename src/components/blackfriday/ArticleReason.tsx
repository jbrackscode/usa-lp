import { FeatureMedia } from "@/components/lp/FeatureRow";

type ArticleReasonProps = {
  number: number;
  title: string;
  body: string;
  image: string;
  video?: string;
  poster?: string;
  // A real, verbatim excerpt from a 5-star review (verticalRackReviews.ts).
  quote?: { text: string; author: string };
};

// One numbered listicle section — the editorial version of FeatureRow: big
// numeral + sentence-weight heading, media, readable body copy and an owner
// pull quote. Desktop (md+) is side by side like FeatureRow / the Hollow
// Socks listicle: media on the left spanning both rows, heading and copy on
// the right, vertically centred as a group. Mobile stacks heading → media →
// copy, so the heading still introduces the clip.
export function ArticleReason({ number, title, body, image, video, poster, quote }: ArticleReasonProps) {
  return (
    <section className="mx-auto grid max-w-[1000px] grid-cols-1 gap-x-10 px-5 pt-12 sm:pt-14 md:grid-cols-2 md:grid-rows-[1fr_auto_auto_1fr]">
      <div className="md:col-start-1 md:row-span-4 md:row-start-1 md:self-center">
        <FeatureMedia image={image} video={video} poster={poster} lazy />
      </div>

      <h2 className="order-first mb-5 flex items-baseline gap-3 text-[26px] font-black leading-[1.15] tracking-tight text-nr-ink sm:text-[34px] md:order-none md:col-start-2 md:row-start-2 md:mb-4 md:text-[30px] lg:text-[34px]">
        <span className="shrink-0 text-[40px] leading-none text-brand-green sm:text-[52px] md:text-[44px] lg:text-[52px]">{number}.</span>
        <span>{title}</span>
      </h2>

      <div className="md:col-start-2 md:row-start-3">
        <p className="mt-6 text-[18px] leading-[1.75] text-nr-ink-mid md:mt-0">{body}</p>
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
      </div>
    </section>
  );
}
