"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={itemCount > 0 ? `View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "View cart"}
      className="relative inline-flex h-9 w-9 items-center justify-center text-brand-black/70 hover:text-brand-green"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-green px-1 text-[10px] font-bold leading-none text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
