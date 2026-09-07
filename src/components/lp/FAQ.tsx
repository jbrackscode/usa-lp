"use client";

import { useState } from "react";
import { faqs as defaultFaqs } from "@/lib/config";

type FAQProps = {
  faqs?: readonly { question: string; answer: string }[];
};

export function FAQ({ faqs = defaultFaqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl">
      {faqs.map((faq, index) => {
        const open = openIndex === index;
        return (
          <div key={faq.question} className="border-b border-brand-line">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-base font-bold text-brand-black">{faq.question}</span>
              <span
                className={`shrink-0 text-brand-black transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▾
              </span>
            </button>
            {open && (
              <p className="pb-4 text-sm leading-relaxed text-brand-black/70">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
