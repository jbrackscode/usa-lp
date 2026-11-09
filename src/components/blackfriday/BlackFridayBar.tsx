import { CountdownTimer } from "@/components/lp/CountdownTimer";
import { product } from "@/lib/config";
import type { BlackFridayOffer } from "@/lib/blackFriday";
import { BlackFridayTicker } from "./BlackFridayTicker";

// Replaces the quiet PromoBar on /lp-demo-black-friday: the scrolling
// yellow sale strip, then a black "ends in" row with the live countdown.
export function BlackFridayBar({ offer }: { offer: BlackFridayOffer }) {
  return (
    <div>
      <BlackFridayTicker offer={offer} />
      <div className="flex flex-wrap items-center justify-center gap-2.5 bg-brand-black px-4 py-2 text-center sm:gap-3">
        <span className="whitespace-nowrap text-[11.5px] font-black uppercase tracking-wide text-brand-yellow sm:text-[13px]">
          Black Friday sale ends in
        </span>
        <CountdownTimer target={product.blackFridayEndsAt} compact />
      </div>
    </div>
  );
}
