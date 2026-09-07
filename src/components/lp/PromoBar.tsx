import { CountdownTimer } from "./CountdownTimer";
import { product } from "@/lib/config";

// Matches the live page's .jbr-topbar: red-to-orange gradient with a diagonal
// stripe texture, price-ends-soon message, and a live countdown.
export function PromoBar() {
  return (
    <div
      className="relative flex flex-wrap items-center justify-center gap-4 overflow-hidden px-4 py-2.5 sm:gap-6 sm:px-5"
      style={{
        background: "linear-gradient(90deg, #ff1f3d, #ff6a13)",
        backgroundImage:
          "repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0 14px, transparent 14px 28px), linear-gradient(90deg, #ff1f3d, #ff6a13)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl text-white" aria-hidden>
          ⚠
        </span>
        <span className="whitespace-nowrap text-sm font-black uppercase tracking-wide text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] sm:text-2xl">
          ${product.price} 4 Bike Rack Price Ends <strong className="text-brand-yellow">Soon</strong>
        </span>
      </div>
      <div className="hidden h-8 w-px bg-white/40 sm:block" />
      <CountdownTimer target={product.saleEndsAt} />
    </div>
  );
}
