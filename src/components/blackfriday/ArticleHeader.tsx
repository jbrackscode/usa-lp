// Advertorial opening for /lp-demo-black-friday, laid out like the Hollow
// Socks listicle intro: left-aligned in the same 1000px container as the
// reason rows below (so the headline lines up with their media), a
// problem-question headline, a regular-weight "N reasons X is the best Y you
// can buy" line tight underneath, then a summary set off by a dark left bar
// with a mono "Summary:" label (matching the reasons' inset counts).
import { ClaimRackButton } from "@/components/lp/ClaimRackButton";
import { product } from "@/lib/config";
import { saleCtaLabel, saleEndLabel, type BlackFridayOffer } from "@/lib/blackFriday";
import { BlackFridayBadge } from "./BlackFridayBadge";

export function ArticleHeader({ offer }: { offer: BlackFridayOffer }) {
  return (
    <header className="mx-auto max-w-[1000px] px-5 pt-10 sm:pt-14">
      <h1 className="text-[30px] font-black uppercase leading-[1.1] tracking-tight text-nr-ink sm:text-[44px] lg:text-[52px]">
        Tired of wrestling heavy bikes onto your rack?
      </h1>

      <p className="mt-3 text-[19px] font-normal leading-[1.35] text-nr-ink sm:text-[24px]">
        5 Reasons A Vertical Rack Is The Best Bike Rack You Can Buy
      </p>

      {/* The deal + first CTA above the fold (teardown fix #1): without it
          the first product link sat ~3 screens down, past where most
          visitors stop. id="hero-offer" is what StickySaleBar watches -
          the mobile sticky bar only appears once this has scrolled away. */}
      <div
        id="hero-offer"
        className="mt-6 flex flex-col gap-4 rounded-xl bg-[#282828] p-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
      >
        <div className="flex items-center gap-4">
          <BlackFridayBadge size="sm" className="shrink-0" />
          <div>
            <p className="font-display text-[30px] uppercase leading-[0.9] text-white sm:text-[36px]">
              {offer.allSamePrice ? "Every size" : "Racks from"} <span className="text-brand-orange">${offer.price}</span>
            </p>
            <p className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-white/70 sm:text-[12px]">
              Was ${offer.compareAtPrice} · Sale ends {saleEndLabel()}
            </p>
          </div>
        </div>
        <ClaimRackButton label={saleCtaLabel(offer)} href={product.productUrl} className="w-full sm:w-auto sm:shrink-0" />
      </div>

      <div className="mt-8 border-l-4 border-nr-ink py-1 pl-5 sm:mt-10">
        <p className="mb-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-nr-ink-mid">Summary:</p>
        <p className="text-[17px] font-semibold leading-[1.55] text-nr-ink sm:text-[18px]">
          The JB Racks vertical hitch rack has 5 big benefits that&apos;ll ruin platform and roof racks for you forever.
        </p>
      </div>
    </header>
  );
}
