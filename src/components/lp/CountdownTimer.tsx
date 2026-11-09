"use client";

import { useNow } from "@/lib/useNow";

type CountdownTimerProps = {
  target: string;
  className?: string;
  // Flat inline text instead of the boxed/shadowed digit pills — for use in
  // subtler banners where the loud default treatment would fight the design.
  compact?: boolean;
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

export function CountdownTimer({ target, className = "", compact = false }: CountdownTimerProps) {
  const display = getTimeLeft(target, useNow());

  if (compact) {
    return (
      <div className={`flex items-baseline gap-1 text-[11.5px] font-bold tabular-nums text-white/85 sm:text-[13px] ${className}`}>
        {units.map(({ key, label }, i) => (
          <span key={key}>
            {String(display[key]).padStart(2, "0")}
            <span className="text-[9px] font-semibold text-white/50">{label.charAt(0).toLowerCase()}</span>
            {i < units.length - 1 && <span className="text-white/40"> : </span>}
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
            <span className="min-w-[2.2em] rounded-lg bg-white px-2.5 py-1.5 text-center text-lg font-black tabular-nums text-brand-red shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:text-xl">
              {String(display[key]).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[9px] font-extrabold uppercase tracking-wide text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="-mt-3.5 self-center text-lg font-black text-white" aria-hidden>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
