"use client";

import { useNow } from "@/lib/useNow";

type CountdownTimerProps = {
  target: string;
  className?: string;
  // Flat inline text instead of the boxed/shadowed digit pills — for use in
  // subtler banners where the loud default treatment would fight the design.
  compact?: boolean;
  // ~30% larger digits/labels in either variant (/lp-demo-black-friday).
  large?: boolean;
  // Compact variant only: dark text for light backgrounds (default is white
  // text for the dark promo bars).
  onLight?: boolean;
  // A single white panel with tall condensed (Tungsten) digits and small
  // mono labels under each — the Hollow Socks-style bar timer used at the
  // top of /lp-demo-black-friday. Takes precedence over `compact`.
  panel?: boolean;
};

// nowMs is null on the server/hydration pass (see useNow) — renders zeros
// for that one frame so server and client HTML match.
function getTimeLeft(target: string, nowMs: number | null) {
  const diff = nowMs === null ? 0 : Math.max(0, new Date(target).getTime() - nowMs);
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

export function CountdownTimer({ target, className = "", compact = false, large = false, onLight = false, panel = false }: CountdownTimerProps) {
  const display = getTimeLeft(target, useNow());

  if (panel) {
    return (
      <div className={`flex items-start gap-1 rounded-md bg-white px-2.5 pb-1.5 pt-2 text-brand-black sm:gap-1.5 sm:px-3.5 ${className}`}>
        {units.map(({ key, label }, i) => (
          <div key={key} className="flex items-start gap-1 sm:gap-1.5">
            <div className="flex flex-col items-center">
              {/* Fixed width per pair: Tungsten's digits aren't tabular, so
                  without it the panel would jitter every second. */}
              <span className="font-display min-w-[1.15em] text-center text-[26px] uppercase leading-[0.85] sm:text-[34px]">
                {String(display[key]).padStart(2, "0")}
              </span>
              <span className="mt-1 font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.04em] sm:text-[12px]">{label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="font-display text-[20px] leading-[0.85] sm:text-[26px]" aria-hidden>
                :
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className={`flex items-baseline gap-1 font-bold tabular-nums ${onLight ? "text-brand-black" : "text-white/85"} ${large ? "text-[15px] sm:text-[17px]" : "text-[11.5px] sm:text-[13px]"} ${className}`}
      >
        {units.map(({ key, label }, i) => (
          <span key={key}>
            {String(display[key]).padStart(2, "0")}
            <span className={`font-semibold ${onLight ? "text-brand-black/55" : "text-white/50"} ${large ? "text-[12px]" : "text-[9px]"}`}>
              {label.charAt(0).toLowerCase()}
            </span>
            {i < units.length - 1 && <span className={onLight ? "text-brand-black/30" : "text-white/40"}> : </span>}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-1.5 ${className}`}>
      {units.map(({ key, label }, i) => (
        <div key={key} className="flex items-start gap-1.5">
          <div className="flex flex-col items-center">
            <span
              className={`min-w-[2.2em] rounded-lg bg-white text-center font-black tabular-nums text-brand-red shadow-[0_3px_0_rgba(0,0,0,0.25)] ${large ? "px-3 py-2 text-2xl sm:text-[26px]" : "px-2.5 py-1.5 text-lg sm:text-xl"}`}
            >
              {String(display[key]).padStart(2, "0")}
            </span>
            <span
              className={`mt-1 font-extrabold uppercase tracking-wide text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] ${large ? "text-[12px]" : "text-[9px]"}`}
            >
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className={`self-center font-black text-white ${large ? "-mt-4 text-2xl" : "-mt-3.5 text-lg"}`} aria-hidden>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
