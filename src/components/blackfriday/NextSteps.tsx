import type { RackSize } from "@/lib/bikeRacks";
import { freeGift, type BlackFridayOffer } from "@/lib/blackFriday";
import { Step, cardBody, cardDetail, cardShell } from "./nextStepsParts";
import { SizeColorSteps } from "./SizeColorSteps";

// "How to order" section just above the closing CTA on
// /lp-demo-black-friday. Walks a first-time visitor through the product
// page they're about to land on: pick a size, pick a color, Add to Cart.
// Mirrors the real page (jbracks.com/products/4-e-bike-rack): sizes 4/5/6,
// colors Black / Velo Turquoise / Leaf Green, Shop Pay "pay in 4", free
// tracked delivery in 4-7 business days, customer assembly with the video
// + fitment guide (the page quotes 45-60 minutes), 30-day change-of-mind
// returns and the 4-year warranty. Prices are the live Shopify ones.
//
// Steps 1-2 (size picker + color links that follow the chosen size) live
// in SizeColorSteps; shared step/card pieces in nextStepsParts.
//
// Every step uses the same layout: kicker, title, one intro paragraph, then
// a row of identical cards (stacked as full-width rows on phones).

const afterOrder = [
  {
    title: "Check out",
    body: "Your free Strut Twin Pack rides along at $0. Pay in full, or split it into 4 payments with Shop Pay - free mainland US shipping, no code needed.",
  },
  { title: "Your rack ships", body: "Free, tracked delivery to your door, typically in 4‑7 business days." },
  {
    title: "You assemble it",
    body: "The rack needs assembling when it arrives - allow 45‑60 minutes, following the step-by-step video and fitment guide.",
  },
  {
    title: "Load up and ride",
    body: "Covered by 30‑day change‑of‑mind returns and a 4‑year warranty, with our support team a message away.",
  },
];

export function NextSteps({ rackSizes, offer }: { rackSizes: RackSize[]; offer: BlackFridayOffer }) {
  return (
    <section className="border-t border-brand-line bg-white px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-[1000px]">
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-brand-black/55 sm:text-[13px]">How to order</p>
        <h2 className="mt-2 text-3xl font-extrabold uppercase leading-[1.1] tracking-tighter text-brand-black sm:text-5xl">
          A few steps and you&apos;re done
        </h2>
        <p className="mt-3 max-w-[640px] text-[17px] leading-relaxed text-brand-black/70">
          The product page only asks you for two things - how many bikes, and which color. Here&apos;s how to get both right before you click through.
        </p>

        {/* Hitch check: the one thing to confirm before choosing anything. */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-brand-line bg-brand-cream px-4 py-3.5 sm:items-center">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-black text-[11px] font-black text-white sm:mt-0" aria-hidden>
            !
          </span>
          <p className="text-[15px] leading-snug text-brand-black/80">
            <strong className="text-brand-black">Before you start:</strong> every size fits a 2&Prime; Class III hitch receiver - the most common size on US trucks and SUVs.
            Check your owner&apos;s manual if you&apos;re not sure.
          </p>
        </div>

        <ol className="mt-12">
          <SizeColorSteps rackSizes={rackSizes} offer={offer} />

          <Step
            n="3"
            kicker="Step 3 / Checkout"
            title="Add to cart - here's what happens next"
            intro={
              <>
                Once you&apos;ve picked a size and color, check the free <strong className="text-brand-black">{freeGift.name}</strong> is ticked under
                &ldquo;Complete the setup&rdquo; - it&apos;s on by default - then hit Add to Cart. Here&apos;s what to expect from there.
              </>
            }
            last
          >
            {/* A → B → C → D: an arrow badge sits in the gap between each
                card, pointing down on phones (stacked) and right on desktop
                (one row), centred on the letter tiles. Hidden on the 2-column
                tablet layout, where the order would zig-zag. */}
            <ol className="grid gap-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {afterOrder.map((item, i) => (
                <li key={item.title} className="relative">
                  <div className={`${cardShell} h-full`}>
                    {/* Letter tile in place of a photo, same footprint. */}
                    <div className="flex w-[64px] shrink-0 items-center justify-center bg-brand-cream sm:h-20 sm:w-auto">
                      <span className="font-display text-[34px] uppercase leading-none text-brand-orange sm:text-[40px]">{String.fromCharCode(65 + i)}</span>
                    </div>
                    <div className={cardBody}>
                      <p className="whitespace-nowrap font-display text-[28px] uppercase leading-none text-brand-black sm:text-[26px] lg:text-[24px]">{item.title}</p>
                      <p className={cardDetail}>{item.body}</p>
                    </div>
                  </div>
                  {i < afterOrder.length - 1 && (
                    <span
                      className="absolute -bottom-6 left-[20px] z-10 flex h-7 w-7 rotate-90 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_0_0_4px_#fff] sm:hidden lg:-right-[26px] lg:bottom-auto lg:left-auto lg:top-[28px] lg:flex lg:rotate-0"
                      aria-hidden
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Step>
        </ol>
      </div>
    </section>
  );
}
