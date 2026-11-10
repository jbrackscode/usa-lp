"use client";

import type { ReactNode } from "react";
import { product } from "@/lib/config";
import { useNow } from "@/lib/useNow";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Renders its children only in the last 7 days before the Black Friday sale
// ends (and while it hasn't ended). Used to keep the mid-page and closing
// countdowns out of the way until the deadline is close enough to matter;
// the top bar's timer always shows. Renders nothing on the server and the
// hydration pass (useNow is null there), so there's no mismatch.
export function FinalWeekOnly({ children }: { children: ReactNode }) {
  const now = useNow();
  if (now === null) return null;
  const end = new Date(product.blackFridayEndsAt).getTime();
  if (now < end - WEEK_MS || now >= end) return null;
  return <>{children}</>;
}
