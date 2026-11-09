import type { BlackFridayOffer } from "@/lib/blackFriday";

// Small reminder row after the reviews, so the Black Friday price stays in
// view on the way down to the FAQ.
export function SaleChips({ offer }: { offer: BlackFridayOffer }) {
  const chips = [
    `Black Friday: ${offer.allSamePrice ? "all sizes" : "from"} $${offer.price}`,
    "Free US shipping",
    "4-Year warranty",
    "20,000+ riders",
  ];

  return (
    <div className="mx-auto flex max-w-[1000px] flex-wrap justify-center gap-2 px-5 py-6">
      {chips.map((chip, i) => (
        <span
          key={chip}
          className={`rounded-full px-4 py-2 text-[12.5px] font-black uppercase tracking-wide sm:text-[13px] ${
            i === 0 ? "bg-brand-yellow text-brand-black" : "bg-brand-black text-white"
          }`}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
