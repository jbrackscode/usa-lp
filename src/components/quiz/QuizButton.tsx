"use client";

import { useState } from "react";
import { QuizFunnel } from "./QuizFunnel";
import type { RackSize, Addons } from "@/lib/bikeRacks";

type QuizButtonProps = {
  label: string;
  className?: string;
  rackSizes: RackSize[];
  addons: Addons;
};

// Self-contained: renders its own trigger + its own QuizFunnel instance, so
// dropping <QuizButton /> anywhere on the page "just works" without lifting
// open state up to a shared parent.
export function QuizButton({ label, className = "", rackSizes, addons }: QuizButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-block rounded-full bg-brand-green px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:opacity-90 ${className}`}
      >
        {label}
      </button>
      <QuizFunnel open={open} onClose={() => setOpen(false)} rackSizes={rackSizes} addons={addons} />
    </>
  );
}
