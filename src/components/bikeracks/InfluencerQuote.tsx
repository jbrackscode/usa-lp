import Image from "next/image";
import { videoQuote } from "@/lib/bikeRacksListicle";

// Standalone influencer quote card — same real Adam Miller quote used inside
// Testimonials on /lp-bike-racks, split out so /lp-vertical-bike-racks can
// use it without the 6-review grid that page's own ReviewsCarousel wall
// already covers. Styled as a bold editorial pull-quote rather than a plain
// bordered card.
export function InfluencerQuote() {
  return (
    <div className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="relative overflow-hidden rounded-2xl bg-brand-black px-7 py-12 sm:px-14 sm:py-16">
          <span
            className="pointer-events-none absolute -left-3 -top-8 select-none font-display text-[220px] leading-none text-brand-orange/25 sm:-top-10 sm:text-[320px]"
            aria-hidden
          >
            &ldquo;
          </span>

          <div className="relative">
            <div className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-orange">Rider Spotlight</div>
            <blockquote className="max-w-[22ch] text-3xl font-black leading-[1.15] tracking-tight text-white sm:max-w-[18ch] sm:text-5xl lg:text-[56px]">
              {videoQuote.quote}
            </blockquote>
            <div className="mt-8 flex items-center gap-3.5">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-orange ring-offset-2 ring-offset-brand-black">
                <Image src={videoQuote.avatar} alt={videoQuote.name} fill sizes="56px" className="object-cover" />
              </div>
              <cite className="text-base font-extrabold not-italic uppercase tracking-wide text-white">
                {videoQuote.name} <span className="text-brand-orange">— {videoQuote.role}</span>
              </cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
