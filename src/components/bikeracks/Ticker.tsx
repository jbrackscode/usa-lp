import { ticker } from "@/lib/bikeRacksListicle";

// Two identical, back-to-back copies of the same content, animated by
// exactly half the track's width (-50%, see globals.css) — when the first
// copy has fully scrolled off, the second is sitting exactly where the
// first started, so the loop point is pixel-identical and never visibly
// jumps or snaps.
export function Ticker() {
  return (
    <div className="overflow-hidden whitespace-nowrap border-b border-white/10 bg-brand-black py-2.5 text-[13px] text-white">
      <div className="flex w-max animate-[bikeracks-ticker_38s_linear_infinite]">
        <TickerSet />
        <TickerSet aria-hidden />
      </div>
    </div>
  );
}

function TickerSet({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean } = {}) {
  return (
    <div className="flex shrink-0" aria-hidden={ariaHidden}>
      {ticker.map((t, i) => (
        <span key={i} className="mr-12">
          {t}
        </span>
      ))}
    </div>
  );
}
