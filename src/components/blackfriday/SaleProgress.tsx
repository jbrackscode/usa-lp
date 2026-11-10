"use client";

import { useNow } from "@/lib/useNow";
import { product } from "@/lib/config";

// Hollow Socks-style progress bar that sits with the countdown. It fills by
// how much of the Black Friday window has elapsed (blackFridayStartsAt →
// blackFridayEndsAt), not by units sold — there's no live stock/sales feed
// behind it — so the copy says "of the sale is over" rather than "% sold".
// Renders empty for the hydration frame (useNow is null), then fills.
// "light" is the quieter supporting version for light backgrounds (the
// closing CTA card): smaller dark labels — no orange/red small text on
// white, which fails contrast — and a thinner bar, so it never competes
// with the button above it.
export function SaleProgress({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  const now = useNow();
  const start = new Date(product.blackFridayStartsAt).getTime();
  const end = new Date(product.blackFridayEndsAt).getTime();
  const pct = now === null ? 0 : Math.round(Math.min(1, Math.max(0, (now - start) / (end - start))) * 100);
  // Fixed time zone so server and client format the same date.
  const endLabel = new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" });

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <div
        className={`flex items-baseline justify-between uppercase tracking-wide ${light ? "mb-1.5 text-[12px] font-bold text-brand-black/70" : "mb-2 text-[13px] font-black text-white"}`}
      >
        <span className="whitespace-nowrap">
          <span aria-hidden>⏳ </span>
          {now === null ? "Black Friday sale" : `${pct}% of the sale is over`}
        </span>
        {/* The light version always sits under its own countdown, which
            already says when the sale ends — and on phones the extra label
            forced both onto two lines. */}
        {!light && <span className="text-brand-orange">Ends {endLabel}</span>}
      </div>
      <div
        className={`overflow-hidden rounded-full ${light ? "h-2 bg-brand-black/10" : "h-3.5 bg-white/15"}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Black Friday sale progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-red transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
