import { offerPriceLine, type BlackFridayOffer } from "@/lib/blackFriday";

// Yellow scrolling sale strip at the very top of /lp-demo-black-friday.
// Same two-copy -50% loop as the bikeracks Ticker (see globals.css), so the
// loop point never visibly jumps. Every number comes from live pricing.
export function BlackFridayTicker({ offer }: { offer: BlackFridayOffer }) {
  const items = [
    "Black Friday Sale",
    "Our biggest sale of the year",
    offerPriceLine(offer),
    `Save up to $${offer.maxSavings}`,
    "Free US shipping",
    "4-Year warranty",
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap bg-brand-orange py-2.5 text-[13px] font-black uppercase tracking-wide text-white sm:text-sm">
      <div className="flex w-max animate-[bikeracks-ticker_32s_linear_infinite] motion-reduce:animate-none">
        <TickerSet items={items} />
        <TickerSet items={items} aria-hidden />
      </div>
    </div>
  );
}

function TickerSet({ items, "aria-hidden": ariaHidden }: { items: string[]; "aria-hidden"?: boolean }) {
  return (
    <div className="flex shrink-0" aria-hidden={ariaHidden}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5">{t}</span>
          <span aria-hidden>★</span>
        </span>
      ))}
    </div>
  );
}
