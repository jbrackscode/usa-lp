"use client";

import { useState } from "react";
import { storeUrl } from "@/lib/config";
import { colors, type RackSize } from "@/lib/bikeRacks";
import type { BlackFridayOffer } from "@/lib/blackFriday";
import { BikeIcon, CardImage, Step, cardBody, cardDetail, cardShell, cardTitle } from "./nextStepsParts";

const colorNotes: Record<string, string> = {
  Black: "Blends in with any vehicle",
  "Velo Turquoise": "Easy to spot at the trailhead",
  "Leaf Green": "An earthy, outdoorsy look",
};

// Steps 1 and 2 of NextSteps. Step 1's size cards are a picker (not links),
// and step 2's color cards link to the *selected* size in that color
// (/products/<size handle>?variant=<that size's variant ID>), with that
// size's photos - so someone who picks 5 or 6 bikes doesn't land on the
// 4-bike rack. Defaults to the 4-bike rack (the Most Popular size).
export function SizeColorSteps({ rackSizes, offer }: { rackSizes: RackSize[]; offer: BlackFridayOffer }) {
  const [bikes, setBikes] = useState<RackSize["bikes"]>(() => (rackSizes.find((r) => r.bikes === 4) ?? rackSizes[0]).bikes);
  const rack = rackSizes.find((r) => r.bikes === bikes) ?? rackSizes[0];

  return (
    <>
      <Step
        n="1"
        kicker="Step 1 / Size"
        title="How many bikes do you carry?"
        intro={
          <>
            Count the bikes on your busiest trip, not your average one - a bigger rack can carry fewer bikes, but a smaller one can&apos;t carry more.
            {offer.allSamePrice && ` Right now every size is the same $${offer.price}, so sizing up costs nothing extra.`} Tap your size and the color links below will
            match it.
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4" role="radiogroup" aria-label="Rack size">
          {rackSizes.map((r) => {
            const on = r.bikes === bikes;
            return (
              <button
                key={r.bikes}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setBikes(r.bikes)}
                className={`${cardShell} text-left transition-colors ${on ? "border-brand-black" : "hover:border-brand-black/40"}`}
              >
                <CardImage src={r.imagesByColor.Black[0]} alt={`JB Racks ${r.bikes}-bike vertical rack`} badge={r.badge} />
                {on && (
                  <span className="absolute bottom-2 left-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-[12px] font-black text-white sm:bottom-auto sm:left-auto sm:right-3 sm:top-3" aria-hidden>
                    ✓
                  </span>
                )}
                <div className={cardBody}>
                  <div className="flex h-4 items-center gap-0.5 text-brand-black sm:gap-1">
                    {Array.from({ length: r.bikes }, (_, i) => (
                      <BikeIcon key={i} className="h-3 w-[18px] sm:h-3.5 sm:w-5" />
                    ))}
                  </div>
                  <p className={`mt-2 ${cardTitle}`}>{r.bikes} Bikes</p>
                  <p className={cardDetail}>{r.sublabel}</p>
                  <p className="mt-2 text-[16px] font-extrabold text-brand-black">
                    ${r.price}
                    {r.compareAtPrice > r.price && <span className="ml-1.5 text-[14px] font-semibold text-brand-black/40 line-through">${r.compareAtPrice}</span>}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Step>

      <Step
        n="2"
        kicker="Step 2 / Color"
        title="Pick the color you love"
        intro={
          <>
            Same rack, same capacity and the same price in every color - it&apos;s purely down to looks. Tap one to open the{" "}
            <strong className="text-brand-black">{rack.bikes}-bike rack</strong> in that color.
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {colors.map((c) => (
            <a
              key={c.name}
              href={`${storeUrl}/products/${rack.handle}?variant=${rack.variants[c.name]}`}
              className={`${cardShell} transition-colors hover:border-brand-black`}
            >
              <CardImage src={rack.imagesByColor[c.name][0]} alt={`JB Racks ${rack.bikes}-bike vertical rack in ${c.name}`} />
              <div className={cardBody}>
                <div className="flex h-4 items-center">
                  <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c.hex }} aria-hidden />
                </div>
                <p className={`mt-2 ${cardTitle}`}>{c.name}</p>
                <p className={cardDetail}>
                  {rack.bikes}-bike rack · {colorNotes[c.name]}
                </p>
                <p className="mt-2 text-[16px] font-extrabold text-brand-black">${rack.price}</p>
              </div>
            </a>
          ))}
        </div>
      </Step>
    </>
  );
}
