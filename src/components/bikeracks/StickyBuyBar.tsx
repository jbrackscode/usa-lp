"use client";

import { useEffect, useState } from "react";
import { stickyCta } from "@/lib/bikeRacksListicle";

// Shows once the hero CTA scrolls out of view, hides again once the buy box
// itself is on screen (no point stacking a sticky bar on top of the real one).
export function StickyBuyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const buyBox = document.getElementById("buy-box");
    if (!hero || !buyBox) return;

    let heroPast = false;
    let buyBoxVisible = false;

    const update = () => setVisible(heroPast && !buyBoxVisible);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        update();
      },
      { threshold: 0 }
    );
    const buyBoxObserver = new IntersectionObserver(
      ([entry]) => {
        buyBoxVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.1 }
    );

    heroObserver.observe(hero);
    buyBoxObserver.observe(buyBox);
    return () => {
      heroObserver.disconnect();
      buyBoxObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-brand-line bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-200 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <span className="min-w-0 truncate text-sm font-semibold text-brand-black">{stickyCta.text}</span>
      <a
        href="#buy-box"
        className="shrink-0 whitespace-nowrap rounded-full bg-brand-green px-5 py-3 text-sm font-black uppercase tracking-tight text-white"
      >
        {stickyCta.cta}
      </a>
    </div>
  );
}
