import { ClaimRackButton } from "./ClaimRackButton";
import { product } from "@/lib/config";

type ClosingCTAProps = {
  // Live 4 Bike Rack price, same source /lp-vertical-bike-racks uses —
  // falls back to the static config price if the caller doesn't have it.
  price?: number;
};

export function ClosingCTA({ price = product.price }: ClosingCTAProps) {
  return (
    <div className="mx-auto max-w-[520px] px-5 pb-[39px] pt-[30px] text-center sm:pb-[52px] sm:pt-10">
      <div className="mb-3.5 flex items-center justify-center gap-2">
        <span className="text-xl tracking-[2px] text-brand-star" aria-hidden>
          ★★★★★
        </span>
        <span className="text-lg font-extrabold text-brand-black">4.7/5 — Trusted by 20,000+ Customers</span>
      </div>
      <ClaimRackButton label={`Claim My Rack - $${price}`} full />
      <p className="mt-4 text-sm text-brand-black/70">4-year warranty · Free shipping</p>
    </div>
  );
}
