import { CountdownTimer } from "@/components/lp/CountdownTimer";
import { ClaimRackButton } from "@/components/lp/ClaimRackButton";
import { product } from "@/lib/config";
import { reviewStats } from "@/lib/bikeRacks";
import { offerPriceLine, type BlackFridayOffer } from "@/lib/blackFriday";
import { SaleProgress } from "./SaleProgress";
import { FinalWeekOnly } from "./FinalWeekOnly";
import { BlackFridayBadge } from "./BlackFridayBadge";

// Final CTA for /lp-demo-black-friday, built for one clear action. Reading
// order is offer → action → reassurance: the Black Friday SVG badge +
// heading, a big price with the compare-at struck through, then the green
// button — the obvious next step — with the shipping/warranty small print
// right under it. Urgency sits below in the top bar's style (charcoal panel,
// white condensed-digit timer, dark progress bar), and the rating closes it
// out. Orange is never used as small text on white, and all grey text on
// white is ≥ 4.5:1.
export function BlackFridayClosing({ offer }: { offer: BlackFridayOffer }) {
  return (
    <section className="bg-brand-cream px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-[540px] overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div className="h-1.5 bg-brand-orange" aria-hidden />

        <div className="px-6 pb-7 pt-8 text-center sm:px-10 sm:pb-9 sm:pt-10">
          <BlackFridayBadge size="sm" />
          <h2 className="mt-5 text-[28px] font-extrabold uppercase leading-[1.1] tracking-tighter text-brand-black sm:text-[36px]">
            Less wrestling with bikes. More riding.
          </h2>
          <p className="mx-auto mt-2 max-w-[380px] text-[15px] leading-snug text-brand-black/70">
            {offerPriceLine(offer)} - our biggest sale of the year.
          </p>

          <div className="mt-6 flex items-baseline justify-center gap-3">
            <span className="text-[56px] font-extrabold leading-none tracking-tight text-brand-black">${offer.price}</span>
            <span className="text-[22px] font-semibold text-brand-black/45 line-through">${offer.compareAtPrice}</span>
          </div>
          <span className="mt-3 inline-block rounded-full bg-brand-black px-3.5 py-1.5 text-[13px] font-black uppercase tracking-wide text-white">
            {offer.allSamePrice ? "You save" : "Save up to"} ${offer.maxSavings}
          </span>

          <ClaimRackButton label="Learn More" full href={product.productUrl} className="mt-7" />
          {/* Non-breaking spaces and a non-breaking hyphen (U+2011) keep
              each phrase whole when it wraps — a plain "-" is a line-break
              opportunity, which split "4- / year". */}
          <p className="mt-3 text-balance text-[13px] text-brand-black/65">
            Free&nbsp;shipping · 4&#8209;year&nbsp;warranty · No&nbsp;code&nbsp;needed
          </p>

          {/* Same treatment as the top bar: charcoal panel, mono label, the
              white condensed-digit timer, then the dark progress bar. The
              whole panel only appears in the sale's final 7 days. */}
          <FinalWeekOnly>
            <div className="mt-8 rounded-xl bg-[#282828] px-4 pb-5 pt-4 sm:px-6">
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-[13px]">Sale price ends in</p>
              <div className="mt-3 flex justify-center">
                <CountdownTimer target={product.blackFridayEndsAt} panel />
              </div>
              <div className="mt-5 text-left">
                <SaleProgress />
              </div>
            </div>
          </FinalWeekOnly>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-[540px] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-brand-black/65">
        <span className="tracking-[2px] text-brand-star" aria-hidden>
          ★★★★★
        </span>
        <span>
          <strong className="font-bold text-brand-black">{reviewStats.average}/5</strong> from {reviewStats.count} verified
          reviews · 20,000+ riders
        </span>
      </div>
    </section>
  );
}
