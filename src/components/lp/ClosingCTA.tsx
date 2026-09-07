import { ClaimRackButton } from "./ClaimRackButton";
import { product } from "@/lib/config";

export function ClosingCTA() {
  return (
    <div className="mx-auto max-w-[520px] px-5 py-10 text-center sm:py-12">
      <div className="mb-3.5 flex items-center justify-center gap-2">
        <span className="text-xl tracking-[2px] text-brand-star" aria-hidden>
          ★★★★★
        </span>
        <span className="text-lg font-extrabold text-brand-black">4.7/5 — Trusted by 20,000+ Customers</span>
      </div>
      <ClaimRackButton label={`Claim My Rack - $${product.price}`} full />
      <p className="mt-4 text-sm text-brand-black/70">4-year warranty · Free shipping</p>
    </div>
  );
}
