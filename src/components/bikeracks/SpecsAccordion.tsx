"use client";

import { useState } from "react";
import { specs } from "@/lib/verticalRackPdp";

// Compact variant meant to live inside the BuyBox details column, right
// under the bordered/shadowed buy panel — not a full-width page section.
export function SpecsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-6">
      <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-brand-black">Specs</div>
      <div>
        {specs.map((spec, index) => {
          const open = openIndex === index;
          return (
            <div key={spec.title} className="border-b border-brand-line">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-3 text-left"
              >
                <span className="text-sm font-bold text-brand-black">{spec.title}</span>
                <span className={`shrink-0 text-brand-black transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
                  ▾
                </span>
              </button>
              {open && (
                <div className="flex flex-col gap-2 pb-3.5">
                  {spec.body.map((p) => (
                    <p key={p} className="text-[13px] leading-relaxed text-brand-black/70">
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
