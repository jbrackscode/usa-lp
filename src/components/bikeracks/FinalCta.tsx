"use client";

import { useEffect, useState } from "react";
import { finalCta } from "@/lib/bikeRacksListicle";
import { product } from "@/lib/config";
import type { RackSize } from "@/lib/bikeRacks";

function getTimeLeft(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const units: { key: keyof ReturnType<typeof getTimeLeft>; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

type FinalCtaProps = {
  rackSizes?: RackSize[];
};

// White card (not black) so it doesn't visually merge into the black footer
// directly beneath it. This is the last thing a shopper sees before they've
// already read the reviews, warranty, and comparison table above — so the
// copy leads with a confident close, not another sales push. The countdown
// to product.saleEndsAt is real (the same date driving /lp-demonstration's
// countdown), so it stays, but as a quiet aside near the button rather than
// an alarm-style badge up top.
export function FinalCta({ rackSizes }: FinalCtaProps) {
  const [display, setDisplay] = useState(() => getTimeLeft(product.saleEndsAt));

  useEffect(() => {
    const id = setInterval(() => setDisplay(getTimeLeft(product.saleEndsAt)), 1000);
    return () => clearInterval(id);
  }, []);

  const fromPrice = rackSizes?.[0]?.price;

  return (
    <div className="mx-5 mb-10 rounded-xl border border-brand-line bg-white px-6 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:mx-10 sm:px-10 sm:py-12">
      <h2 className="mx-auto max-w-[20ch] text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-tight text-brand-black">
        {finalCta.headline}
      </h2>
      <p className="mx-auto mt-4 max-w-[56ch] text-[15.5px] text-brand-black/60">{finalCta.body}</p>

      <a
        href="#buy-box"
        className="mt-7 inline-block rounded-full bg-brand-green px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:opacity-90"
      >
        {fromPrice ? `Find your size — from $${fromPrice}` : finalCta.cta}
      </a>

      <div className="mt-5 flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-brand-black/40">
          {fromPrice ? `Current $${fromPrice} pricing holds for:` : "Current pricing holds for:"}
        </span>
        <div className="flex items-start gap-1.5" suppressHydrationWarning>
          {units.map(({ key, label }, i) => (
            <div key={key} className="flex items-start gap-1">
              <div className="flex flex-col items-center">
                <span className="min-w-[2em] rounded-md bg-brand-cream px-2 py-1 text-center text-sm font-bold tabular-nums text-brand-black/70">
                  {String(display[key]).padStart(2, "0")}
                </span>
                <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-brand-black/30">{label}</span>
              </div>
              {i < units.length - 1 && (
                <span className="-mt-2.5 self-center text-sm font-bold text-brand-black/20" aria-hidden>
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
