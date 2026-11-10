"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { comparisonRows } from "@/lib/config";

type RevealState = "idle" | "armed" | "shown";

// Mobile layout for ComparisonTable: Apple-compare-style two columns under
// a sticky header naming each side, one row per topic, with the JB answer
// set big and black and the traditional one small and grey, so the
// contrast reads at a glance. Rows rise in one by one when the list scrolls
// into view (animation lives in globals.css under .cmp-list).
export function ComparisonMobile() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    // Only hide rows if they're still below the fold — if the list is
    // already on screen (deep link, reload mid-page) just leave it visible.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState("armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="cmp-list sm:hidden" data-state={state}>
      <div className="sticky top-0 z-10 grid grid-cols-2 gap-4 rounded-t-2xl border border-b-0 border-brand-line bg-white px-4 pb-3 pt-4 shadow-[0_6px_12px_-10px_rgba(0,0,0,0.25)]">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green">JB Racks</span>
          <p className="mt-0.5 text-[15px] font-extrabold leading-tight text-brand-black">Vertical Rack</p>
        </div>
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#a3a3a3]">Others</span>
          <p className="mt-0.5 text-[15px] font-bold leading-tight text-[#a3a3a3]">Traditional Rack</p>
        </div>
      </div>

      <ul className="overflow-hidden rounded-b-2xl border border-brand-line bg-white">
        {comparisonRows.map((row, i) => (
          <li
            key={row.label}
            className="cmp-row border-t border-[#ececec] px-4 pb-5 pt-4"
            style={{ "--i": i } as CSSProperties}
          >
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand-black/45">{row.label}</p>
            <div className="mt-2.5 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span
                  className="cmp-tick inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-[12px] font-black text-white"
                  style={{ "--i": i } as CSSProperties}
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-[16px] font-bold leading-snug text-brand-black">{row.vertical}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ececec] text-[11px] font-black text-[#a3a3a3]" aria-hidden>
                  ✕
                </span>
                <span className="text-[14px] leading-snug text-[#9a9a9a]">{row.traditional}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
