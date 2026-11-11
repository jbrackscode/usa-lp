import Image from "next/image";
import type { ReactNode } from "react";
import { storeUrl } from "@/lib/config";
import type { RackSize } from "@/lib/bikeRacks";
import type { BlackFridayOffer } from "@/lib/blackFriday";
import { RackColorPicker } from "./RackColorPicker";

// "What happens next" section just above the closing CTA on
// /lp-demo-black-friday. Walks a first-time visitor through the product
// page they're about to land on: it only asks for a size and a color, then
// Add to Cart. Mirrors the real page (jbracks.com/products/4-e-bike-rack):
// sizes 4/5/6, colors Black / Velo Turquoise / Leaf Green, free delivery in
// 4-7 business days, 30-day change-of-mind returns, 4-year warranty. Prices
// are the live Shopify ones passed in from the page.

function BikeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="5" cy="11" r="4" />
      <circle cx="19" cy="11" r="4" />
      <path d="M5 11 9.5 4h6L19 11M9.5 4 12 11h-7M15.5 4l-3.5 7M8 2h3" />
    </svg>
  );
}

function Step({ n, kicker, title, children, last = false }: { n: string; kicker: string; title: string; children: ReactNode; last?: boolean }) {
  return (
    <li className="relative grid grid-cols-[40px_1fr] gap-4 sm:grid-cols-[56px_1fr] sm:gap-7">
      {/* Number + the rail joining it to the next step. */}
      <div className="flex flex-col items-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange font-display text-[24px] leading-none text-white sm:h-14 sm:w-14 sm:text-[32px]">
          {n}
        </span>
        {!last && <span className="mt-2 w-0.5 flex-1 bg-[repeating-linear-gradient(to_bottom,#d9d9d9_0_6px,transparent_6px_12px)]" aria-hidden />}
      </div>
      <div className={last ? "" : "pb-12 sm:pb-16"}>
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-[13px]">{kicker}</p>
        <h3 className="mt-1.5 text-[24px] font-extrabold uppercase leading-[1.1] tracking-tighter text-brand-black sm:text-[32px]">{title}</h3>
        <div className="mt-5">{children}</div>
      </div>
    </li>
  );
}

const afterOrder = [
  { title: "Free delivery", body: "Arrives in 4-7 business days, tracked to your door (mainland US)." },
  { title: "Simple assembly", body: "A step-by-step assembly video and fitment guide come with every rack." },
  { title: "30-day returns", body: "Not the right fit? Send it back within 30 days of delivery for a full refund." },
  { title: "4-year warranty", body: "Every rack is covered, backed by our support team." },
];

export function NextSteps({ rackSizes, offer }: { rackSizes: RackSize[]; offer: BlackFridayOffer }) {
  const four = rackSizes.find((r) => r.bikes === 4) ?? rackSizes[0];

  return (
    <section className="border-t border-brand-line bg-white px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-[1000px]">
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-brand-black/55 sm:text-[13px]">How to order</p>
        <h2 className="mt-2 text-3xl font-extrabold uppercase leading-[1.1] tracking-tighter text-brand-black sm:text-5xl">
          Two choices and you&apos;re done
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
          <Step n="1" kicker="Step 1 / Size" title="How many bikes do you carry?">
            <p className="max-w-[640px] text-[16px] leading-relaxed text-brand-black/75">
              Count the bikes on your busiest trip, not your average one - a bigger rack still carries fewer bikes, but a smaller one can&apos;t stretch.
              {offer.allSamePrice && ` Right now every size is the same $${offer.price}, so sizing up costs nothing extra.`}
            </p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-3 sm:gap-5">
              {rackSizes.map((r) => (
                <a
                  key={r.bikes}
                  href={`${storeUrl}/products/${r.handle}`}
                  className="group relative flex overflow-hidden sm:flex-col rounded-xl border-2 border-brand-line bg-white transition-colors hover:border-brand-black"
                >
                  {r.badge && (
                    <span className="absolute left-2 top-2 z-10 whitespace-nowrap sm:left-1/2 sm:-translate-x-1/2 rounded-full bg-brand-black px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white sm:text-[10px]">
                      {r.badge}
                    </span>
                  )}
                  <div className="relative aspect-square w-[118px] shrink-0 bg-brand-cream sm:w-auto">
                    <Image
                      src={r.imagesByColor.Black[0]}
                      alt={`JB Racks ${r.bikes}-bike vertical rack`}
                      fill
                      sizes="(min-width: 640px) 300px, 30vw"
                      loading="lazy"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03] sm:p-4"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center px-4 py-3 sm:items-center sm:px-3 sm:pb-5 sm:pt-3 sm:text-center">
                    <div className="flex gap-0.5 text-brand-black sm:gap-1">
                      {Array.from({ length: r.bikes }, (_, i) => (
                        <BikeIcon key={i} className="h-3 w-[18px] sm:h-3.5 sm:w-5" />
                      ))}
                    </div>
                    <p className="mt-2 font-display text-[36px] uppercase leading-none text-brand-black sm:text-[44px]">{r.bikes} Bikes</p>
                    <p className="mt-1 text-[14px] leading-tight text-brand-black/60">{r.sublabel}</p>
                    <p className="mt-2 text-[17px] font-extrabold text-brand-black">
                      ${r.price}
                      {r.compareAtPrice > r.price && (
                        <span className="ml-1.5 text-[14px] font-semibold text-brand-black/40 line-through">${r.compareAtPrice}</span>
                      )}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </Step>

          <Step n="2" kicker="Step 2 / Color" title="Pick the color you love">
            <RackColorPicker rack={four} />
          </Step>

          <Step n="3" kicker="Step 3 / Done" title="Add to cart - we handle the rest" last>
            <div className="grid gap-3 sm:grid-cols-2">
              {afterOrder.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-xl border border-brand-line px-4 py-4">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-[11px] font-black text-white" aria-hidden>
                    ✓
                  </span>
                  <div>
                    <p className="text-[16px] font-extrabold text-brand-black">{item.title}</p>
                    <p className="mt-0.5 text-[14.5px] leading-snug text-brand-black/70">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Step>
        </ol>
      </div>
    </section>
  );
}
