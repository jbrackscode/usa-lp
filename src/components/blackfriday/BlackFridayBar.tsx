import { CountdownTimer } from "@/components/lp/CountdownTimer";
import { product } from "@/lib/config";
import type { BlackFridayOffer } from "@/lib/blackFriday";
// import { BlackFridayTicker } from "./BlackFridayTicker";

// Top bar on /lp-demo-black-friday, modelled on the Hollow Socks countdown
// bar: a stacked "BLACK FRIDAY" lockup (tall condensed Tungsten title over a
// small mono offer line) beside a white panel timer with condensed digits
// and mono unit labels. The scrolling orange ticker that used to sit above
// it is commented out below.
export function BlackFridayBar({ offer }: { offer: BlackFridayOffer }) {
  return (
    <div>
      {/* Scrolling orange ticker hidden for now - uncomment this and the
          import above to bring it back. */}
      {/* <BlackFridayTicker offer={offer} /> */}
      <div className="flex items-center justify-center gap-3 bg-[#282828] px-4 py-2.5 sm:gap-5 sm:py-3">
        <div className="flex flex-col items-center">
          <span className="font-display text-[30px] uppercase leading-[0.85] text-white sm:text-[40px]">Black Friday</span>
          <span className="mt-1 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.14em] text-brand-orange sm:text-[13px]">
            {offer.allSamePrice ? `All sizes $${offer.price}` : `From $${offer.price}`}
          </span>
        </div>
        <CountdownTimer target={product.blackFridayEndsAt} panel />
      </div>
    </div>
  );
}
