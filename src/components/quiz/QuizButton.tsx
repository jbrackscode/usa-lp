"use client";

import { useState, useSyncExternalStore } from "react";
import { QuizFunnel } from "./QuizFunnel";
import { quizSteps } from "@/lib/quizFunnel";
import type { RackSize, Addons } from "@/lib/bikeRacks";

type QuizButtonProps = {
  label: string;
  className?: string;
  rackSizes: RackSize[];
  addons: Addons;
  // Opens the quiz modal immediately on mount instead of waiting for a
  // click — only pass this on one <QuizButton> per page (each instance
  // manages its own open state, so two auto-opening instances would both
  // try to pop a modal at once).
  autoOpen?: boolean;
};

// Self-contained: renders its own trigger + its own QuizFunnel instance, so
// dropping <QuizButton /> anywhere on the page "just works" without lifting
// open state up to a shared parent.
export function QuizButton({ label, className = "", rackSizes, addons, autoOpen = false }: QuizButtonProps) {
  const [open, setOpen] = useState(autoOpen);
  // Deep link: on the auto-opening instance, ?step=<id> (e.g. ?step=1)
  // starts the quiz on that step instead of the opening question. Read via
  // useSyncExternalStore so the server render (no URL) stays at step 0 and
  // the client swaps in the linked step right after hydration.
  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => ""
  );
  const stepParam = new URLSearchParams(search).get("step");
  const deepLinkStep =
    autoOpen && stepParam !== null && Number.isInteger(Number(stepParam)) && quizSteps[Number(stepParam)]
      ? Number(stepParam)
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-block rounded-full bg-brand-green px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:opacity-90 ${className}`}
      >
        {label}
      </button>
      <QuizFunnel
        // Remounts with the linked step once the URL is known on the client.
        key={deepLinkStep ?? "start"}
        open={open}
        onClose={() => setOpen(false)}
        rackSizes={rackSizes}
        addons={addons}
        deepLinkStep={deepLinkStep}
      />
    </>
  );
}
