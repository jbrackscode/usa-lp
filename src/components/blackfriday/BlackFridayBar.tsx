import { CountdownTimer } from "@/components/lp/CountdownTimer";
import { product } from "@/lib/config";
import type { BlackFridayOffer } from "@/lib/blackFriday";
import { BlackFridayTicker } from "./BlackFridayTicker";

// Replaces the quiet PromoBar on /lp-demo-black-friday: the scrolling
// orange sale strip, then a black "ends in" row with the live countdown.
export function BlackFridayBar({ offer }: { offer: BlackFridayOffer }) {
  return (
    <div>
      <BlackFridayTicker offer={offer} />
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-brand-black px-4 py-2.5 text-center">
        <span className="whitespace-nowrap text-[15px] font-black uppercase tracking-wide text-brand-orange sm:text-[17px]">
          Black Friday sale ends in
        </span>
        <CountdownTimer target={product.blackFridayEndsAt} compact large />
      </div>
    </div>
  );
}
