"use client";

import { useEffect, useState } from "react";
import { product } from "@/lib/config";
import { saleCtaLabel, saleEndLabel, type BlackFridayOffer } from "@/lib/blackFriday";

// Mobile-only sticky offer bar (teardown fix #1): ~95% of this page's
// traffic is on phones, and most of it never scrolls to the offer block.
// Slides up once the hero offer strip (#hero-offer) has scrolled off the
// top, and gets out of the way while the full offer block (#offer) or the
// closing card (#closing) is on screen, so it never doubles up on a CTA
// that's already visible.
export function StickySaleBar({ offer }: { offer: BlackFridayOffer }) {
  const [pastHero, setPastHero] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-offer");
    const ctas = ["offer", "closing"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!hero || !("IntersectionObserver" in window)) return;

    // Past the hero only once it's gone off the *top* (not when it's still
    // below the fold).
    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    heroIo.observe(hero);

    const visible = new Set<Element>();
    const ctaIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setCtaInView(visible.size > 0);
    });
    ctas.forEach((el) => ctaIo.observe(el));

    return () => {
      heroIo.disconnect();
      ctaIo.disconnect();
    };
  }, []);

  const show = pastHero && !ctaInView;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#282828] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[24px] uppercase leading-none text-white">
            {offer.allSamePrice ? "Every size" : "From"} <span className="text-brand-orange">${offer.price}</span>
          </p>
          <p className="mt-1 truncate font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white/65">
            <span className="text-brand-orange">+ Free strut</span> · Ends {saleEndLabel()}
          </p>
        </div>
        <a
          href={product.productUrl}
          tabIndex={show ? 0 : -1}
          className="shrink-0 rounded-full bg-brand-green px-4 py-3 text-center text-[14px] font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.25)]"
        >
          {saleCtaLabel(offer).replace(/ - \$\d+$/, "")}
        </a>
      </div>
    </div>
  );
}
