"use client";

import { useSyncExternalStore } from "react";

// A once-a-second clock read through useSyncExternalStore: the server (and
// the hydration pass) see a fixed null snapshot, then the client swaps in
// the real time — so server HTML and the first client render always match
// instead of differing by however many seconds passed between them (which
// throws React hydration error #418). Used by CountdownTimer and
// SaleProgress.
function subscribeToClock(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}
const getNowSecond = () => Math.floor(Date.now() / 1000);
const getServerNow = () => null;

// Current time in ms (to the second), or null before hydration.
export function useNow(): number | null {
  const nowSecond = useSyncExternalStore(subscribeToClock, getNowSecond, getServerNow);
  return nowSecond === null ? null : nowSecond * 1000;
}
