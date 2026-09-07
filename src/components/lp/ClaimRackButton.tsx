"use client";

import { useState } from "react";
import { storeUrl } from "@/lib/config";

type ClaimRackButtonProps = {
  label: string;
  className?: string;
  full?: boolean;
};

/**
 * Sends the shopper to Shopify checkout. Creates a cart via the Storefront
 * API (see /api/checkout) when a variant is configured; otherwise falls back
 * to linking straight at the product page on the live store so the button
 * always does *something* useful before Shopify env vars are wired up.
 */
export function ClaimRackButton({ label, className = "", full = false }: ClaimRackButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error("checkout failed");
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      setError(true);
      setLoading(false);
      window.location.href = storeUrl;
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`${full ? "block w-full" : "inline-block"} rounded-full bg-brand-green px-8 py-4 text-center text-[19px] font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-opacity hover:opacity-90 disabled:opacity-70 ${className}`}
    >
      {loading ? "Loading checkout…" : error ? "Redirecting to store…" : label}
    </button>
  );
}
