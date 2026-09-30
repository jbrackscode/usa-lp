"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ShopifyCart } from "@/lib/shopify";

type CartContextValue = {
  cart: ShopifyCart | null;
  itemCount: number;
  loading: boolean;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data.cart ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, quantity }),
      });
      const data = await res.json();
      if (res.ok) setCart(data.cart);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeLine = useCallback(async (lineId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId }),
      });
      const data = await res.json();
      if (res.ok) setCart(data.cart);
    } finally {
      setLoading(false);
    }
  }, []);

  const itemCount = cart?.totalQuantity ?? 0;

  const value = useMemo(
    () => ({ cart, itemCount, loading, updateLine, removeLine }),
    [cart, itemCount, loading, updateLine, removeLine]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
