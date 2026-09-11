import { CountdownTimer } from "./CountdownTimer";
import { product } from "@/lib/config";

type PromoBarProps = {
  // Live price for the 4 Bike Rack, same source /lp-vertical-bike-racks
  // uses (getLiveBikeRackData) — falls back to the static config price if
  // the caller doesn't have live data on hand.
  price?: number;
};

// A quiet, single-line notice bar — not the shouting red/orange gradient
// version this replaced. Still carries the real countdown, just doesn't
// compete with the rest of the page for attention.
export function PromoBar({ price = product.price }: PromoBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 bg-brand-black px-4 py-2 text-center sm:gap-3">
      <span className="whitespace-nowrap text-[11.5px] font-semibold tracking-wide text-white/90 sm:text-[13px]">
        ${price} 4 Bike Rack price ends soon
      </span>
      <span className="hidden h-3.5 w-px bg-white/20 sm:block" />
      <CountdownTimer target={product.saleEndsAt} compact />
    </div>
  );
}
