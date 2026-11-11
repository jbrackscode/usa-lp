"use client";

import Image from "next/image";
import { useState } from "react";
import { colors, type Color, type RackSize } from "@/lib/bikeRacks";

// Step 2 of NextSteps: the same three swatches the product page offers.
// Tapping one swaps the large photo to that color (4-bike rack shots, same
// images the store uses for each variant). All three images are rendered
// and cross-faded so switching is instant, not a fresh image load.
export function RackColorPicker({ rack }: { rack: RackSize }) {
  const [active, setActive] = useState<Color>("Black");

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[1.1fr_1fr] sm:gap-8">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-cream">
        {colors.map((c) => (
          <Image
            key={c.name}
            src={rack.imagesByColor[c.name][0]}
            alt={`JB Racks ${rack.bikes}-bike vertical rack in ${c.name}`}
            fill
            sizes="(min-width: 640px) 420px, 90vw"
            loading="lazy"
            className={`object-contain p-4 transition-opacity duration-500 ${active === c.name ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-brand-black">
          {active}
        </span>
      </div>

      <div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand-black/50">Tap a color to preview</p>
        <div className="mt-3 flex flex-col gap-2.5" role="radiogroup" aria-label="Rack color">
          {colors.map((c) => {
            const on = active === c.name;
            return (
              <button
                key={c.name}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setActive(c.name)}
                className={`flex items-center gap-3.5 rounded-xl border-2 px-3.5 py-3 text-left transition-colors ${
                  on ? "border-brand-black bg-white" : "border-brand-line bg-white hover:border-brand-black/40"
                }`}
              >
                <span
                  className={`h-8 w-8 shrink-0 rounded-full ring-offset-2 transition-shadow ${on ? "ring-2 ring-brand-black" : ""}`}
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <span className="text-[16px] font-bold text-brand-black">{c.name}</span>
                {on && <span className="ml-auto text-[13px] font-black text-brand-green">✓</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-brand-black/70">
          Same rack, same capacity, same price in every color - it&apos;s purely down to looks. Black blends in with most vehicles; Velo Turquoise and
          Leaf Green make it easy to spot at a busy trailhead.
        </p>
      </div>
    </div>
  );
}
