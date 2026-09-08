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
// directly beneath it, with a real live countdown to product.saleEndsAt —
// the same sale-end date already driving the countdown on /lp-demonstration
// — for genuine urgency rather than an invented scarcity claim.
export function FinalCta({ rackSizes }: FinalCtaProps) {
  const [display, setDisplay] = useState(() => getTimeLeft(product.saleEndsAt));

  useEffect(() => {
    const id = setInterval(() => setDisplay(getTimeLeft(product.saleEndsAt)), 1000);
    return () => clearInterval(id);
  }, []);

  const fromPrice = rackSizes?.[0]?.price;

  return (
    <div className="mx-5 mb-10 rounded-xl border border-brand-line bg-white px-6 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:mx-10 sm:px-10 sm:py-12">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white [animation:pulse-subtle_2s_ease-in-out_infinite]"
        style={{ background: "linear-gradient(135deg, var(--color-brand-orange) 0%, #f7931e 100%)" }}
      >
        ⚠ {fromPrice ? `$${fromPrice} pricing ends soon` : "Current pricing ends soon"}
      </span>

      <h2 className="mx-auto mt-5 max-w-[20ch] text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-tight text-brand-black">
        {finalCta.headline}
      </h2>
      <p className="mx-auto mt-4 max-w-[56ch] text-[15.5px] text-brand-black/60">{finalCta.body}</p>

      <div className="mt-6 flex items-start justify-center gap-1.5" suppressHydrationWarning>
        {units.map(({ key, label }, i) => (
          <div key={key} className="flex items-start gap-1.5">
            <div className="flex flex-col items-center">
              <span className="min-w-[2.2em] rounded-lg bg-brand-cream px-2.5 py-1.5 text-center text-lg font-black tabular-nums text-brand-black sm:text-xl">
                {String(display[key]).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[9px] font-extrabold uppercase tracking-wide text-brand-black/40">{label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="-mt-3.5 self-center text-lg font-black text-brand-black/20" aria-hidden>
                :
              </span>
            )}
          </div>
        ))}
      </div>

      <a
        href="#buy-box"
        className="mt-7 inline-block rounded-full bg-brand-green px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:opacity-90"
      >
        {finalCta.cta}
      </a>
    </div>
  );
}
