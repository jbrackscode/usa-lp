"use client";

import { useState } from "react";
import Image from "next/image";
import { quizSteps, START_STEP, MAX_STEPS, type ChoiceButton } from "@/lib/quizFunnel";
import { reviewStats, type RackSize, type Addons } from "@/lib/bikeRacks";
import { storeUrl } from "@/lib/config";

type QuizFunnelProps = {
  open: boolean;
  onClose: () => void;
  // Real, live rack + add-on data (same source BuyBox uses) — the Mystery
  // Deal step recommends actual real SKUs/prices, never invented ones.
  rackSizes: RackSize[];
  addons: Addons;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function trackGA4(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

// Same real benefits already shown in the buy box — reused here so the
// recommendation reveal isn't just an image and a price.
const benefits = [
  "Lightweight 53-66 lbs — one person can fit it",
  "Anti-wobble hitch bracket included",
  "Fits wheels up to 29\" and tires up to 3\" wide",
  "Structural steel — load & vibration tested",
];

export function QuizFunnel({ open, onClose, rackSizes, addons }: QuizFunnelProps) {
  const [stepId, setStepId] = useState(START_STEP);
  const [history, setHistory] = useState<number[]>([START_STEP]);
  // Every answer, keyed by step id — this is exactly what gets POSTed to
  // /api/quiz-submit alongside the email/name/text fields.
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // Set only by the bike-count step (10) — drives the real product
  // recommendation shown at the Mystery Deal step. Every path into step 6
  // now passes through step 10 first, so this is always known by then.
  const [bikeCount, setBikeCount] = useState<4 | 5 | 6 | null>(null);
  // Set by the fold/storage questions (11, 12) — surfaces the Slow-Fold
  // Strut and/or Garage Stand alongside the rack recommendation.
  const [wantsStrut, setWantsStrut] = useState(false);
  const [wantsStand, setWantsStand] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const step = quizSteps[stepId];

  function goTo(next: number) {
    setHistory((h) => [...h, next]);
    setStepId(next);
  }

  function reset() {
    setStepId(START_STEP);
    setHistory([START_STEP]);
    setAnswers({});
    setName("");
    setEmail("");
    setReasonText("");
    setSubmitted(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleChoice(button: ChoiceButton) {
    setAnswers((a) => ({ ...a, [stepId]: button.label }));
    if (button.bikeCount) setBikeCount(button.bikeCount);
    if (button.wantsStrut) setWantsStrut(true);
    if (button.wantsStand) setWantsStand(true);
    trackGA4("quiz_answer", { quiz_step: stepId, quiz_question: step.type === "choice" ? step.question : "", quiz_answer: button.label });
    goTo(button.next);
  }

  // Falls back to the 5-bike ("Most Popular") size if somehow reached
  // without a bike-count answer, rather than showing nothing.
  const recommendedRack = rackSizes.find((r) => r.bikes === bikeCount) ?? rackSizes.find((r) => r.badge) ?? rackSizes[0];
  const savings = recommendedRack.compareAtPrice - recommendedRack.price;

  // Real add-ons flagged by the fold/storage questions — never shown unless
  // the shopper's own answers actually pointed at needing one.
  const recommendedAddons = [
    wantsStrut ? { ...addons.slowFoldStrut } : null,
    wantsStand ? { ...addons.garageStand } : null,
  ].filter((a): a is Addons["slowFoldStrut"] | Addons["garageStand"] => a !== null);

  async function submitToApi(extra: Record<string, unknown>) {
    try {
      const res = await fetch("/api/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, ...extra }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function handleEmailSubmit() {
    setSubmitting(true);
    const recommendedAddonNames = recommendedAddons.map((a) => a.name);
    trackGA4("quiz_complete", {
      quiz_path: history.join(">"),
      quiz_outcome: "email_capture",
      recommended_rack: recommendedRack.label,
      recommended_addons: recommendedAddonNames.join(", "),
    });
    await submitToApi({ name, email, recommendedRack: recommendedRack.label, recommendedAddons: recommendedAddonNames });
    setSubmitting(false);
    setSubmitted(true);
  }

  async function handleTextSubmit(next: number) {
    setSubmitting(true);
    trackGA4("quiz_complete", { quiz_path: history.join(">"), quiz_outcome: "open_text" });
    await submitToApi({ reasonText });
    setSubmitting(false);
    goTo(next);
  }

  // How far through a typical path we are, out of the longest realistic
  // path (see MAX_STEPS) — hidden entirely on terminal end states.
  const progressIndex = Math.min(history.length, MAX_STEPS);
  const showProgress = step.type !== "end";
  // The recommendation reveal splits into two columns on desktop (recs left,
  // form right), so it needs a lot more width than a single question card —
  // mobile stays a single stacked column at the same size as every other step.
  const isRevealStep = step.type === "email" && !submitted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8" role="dialog" aria-modal="true">
      <div
        className={`relative w-full rounded-xl bg-white p-6 shadow-lg transition-[max-width] sm:p-8 lg:p-12 ${
          isRevealStep ? "max-w-lg lg:max-w-5xl" : "max-w-lg lg:max-w-3xl"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close quiz"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-xl text-brand-black/50 hover:bg-brand-cream hover:text-brand-black lg:right-6 lg:top-6 lg:h-10 lg:w-10 lg:text-2xl"
        >
          ×
        </button>

        {showProgress && (
          <div className="mb-5 text-xs font-bold uppercase tracking-wide text-brand-black/40 lg:mb-7 lg:text-sm">
            Step {progressIndex} of {MAX_STEPS}
          </div>
        )}

        {step.type === "choice" && (
          <div>
            <h2 className="pr-8 text-xl font-extrabold text-brand-black sm:text-2xl lg:text-4xl">{step.question}</h2>
            <p className="mt-1.5 text-sm text-brand-black/60 lg:mt-3 lg:text-lg">{step.subtitle}</p>
            <div className="mt-6 flex flex-col gap-2.5 lg:mt-10 lg:gap-4">
              {step.buttons.map((button) => (
                <button
                  key={button.label}
                  type="button"
                  onClick={() => handleChoice(button)}
                  className={`w-full rounded-full px-5 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-90 lg:px-8 lg:py-5 lg:text-xl lg:font-bold ${
                    button.variant === "other" ? "bg-[#22c55e] text-white" : "bg-[#f0f0f0] text-brand-black"
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step.type === "email" &&
          (submitted ? (
            <div className="pr-8 lg:text-center">
              <h2 className="text-xl font-extrabold text-brand-black sm:text-2xl lg:text-4xl">You&apos;re in!</h2>
              <p className="mt-2 text-[15px] text-brand-black/70 lg:mx-auto lg:mt-4 lg:max-w-lg lg:text-lg">
                Keep an eye on your inbox — your surprise discount for the <strong>{recommendedRack.label} Vertical Rack</strong>
                {recommendedAddons.length > 0 && (
                  <>
                    {" "}
                    (and the <strong>{recommendedAddons.map((a) => a.name).join(" + ")}</strong>)
                  </>
                )}{" "}
                is on its way to {email || "your inbox"}.
              </p>
              <a
                href={`${storeUrl}/products/${recommendedRack.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-full bg-brand-green px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:opacity-90 lg:mt-8 lg:px-10 lg:py-4 lg:text-base"
              >
                View {recommendedRack.label} Rack
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
              {/* LEFT — the recommendation */}
              <div>
                <div className="rounded-2xl bg-gradient-to-br from-brand-green-dark to-brand-green px-5 py-4 text-center sm:py-5 lg:px-7 lg:py-6">
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 lg:text-xs">Based on your answers</div>
                  <div className="mt-0.5 text-xl font-black uppercase tracking-tight text-white sm:text-2xl lg:text-3xl">
                    Your Recommended Rack
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-5 text-center">
                  <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-xl bg-brand-cream sm:w-48 lg:w-full lg:max-w-[280px]">
                    <Image
                      src={recommendedRack.imagesByColor.Black[0]}
                      alt={recommendedRack.label}
                      fill
                      sizes="(min-width: 1024px) 280px, 192px"
                      className="object-contain p-2"
                      priority
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-black lg:text-base">
                      <span className="tracking-widest text-brand-star">★★★★★</span>
                      {reviewStats.average}/5 · {reviewStats.count} reviews
                    </div>
                    <h3 className="mt-1.5 text-2xl font-black tracking-tight text-brand-black lg:mt-2 lg:text-4xl">
                      {recommendedRack.label} Vertical Rack
                    </h3>
                    <div className="mt-2 flex flex-wrap items-baseline justify-center gap-2 lg:mt-3">
                      <span className="text-3xl font-black text-brand-black lg:text-5xl">${recommendedRack.price}</span>
                      <span className="text-lg text-brand-black/40 line-through lg:text-xl">${recommendedRack.compareAtPrice}</span>
                      {savings > 0 && (
                        <span className="rounded-full bg-brand-green-light px-2.5 py-1 text-[12.5px] font-bold text-brand-green-dark lg:px-3 lg:py-1.5 lg:text-sm">
                          Save ${savings}
                        </span>
                      )}
                    </div>

                    <ul className="mx-auto mt-4 hidden max-w-[34ch] flex-col gap-1.5 text-left sm:flex lg:mt-6 lg:max-w-[38ch] lg:gap-2.5">
                      {benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-[13.5px] text-brand-black/75 lg:text-base">
                          <span className="mt-0.5 shrink-0 text-brand-green">✓</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {recommendedAddons.length > 0 && (
                  <div className="mx-auto mt-6 max-w-[38ch] lg:mx-0 lg:max-w-none">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-black/50 lg:text-sm">Complete your setup</div>
                    <div className="flex flex-col gap-2 lg:gap-3">
                      {recommendedAddons.map((addon) => (
                        <div
                          key={addon.name}
                          className="flex items-center gap-3 rounded-lg border border-brand-line bg-brand-cream p-2.5 text-left lg:p-3.5"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white lg:h-16 lg:w-16">
                            <Image src={addon.image} alt={addon.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-bold text-brand-black lg:text-base">{addon.name}</div>
                            <div className="truncate text-[11.5px] text-brand-black/60 lg:text-sm">{addon.note}</div>
                          </div>
                          <div className="shrink-0 text-sm font-extrabold text-brand-black lg:text-lg">+${addon.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT — the sign-up form */}
              <div className="mt-6 border-t border-brand-line pt-6 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                <h2 className="pr-8 text-xl font-extrabold uppercase tracking-tight text-brand-black sm:text-2xl lg:pr-0 lg:text-3xl">
                  {step.heading}
                </h2>
                <p className="mt-2 text-[15px] text-brand-black/70 lg:mt-3 lg:text-lg">{step.body}</p>

                <div className="mt-6 flex flex-col gap-2.5 lg:mt-8 lg:gap-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-full border border-brand-line px-4 py-3 text-[15px] text-brand-black outline-none focus:border-brand-black lg:px-6 lg:py-4 lg:text-lg"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-full border border-brand-line px-4 py-3 text-[15px] text-brand-black outline-none focus:border-brand-black lg:px-6 lg:py-4 lg:text-lg"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  disabled={submitting || !email}
                  className="mt-4 w-full rounded-full bg-[#22c55e] px-5 py-4 text-base font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60 lg:mt-6 lg:py-5 lg:text-xl"
                >
                  {submitting ? "Sending…" : step.cta}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-4 w-full text-center text-sm text-brand-black/50 underline lg:mt-5 lg:text-base"
                >
                  {step.declineLabel}
                </button>
              </div>
            </div>
          ))}

        {step.type === "text" && (
          <div>
            <h2 className="pr-8 text-xl font-extrabold text-brand-black sm:text-2xl lg:text-4xl">{step.heading}</h2>
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder={step.placeholder}
              rows={4}
              className="mt-5 w-full resize-none rounded-2xl border border-brand-line px-4 py-3 text-[15px] text-brand-black outline-none focus:border-brand-black lg:mt-8 lg:px-6 lg:py-4 lg:text-lg"
            />
            <button
              type="button"
              onClick={() => handleTextSubmit(step.next)}
              disabled={submitting || !reasonText.trim()}
              className="mt-4 w-full rounded-full bg-[#22c55e] px-5 py-3.5 text-[15px] font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60 lg:mt-6 lg:py-5 lg:text-xl"
            >
              {submitting ? "Sending…" : step.cta}
            </button>
          </div>
        )}

        {step.type === "end" && (
          <div className="pr-8">
            <h2 className="text-xl font-extrabold text-brand-black sm:text-2xl lg:text-4xl">{step.heading}</h2>
            <div className="mt-3 flex flex-col gap-2.5 lg:mt-6 lg:gap-4">
              {step.body.map((p) => (
                <p key={p} className="text-[15px] leading-relaxed text-brand-black/70 lg:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
