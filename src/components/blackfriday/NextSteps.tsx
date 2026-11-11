import Image from "next/image";
import type { ReactNode } from "react";
import { storeUrl } from "@/lib/config";
import { colors, type RackSize } from "@/lib/bikeRacks";
import type { BlackFridayOffer } from "@/lib/blackFriday";

// "How to order" section just above the closing CTA on
// /lp-demo-black-friday. Walks a first-time visitor through the product
// page they're about to land on: pick a size, pick a color, Add to Cart.
// Mirrors the real page (jbracks.com/products/4-e-bike-rack): sizes 4/5/6,
// colors Black / Velo Turquoise / Leaf Green, Shop Pay "pay in 4", free
// tracked delivery in 4-7 business days, customer assembly with the video
// + fitment guide (the page quotes 45-60 minutes), 30-day change-of-mind
// returns and the 4-year warranty. Prices are the live Shopify ones.
//
// Every step uses the same layout: kicker, title, one intro paragraph, then
// a row of identical cards (stacked as full-width rows on phones).

function BikeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="5" cy="11" r="4" />
      <circle cx="19" cy="11" r="4" />
      <path d="M5 11 9.5 4h6L19 11M9.5 4 12 11h-7M15.5 4l-3.5 7M8 2h3" />
    </svg>
  );
}

function Step({ n, kicker, title, intro, children, last = false }: { n: string; kicker: string; title: string; intro: ReactNode; children: ReactNode; last?: boolean }) {
  return (
    <li className="relative grid grid-cols-[40px_1fr] gap-4 sm:grid-cols-[56px_1fr] sm:gap-7">
      {/* Number + the rail joining it to the next step. */}
      <div className="flex flex-col items-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange font-display text-[24px] leading-none text-white sm:h-14 sm:w-14 sm:text-[32px]">
          {n}
        </span>
        {!last && <span className="mt-2 w-0.5 flex-1 bg-[repeating-linear-gradient(to_bottom,#d9d9d9_0_6px,transparent_6px_12px)]" aria-hidden />}
      </div>
      <div className={`min-w-0 ${last ? "" : "pb-12 sm:pb-16"}`}>
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-[13px]">{kicker}</p>
        <h3 className="mt-1.5 text-[24px] font-extrabold uppercase leading-[1.1] tracking-tighter text-brand-black sm:text-[32px]">{title}</h3>
        <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-brand-black/75">{intro}</p>
        <div className="mt-6">{children}</div>
      </div>
    </li>
  );
}

// The one card shape every step shares: media on top (left on phones),
// then a small "eyebrow" row, a condensed title, a line of detail and an
// optional footer.
const cardShell =
  "group relative flex overflow-hidden rounded-xl border-2 border-brand-line bg-white sm:flex-col";
const cardBody = "flex min-w-0 flex-1 flex-col justify-center px-4 py-3.5 sm:justify-start sm:px-5 sm:pb-5 sm:pt-4";
const cardTitle = "font-display text-[32px] uppercase leading-none text-brand-black sm:text-[38px]";
const cardDetail = "mt-1.5 text-[14px] leading-snug text-brand-black/65";

function CardImage({ src, alt, badge }: { src: string; alt: string; badge?: string }) {
  return (
    <div className="relative aspect-square w-[112px] shrink-0 bg-brand-cream sm:w-auto">
      {badge && (
        <span className="absolute left-2 top-2 z-10 whitespace-nowrap rounded-full bg-brand-black px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white sm:left-3 sm:top-3 sm:text-[10px]">
          {badge}
        </span>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 640px) 300px, 112px"
        loading="lazy"
        className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03] sm:p-4"
      />
    </div>
  );
}

const colorNotes: Record<string, string> = {
  Black: "Blends in with any vehicle",
  "Velo Turquoise": "Easy to spot at the trailhead",
  "Leaf Green": "An earthy, outdoorsy look",
};

const afterOrder = [
  {
    title: "Check out",
    body: "Pay in full, or split it into 4 payments with Shop Pay. Free mainland US shipping is applied automatically - no code needed.",
  },
  { title: "Your rack ships", body: "Free, tracked delivery to your door, typically in 4‑7 business days." },
  {
    title: "You assemble it",
    body: "The rack needs assembling when it arrives - allow about an hour, following the step-by-step video and fitment guide.",
  },
  {
    title: "Load up and ride",
    body: "Covered by 30-day change-of-mind returns and a 4-year warranty, with our support team a message away.",
  },
];

export function NextSteps({ rackSizes, offer }: { rackSizes: RackSize[]; offer: BlackFridayOffer }) {
  const four = rackSizes.find((r) => r.bikes === 4) ?? rackSizes[0];

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
          <Step
            n="1"
            kicker="Step 1 / Size"
            title="How many bikes do you carry?"
            intro={
              <>
                Count the bikes on your busiest trip, not your average one - a bigger rack still carries fewer bikes, but a smaller one can&apos;t stretch.
                {offer.allSamePrice && ` Right now every size is the same $${offer.price}, so sizing up costs nothing extra.`}
              </>
            }
          >
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {rackSizes.map((r) => (
                <a key={r.bikes} href={`${storeUrl}/products/${r.handle}`} className={`${cardShell} transition-colors hover:border-brand-black`}>
                  <CardImage src={r.imagesByColor.Black[0]} alt={`JB Racks ${r.bikes}-bike vertical rack`} badge={r.badge} />
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
                </a>
              ))}
            </div>
          </Step>

          <Step
            n="2"
            kicker="Step 2 / Color"
            title="Pick the color you love"
            intro="Same rack, same capacity and the same price in every color - it's purely down to looks. Tap one to open the rack in that color."
          >
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {colors.map((c) => (
                <a
                  key={c.name}
                  href={`${storeUrl}/products/${four.handle}?variant=${four.variants[c.name]}`}
                  className={`${cardShell} transition-colors hover:border-brand-black`}
                >
                  <CardImage src={four.imagesByColor[c.name][0]} alt={`JB Racks vertical rack in ${c.name}`} />
                  <div className={cardBody}>
                    <div className="flex h-4 items-center">
                      <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c.hex }} aria-hidden />
                    </div>
                    <p className={`mt-2 ${cardTitle}`}>{c.name}</p>
                    <p className={cardDetail}>{colorNotes[c.name]}</p>
                    <p className="mt-2 text-[16px] font-extrabold text-brand-black">${four.price}</p>
                  </div>
                </a>
              ))}
            </div>
          </Step>

          <Step
            n="3"
            kicker="Step 3 / Checkout"
            title="Add to cart - here's what happens next"
            intro="Once you've picked a size and color, here's what to expect from checkout to your first ride."
            last
          >
            <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {afterOrder.map((item, i) => (
                <li key={item.title} className={cardShell}>
                  {/* Letter tile in place of a photo, same footprint. */}
                  <div className="flex w-[64px] shrink-0 items-center justify-center bg-brand-cream sm:h-20 sm:w-auto">
                    <span className="font-display text-[34px] uppercase leading-none text-brand-orange sm:text-[40px]">{String.fromCharCode(65 + i)}</span>
                  </div>
                  <div className={cardBody}>
                    <p className="whitespace-nowrap font-display text-[28px] uppercase leading-none text-brand-black sm:text-[26px] lg:text-[24px]">{item.title}</p>
                    <p className={cardDetail}>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Step>
        </ol>
      </div>
    </section>
  );
}
