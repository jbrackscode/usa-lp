import Image from "next/image";
import { freeGift } from "@/lib/blackFriday";

// The free Slow-Fold Strut Twin Pack, styled after the product page so the
// gift looks the same here as it does once they click through.

export function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

// "🎁 FREE STRUT INCLUDED  [$100 VALUE]" - the product page's badge: a
// black pill with an orange ring, gift icon and orange value chip.
export function FreeGiftBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-brand-black py-1.5 pl-1.5 pr-1.5 text-white shadow-[0_0_0_2px_#ff6000,0_4px_14px_rgba(255,96,0,0.35)] ${className}`}
    >
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange">
        <GiftIcon className="h-4 w-4" />
      </span>
      <span className="whitespace-nowrap text-[13px] font-black uppercase tracking-wide sm:text-[14px]">Free strut included</span>
      <span className="whitespace-nowrap rounded-full bg-brand-orange px-2.5 py-1 text-[11px] font-black uppercase text-brand-black sm:text-[12px]">
        ${freeGift.value} value
      </span>
    </span>
  );
}

// The "Complete the setup" row from the product page: photo, name,
// "FREE $100" and a FREE GIFT tag.
export function FreeGiftCard({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center gap-3 rounded-xl border-2 border-brand-orange bg-[#fff6f0] p-2.5 pr-3 text-left ${className}`}>
      <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-brand-orange px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-white">
        <GiftIcon className="h-3 w-3" />
        Free gift
      </span>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
        {/* The product shot is mostly faded-out car, with the struts in its
            lower-left - zoom in on them so they read at 64px. */}
        <Image src={freeGift.image} alt={`JB Racks ${freeGift.name}`} fill sizes="160px" className="origin-[40%_52%] scale-[2.2] object-contain" />
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-extrabold leading-tight text-brand-black">{freeGift.name}</p>
        <p className="mt-0.5 text-[15px] font-black text-brand-green-dark">
          FREE <span className="ml-1 font-semibold text-brand-black/45 line-through">${freeGift.value}</span>
        </p>
        <p className="text-[12.5px] font-semibold text-brand-black/65">Included free with every rack - slows the fold so it never slams down</p>
      </div>
    </div>
  );
}
