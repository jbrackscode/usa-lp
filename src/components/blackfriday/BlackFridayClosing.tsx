import { CountdownTimer } from "@/components/lp/CountdownTimer";
import { ClaimRackButton } from "@/components/lp/ClaimRackButton";
import { product } from "@/lib/config";
import { reviewStats } from "@/lib/bikeRacks";
import { offerPriceLine, type BlackFridayOffer } from "@/lib/blackFriday";
import { SaleProgress } from "./SaleProgress";

// Final CTA for /lp-demo-black-friday, built for one clear action. Reading
// order is offer → action → reassurance: tag + heading, a big price with
// the compare-at struck through, then the green button — the only large
// saturated element in the card, so it's the obvious next step — with the
// shipping/warranty small print right under it. Urgency (countdown +
// sale-progress) sits below in a muted panel with dark text, as support
// rather than a competing focal point, and the rating closes it out.
// Contrast: orange is only used as a fill (tag, accent bar, progress bar),
// never as small text on white, and all grey text is ≥ 4.5:1. The tag's
// white-on-orange matches the page's ticker and offer tag.
export function BlackFridayClosing({ offer }: { offer: BlackFridayOffer }) {
  return (
    <section className="bg-brand-cream px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-[540px] overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div className="h-1.5 bg-brand-orange" aria-hidden />

        <div className="px-6 pb-7 pt-8 text-center sm:px-10 sm:pb-9 sm:pt-10">
          <span className="inline-block -rotate-2 rounded bg-brand-orange px-3 py-1 text-[12px] font-black uppercase tracking-widest text-white">
            Black Friday
          </span>
          <h2 className="mt-4 text-[28px] font-extrabold uppercase leading-[1.1] tracking-tighter text-brand-black sm:text-[36px]">
            Ready to make the switch?
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

          <ClaimRackButton label={`Claim My Rack - $${offer.price}`} full href={product.productUrl} className="mt-7" />
          {/* Non-breaking spaces keep each phrase whole when it wraps. */}
          <p className="mt-3 text-balance text-[13px] text-brand-black/65">
            Free&nbsp;shipping · 4-year&nbsp;warranty · No&nbsp;code&nbsp;needed
          </p>

          <div className="mt-8 rounded-xl bg-brand-cream px-4 py-4 text-left sm:px-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span className="text-[12px] font-bold uppercase tracking-wide text-brand-black/70">Sale price ends in</span>
              <CountdownTimer target={product.blackFridayEndsAt} compact large onLight />
            </div>
            <SaleProgress tone="light" />
          </div>
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
