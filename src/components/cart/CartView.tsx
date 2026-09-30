"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { PaymentIcons } from "@/components/bikeracks/PaymentIcons";
import { storeUrl } from "@/lib/config";

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function CartView() {
  const { cart, loading, updateLine, removeLine } = useCart();

  if (loading && !cart) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-brand-black/50 sm:px-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black sm:text-5xl">Your Cart</h1>
        <p className="mt-3">Loading your cart…</p>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black sm:text-5xl">Your Cart</h1>
        <p className="mt-3 text-brand-black/60">Your cart is empty.</p>
        <Link
          href={`${storeUrl}/collections/bike-racks`}
          className="mt-6 inline-flex items-center rounded-full bg-brand-green px-8 py-3.5 text-sm font-black uppercase tracking-tight text-white hover:opacity-90"
        >
          Shop bike racks
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black sm:text-5xl">Your Cart</h1>

      <div className="mt-8">
        <div className="hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-brand-line pb-3 text-xs font-bold uppercase tracking-wide text-brand-black/50 sm:grid">
          <span>Product</span>
          <span className="w-40 text-center">Quantity</span>
          <span className="w-24 text-right">Total</span>
        </div>

        <ul>
          {cart?.lines.map((line) => {
            const onSale = line.compareAtPrice !== null && line.compareAtPrice > line.price;
            const savings = onSale ? Math.round((line.compareAtPrice! - line.price) * 100) / 100 : 0;
            const savingsPct = onSale ? Math.round((savings / line.compareAtPrice!) * 100) : 0;
            const options = line.selectedOptions.filter((o) => o.value !== "Default Title");

            return (
              <li key={line.id} className="flex flex-col gap-4 border-b border-brand-line py-6 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-brand-line bg-white">
                    {line.image && <Image src={line.image.url} alt={line.image.altText ?? line.productTitle} fill sizes="80px" className="object-contain p-1" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-brand-black">{line.productTitle}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {onSale && <span className="text-sm text-brand-black/40 line-through">${line.compareAtPrice}</span>}
                      <span className="text-sm font-bold text-brand-green">${line.price}</span>
                      {onSale && (
                        <span className="rounded-full bg-brand-green-light px-2 py-0.5 text-xs font-semibold text-brand-green-dark">
                          Save ${savings} ({savingsPct}%)
                        </span>
                      )}
                    </div>
                    {options.map((o) => (
                      <div key={o.name} className="mt-0.5 text-sm text-brand-black/70">
                        <span className="font-semibold text-brand-black">{o.name}:</span> <span className="text-brand-black/60">{o.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:w-40 sm:justify-center">
                  <div className="flex items-stretch overflow-hidden rounded-lg border-2 border-brand-line">
                    <button
                      type="button"
                      onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))}
                      disabled={loading}
                      className="w-9 text-lg text-brand-black disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="flex w-10 items-center justify-center text-sm font-semibold text-brand-black">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateLine(line.id, line.quantity + 1)}
                      disabled={loading}
                      className="w-9 text-lg text-brand-black disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    disabled={loading}
                    aria-label="Remove item"
                    className="text-brand-black/40 hover:text-brand-red disabled:opacity-50"
                  >
                    <TrashIcon />
                  </button>
                </div>

                <div className="text-right font-bold text-brand-black sm:w-24">${line.lineTotal}</div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex items-center gap-2.5 rounded-lg border-2 border-dashed border-brand-orange bg-brand-cream px-4 py-3 text-sm text-brand-black">
        <span aria-hidden>🚚</span>
        <span>
          Congrats! You&apos;ve unlocked <strong className="font-bold">FREE SHIPPING</strong>
        </span>
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-bold uppercase tracking-wide text-brand-black/60">Estimated total</span>
          <span className="text-2xl font-black text-brand-black">${cart?.subtotal ?? 0}</span>
        </div>
        <a
          href={cart?.checkoutUrl}
          className="w-full rounded-full bg-brand-green py-4 text-center text-lg font-black uppercase tracking-tight text-white hover:opacity-90 sm:w-auto sm:px-16"
        >
          Check out
        </a>
        <div className="inline-flex items-center gap-1.5 text-sm text-brand-black/60">
          <span className="tracking-widest text-brand-star">★★★★★</span> 4.6/5 from 20,000+ customers
        </div>
        <PaymentIcons />
      </div>
    </div>
  );
}
