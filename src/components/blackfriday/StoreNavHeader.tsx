"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/lp/Logo";
import { CartIcon } from "@/components/cart/CartIcon";
import { storeNavItems, STORE_NAV_INLINE_COUNT, type StoreNavItem } from "@/lib/storeNav";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Copy of the LP Header for /lp-demo-black-friday with a full store nav in
// place of the lone "Back to store" link. Desktop (lg+): the first
// STORE_NAV_INLINE_COUNT items inline, the rest under an "Explore"
// dropdown. Below lg there isn't room for six inline links, so every item
// lives in a menu panel instead. Clicks fire a GA4 nav_click event so we
// can see how much traffic the nav sends back to the store.
export function StoreNavHeader() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  const inline = storeNavItems.slice(0, STORE_NAV_INLINE_COUNT);
  const overflow = storeNavItems.slice(STORE_NAV_INLINE_COUNT);

  useEffect(() => {
    if (!exploreOpen && !menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExploreOpen(false);
        setMenuOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [exploreOpen, menuOpen]);

  return (
    <header className="relative z-30 border-b border-brand-line bg-white">
      {/* Link padding tightens between lg and xl so six items + Explore
          still fit on one line at 1024px. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo className="w-28 shrink-0 sm:w-32" />

        <nav aria-label="Store" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {inline.map((item, i) => (
              <li key={item.id}>
                <NavLink
                  item={item}
                  position={i + 1}
                  className="block whitespace-nowrap rounded-full px-2 py-2 text-[14px] font-semibold text-brand-black/80 hover:bg-brand-cream hover:text-brand-black xl:px-3"
                />
              </li>
            ))}
            {overflow.length > 0 && (
              <li>
                <div ref={exploreRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={exploreOpen}
                    aria-controls="store-nav-explore"
                    onClick={() => setExploreOpen((o) => !o)}
                    className="flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-2 text-[14px] xl:px-3 font-semibold text-brand-black/80 hover:bg-brand-cream hover:text-brand-black"
                  >
                    Explore
                    <Chevron open={exploreOpen} />
                  </button>
                  {exploreOpen && (
                    <ul
                      id="store-nav-explore"
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-brand-line bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
                    >
                      {overflow.map((item, i) => (
                        <li key={item.id}>
                          <NavLink
                            item={item}
                            position={STORE_NAV_INLINE_COUNT + i + 1}
                            className="block rounded-lg px-3 py-2.5 text-[14px] font-semibold text-brand-black/80 hover:bg-brand-cream hover:text-brand-black"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <CartIcon />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="store-nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center text-brand-black/70 hover:text-brand-green lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="store-nav-menu" aria-label="Store" className="border-t border-brand-line bg-white lg:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-3 py-3 sm:px-5">
            {storeNavItems.map((item, i) => (
              <li key={item.id}>
                <NavLink item={item} position={i + 1} className="block rounded-lg px-3 py-3 text-[15px] font-semibold text-brand-black hover:bg-brand-cream" />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function NavLink({ item, position, className }: { item: StoreNavItem; position: number; className: string }) {
  return (
    <a
      href={item.href}
      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => window.gtag?.("event", "nav_click", { nav_item: item.id, nav_position: position, nav_destination: item.href })}
      className={className}
    >
      {item.label}
    </a>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
