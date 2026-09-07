import { bundle } from "@/lib/bikeRacksListicle";
import type { RackSize, Addons } from "@/lib/bikeRacks";

type BundleOfferProps = {
  rackSizes: RackSize[];
  addons: Addons;
};

// Line items and savings are pulled from the same live-fetched Shopify data
// the buy box uses (rack compare-at + Garage Stand + Slow-Fold Strut vs. the
// actual bundle SKU price), not hardcoded — so this can't drift out of sync
// with what checkout actually charges.
export function BundleOffer({ rackSizes, addons }: BundleOfferProps) {
  const rack = rackSizes[0]; // base rack compare-at is the same across sizes
  const bundlePrice = rack.fullBundle.price;
  const listTotal = rack.compareAtPrice + addons.garageStand.compareAtPrice + addons.slowFoldStrut.price;
  const savings = listTotal - bundlePrice;

  return (
    <div className="border-y border-brand-line bg-white py-12 sm:py-14">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-11 px-6 lg:grid-cols-2">
        <div>
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">{bundle.eyebrow}</div>
          <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-brand-black sm:text-5xl leading-[1.15]">{bundle.headline}</h2>
          <p className="mt-3.5 max-w-[48ch] text-[15px] text-brand-black/70">{bundle.body}</p>

          <div className="mt-5">
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-brand-line">
              <div className="h-full w-[68%] rounded-full bg-brand-green" />
            </div>
            <div className="text-[12.5px] text-brand-black/60">{bundle.barLabel}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
          <div className="flex justify-between border-b border-dashed border-brand-line py-2.5 text-[14.5px]">
            <span>Rack</span>
            <span>${rack.compareAtPrice}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-brand-line py-2.5 text-[14.5px]">
            <span>Garage Stand</span>
            <span>${addons.garageStand.compareAtPrice}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-brand-line py-2.5 text-[14.5px]">
            <span>Slow-Fold Strut</span>
            <span>${addons.slowFoldStrut.price}</span>
          </div>
          <div className="flex justify-between pt-3.5 text-lg font-extrabold text-brand-black">
            <span>Bundle price</span>
            <span>
              ${bundlePrice} <span className="text-brand-green-dark">(save ${savings})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
