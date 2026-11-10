import { CountdownTimer } from "@/components/lp/CountdownTimer";
import { ClaimRackButton } from "@/components/lp/ClaimRackButton";
import { product, storeUrl } from "@/lib/config";
import { offerPriceLine, type BlackFridayOffer as Offer } from "@/lib/blackFriday";
import { SaleProgress } from "./SaleProgress";

// Black Friday version of PricingSection — full-bleed black band, low in
// the article, with the countdown + sale-progress bar and the offer card.
// Its own highlight list rather than pricingHighlights, whose Affirm line is
// hard-coded to an old price. id="offer" is the editor's-note jump target.
const highlights = [
  "E-bike rated - 65 lbs per wheel holder, 240 lbs total capacity",
  "4-Year warranty on every rack",
  "Free shipping to city & suburban areas",
  "Trusted by 20,000+ customers",
];

export function BlackFridayOffer({ offer }: { offer: Offer }) {
  return (
    <div id="offer" className="scroll-mt-4 bg-brand-black px-5 py-12 text-center text-white sm:py-16">
      <span className="inline-block -rotate-2 rounded bg-brand-yellow px-3 py-1 text-[13px] font-black uppercase tracking-widest text-brand-black sm:text-sm">
        Black Friday<span className="hidden sm:inline"> · Our biggest sale of the year</span>
      </span>
      <h2 className="mx-auto mt-4 max-w-[800px] text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] sm:text-5xl">
        {offer.allSamePrice ? "Every rack size, one price: " : "Every rack size from "}
        <span className="text-brand-yellow">${offer.price}</span>
      </h2>
      <p className="mx-auto mt-2.5 max-w-[560px] text-base text-white/65">
        {offerPriceLine(offer)}, down from ${offer.compareAtPrice} - while the Black Friday sale lasts.
      </p>

      <div className="mx-auto mt-7 flex flex-col items-center gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/60">Sale ends in</span>
        <CountdownTimer target={product.blackFridayEndsAt} large />
      </div>
      <div className="mt-6">
        <SaleProgress />
      </div>

      <div className="relative mx-auto mt-10 max-w-[480px] rounded-[14px] border-4 border-brand-yellow bg-white px-6 py-8 text-brand-black">
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-red px-4 py-1 text-[13px] font-black uppercase tracking-wide text-white">
          {offer.maxPercentOff}% Off · Black Friday
        </span>
        <div className="flex items-baseline justify-center gap-3">
          <span className="text-[52px] font-extrabold leading-none">${offer.price}</span>
          <span className="text-[22px] text-[#a3a3a3] line-through">${offer.compareAtPrice}</span>
        </div>
        <span className="mt-2 inline-block rounded-full bg-brand-yellow px-3 py-1.5 text-[13px] font-black uppercase text-brand-black">
          You save ${offer.maxSavings}
        </span>

        <ul className="mt-6 space-y-1.5 text-left">
          {highlights.map((line) => (
            <li key={line} className="flex items-center gap-2.5 py-1.5 text-[14.5px] text-[#333]">
              <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-black text-[11px] text-brand-yellow" aria-hidden>
                ✓
              </span>
              {line}
            </li>
          ))}
        </ul>

        <ClaimRackButton label={`Claim My Rack - $${offer.price}`} full className="mt-6" href={product.productUrl} />
        {/* The button goes to the 4-bike rack's product page, so the other
            sizes in the same offer get their own direct links. */}
        <p className="mt-3 text-[13px] text-[#666]">
          Need more room? {offer.allSamePrice ? `Same $${offer.price} price on the` : "Also on sale: the"}{" "}
          <a href={`${storeUrl}/products/5-e-bike-rack`} className="font-bold text-brand-black underline underline-offset-2">
            5-bike
          </a>{" "}
          and{" "}
          <a href={`${storeUrl}/products/6-e-bike-rack`} className="font-bold text-brand-black underline underline-offset-2">
            6-bike
          </a>{" "}
          racks.
        </p>
        <p className="mt-2 text-xs text-[#999]">Free shipping, no code needed.</p>
      </div>
    </div>
  );
}
