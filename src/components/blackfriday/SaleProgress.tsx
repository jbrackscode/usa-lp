"use client";

import { useNow } from "@/lib/useNow";
import { product } from "@/lib/config";

// Hollow Socks-style progress bar that sits with the countdown. It fills by
// how much of the Black Friday window has elapsed (blackFridayStartsAt →
// blackFridayEndsAt), not by units sold — there's no live stock/sales feed
// behind it — so the copy says "of the sale is over" rather than "% sold".
// Renders empty for the hydration frame (useNow is null), then fills.
export function SaleProgress({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const now = useNow();
  const start = new Date(product.blackFridayStartsAt).getTime();
  const end = new Date(product.blackFridayEndsAt).getTime();
  const pct = now === null ? 0 : Math.round(Math.min(1, Math.max(0, (now - start) / (end - start))) * 100);
  // Fixed time zone so server and client format the same date.
  const endLabel = new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" });

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <div className={`mb-2 flex items-baseline justify-between text-[13px] font-black uppercase tracking-wide ${tone === "dark" ? "text-white" : "text-brand-black"}`}>
        <span>
          <span aria-hidden>⏳ </span>
          {now === null ? "Black Friday sale" : `${pct}% of the sale is over`}
        </span>
        <span className={tone === "dark" ? "text-brand-yellow" : "text-brand-red"}>Ends {endLabel}</span>
      </div>
      <div
        className={`h-3.5 overflow-hidden rounded-full ${tone === "dark" ? "bg-white/15" : "bg-brand-black/10"}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Black Friday sale progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-red transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
