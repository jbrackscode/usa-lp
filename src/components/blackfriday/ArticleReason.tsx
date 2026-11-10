import { FeatureMedia } from "@/components/lp/FeatureRow";

type ArticleReasonProps = {
  number: number;
  // Short topic label for the inset count above the heading ("01 / VALUE").
  kicker: string;
  title: string;
  body: string;
  image: string;
  video?: string;
  poster?: string;
  // A real, verbatim excerpt from a 5-star review (verticalRackReviews.ts).
  quote?: { text: string; author: string };
};

// One numbered listicle section — the editorial version of FeatureRow: an
// inset count above the heading in the Hollow Socks listicle style (small
// mono, letter-spaced "01 / TOPIC"), the heading, media, readable body copy
// and an owner pull quote. Desktop (md+) is side by side: media on the left
// spanning both rows, count + heading and copy on the right, vertically
// centred as a group. Mobile stacks count + heading → media → copy, so the
// heading still introduces the clip.
export function ArticleReason({ number, kicker, title, body, image, video, poster, quote }: ArticleReasonProps) {
  return (
    <section className="mx-auto grid max-w-[1000px] grid-cols-1 gap-x-10 px-5 pt-12 sm:pt-14 md:grid-cols-2 md:grid-rows-[1fr_auto_auto_1fr]">
      <div className="md:col-start-1 md:row-span-4 md:row-start-1 md:self-center">
        <FeatureMedia image={image} video={video} poster={poster} lazy />
      </div>

      <div className="order-first mb-5 md:order-none md:col-start-2 md:row-start-2 md:mb-4">
        <p className="mb-2 font-mono text-[14px] font-medium uppercase tracking-[0.12em] text-nr-ink sm:text-[16px]">
          {String(number).padStart(2, "0")} / {kicker}
        </p>
        <h2 className="text-[26px] font-black uppercase leading-[1.15] tracking-tight text-nr-ink sm:text-[34px] md:text-[30px] lg:text-[34px]">
          {title}
        </h2>
      </div>

      <div className="md:col-start-2 md:row-start-3">
        <p className="mt-6 text-[18px] leading-[1.75] text-nr-ink-mid md:mt-0">{body}</p>
        {quote && (
          <blockquote className="mt-5 border-l-4 border-brand-orange pl-4">
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
