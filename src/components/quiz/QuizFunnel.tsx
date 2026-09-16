"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { ArrowLeft, CheckCircle2, HelpCircle, Info, type LucideIcon } from "lucide-react";
import {
  quizSteps,
  START_STEP,
  MAX_STEPS,
  MODEL_COMPARE_STEP_ID,
  bikeCategories,
  type ChoiceButton,
  type BikeCategory,
  type CustomerType,
} from "@/lib/quizFunnel";
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

const ZERO_INVENTORY: Record<BikeCategory, number> = {
  mountainBike: 0,
  eBike: 0,
  roadGravel: 0,
  kidsBike: 0,
  fatBike: 0,
  hybrid: 0,
};

// Personalizes the recommendation screen's kicker line with the customer
// type — self-reported at step 0, or inferred from the bike inventory if
// that's somehow unanswered. Doesn't change which rack/add-ons get
// recommended (that stays driven by the real bike-count/fold/storage
// answers) — just how the reveal is framed.
const CUSTOMER_TYPE_KICKER: Record<CustomerType, string> = {
  family_adventures: "For family adventures",
  mountain_biking: "For mountain missions",
  cycling: "For your rides",
  other: "Based on your answers",
};

// Illustration for the hitch-fit step — a 2" x 2" receiver tube shown at an
// angle with both dimensions called out, matching the shopper's own
// reference photo of the real part.
function HitchDiagram() {
  return (
    <svg viewBox="0 0 220 170" className="h-32 w-full max-w-[260px] sm:h-36" aria-hidden>
      {/* Receiver tube, 3/4 view — front face + extruded depth */}
      <polygon points="150,58 190,30 190,102 150,130" fill="#141416" />
      <polygon points="70,58 150,58 190,30 110,30" fill="#3a3a3e" />
      <rect x="70" y="58" width="80" height="72" rx="3" fill="#232326" stroke="#0d0d0e" strokeWidth="2" />
      <rect x="85" y="72" width="50" height="44" fill="#0a0a0b" stroke="#050505" strokeWidth="1.5" />
      <line x1="88" y1="113" x2="132" y2="75" stroke="#3f3f43" strokeWidth="2" />

      {/* Width callout (top) — anchored to the actual opening, not the housing */}
      <line x1="85" y1="20" x2="135" y2="20" stroke="#22d3ee" strokeWidth="2" />
      <line x1="85" y1="14" x2="85" y2="72" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="135" y1="14" x2="135" y2="72" stroke="#22d3ee" strokeWidth="1.5" />
      <polygon points="85,20 94,15 94,25" fill="#22d3ee" />
      <polygon points="135,20 126,15 126,25" fill="#22d3ee" />
      <text x="110" y="13" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1a1a1a">
        2&quot;
      </text>

      {/* Height callout (left) — anchored to the actual opening, not the housing */}
      <line x1="42" y1="72" x2="42" y2="116" stroke="#22d3ee" strokeWidth="2" />
      <line x1="36" y1="72" x2="85" y2="72" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="36" y1="116" x2="85" y2="116" stroke="#22d3ee" strokeWidth="1.5" />
      <polygon points="42,72 37,81 47,81" fill="#22d3ee" />
      <polygon points="42,116 37,107 47,107" fill="#22d3ee" />
      <text x="16" y="98" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1a1a1a">
        2&quot;
      </text>
    </svg>
  );
}

// Small icon badge shown above a step's heading — purely visual, gives the
// funnel a guided-flow feel instead of a plain form. Renders nothing when a
// step doesn't set one (the email/reveal step has its own banner instead).
function StepIcon({ icon: Icon }: { icon?: LucideIcon }) {
  if (!Icon) return null;
  return (
    <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light text-brand-green-dark lg:mb-4 lg:h-12 lg:w-12">
      <Icon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.2} />
    </span>
  );
}

// Illustration for the fat-tire "how to check" helper — a wheel with a
// callout leader line pointing at exactly where the sidewall marking sits,
// with the two numbers color-coded (wheel size vs. tire width) and a
// matching legend underneath, so the "first number / second number" point
// in the body text has something concrete to look at instead of a plain
// unlabeled circle.
function TireDiagram() {
  const cx = 70;
  const cy = 88;
  const tireR = 46;
  const rimR = 24;
  const anchorAngle = -60 * (Math.PI / 180);
  const anchorX = cx + tireR * Math.cos(anchorAngle);
  const anchorY = cy + tireR * Math.sin(anchorAngle);

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <svg viewBox="0 0 140 148" className="h-32 w-32 sm:h-36 sm:w-36" aria-hidden>
        {/* Callout: the sidewall marking, color-coded to match the legend */}
        <rect x="46" y="2" width="88" height="30" rx="8" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
        <text x="90" y="22" textAnchor="middle" fontSize="15" fontWeight="800">
          <tspan fill="#1a1a1a">26</tspan>
          <tspan fill="#9a9a9a"> x </tspan>
          <tspan fill="#ff6000">4.0</tspan>
        </text>
        <line x1="90" y1="32" x2={anchorX} y2={anchorY} stroke="#1a1a1a" strokeWidth="2" />
        <circle cx={anchorX} cy={anchorY} r="4" fill="#1a1a1a" />

        {/* Tread ticks around the tire's outer edge */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const x1 = cx + (tireR + 1) * Math.cos(angle);
          const y1 = cy + (tireR + 1) * Math.sin(angle);
          const x2 = cx + (tireR + 8) * Math.cos(angle);
          const y2 = cy + (tireR + 8) * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />;
        })}

        {/* Tire, then rim/wheel */}
        <circle cx={cx} cy={cy} r={tireR} fill="none" stroke="#1a1a1a" strokeWidth="13" />
        <circle cx={cx} cy={cy} r={rimR} fill="none" stroke="#c7c7c7" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="6" fill="#c7c7c7" />
      </svg>
      <div className="flex flex-col gap-1 text-[10.5px] font-semibold leading-tight text-brand-black/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-black" />
          26 = wheel size (in)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
          4.0 = tire width (in)
        </span>
      </div>
    </div>
  );
}

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
  // Per-category counts from the inventory step (10) — drives bikeCount
  // (the sum), which bike-detail follow-ups (18/19/20) are relevant, and
  // the Klaviyo customer_type segment sent on submission.
  const [inventory, setInventory] = useState<Record<BikeCategory, number>>(ZERO_INVENTORY);
  // Set by the opening "which best describes you?" step (0) — the explicit,
  // self-reported customer_type. Preferred over the inventory-based
  // inference below whenever it's set.
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  // Set by step 3's "my bikes fit this" button — Bike Compatibility
  // shoppers get the bike inventory/detail chain right away, with the hitch
  // check (2) deferred until after it instead of interrupting them
  // immediately. Reset whenever step 1 is (re)answered so backing out and
  // picking a different top-level reason doesn't leave this stale.
  const [needsHitchAfterBikes, setNeedsHitchAfterBikes] = useState(false);
  // Set by the fold/storage questions (11, 12) — surfaces the Slow-Fold
  // Strut and/or Garage Stand alongside the rack recommendation.
  const [wantsStrut, setWantsStrut] = useState(false);
  const [wantsStand, setWantsStand] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Guards the confetti burst to once per playthrough — reset() clears it
  // so retaking the quiz celebrates again.
  const confettiFired = useRef(false);

  const step = quizSteps[stepId];
  const isRevealStep = step.type === "email" && !submitted;

  // Pop confetti the moment the recommendation is actually revealed, not on
  // every re-render while the shopper is typing their name/email into the
  // same step.
  useEffect(() => {
    if (open && isRevealStep && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 130,
        spread: 75,
        startVelocity: 45,
        origin: { y: 0.6 },
        colors: ["#009d31", "#0f7a52", "#ff6000", "#f5a623", "#1a1a1a"],
        zIndex: 9999,
      });
    }
  }, [open, isRevealStep]);

  if (!open) return null;

  function goTo(next: number) {
    setHistory((h) => [...h, next]);
    setStepId(next);
  }

  // Pops back to the previous step in the actual path taken — history is
  // already a stack of visited step ids, so this is just walking it back
  // one. Picking a different answer from there appends a fresh path onto
  // the (now shorter) history exactly like goTo always has.
  function goBack() {
    if (history.length <= 1) return;
    const prevStepId = history[history.length - 2];
    setHistory((h) => h.slice(0, -1));
    setStepId(prevStepId);
  }

  function reset() {
    setStepId(START_STEP);
    setHistory([START_STEP]);
    setAnswers({});
    setInventory(ZERO_INVENTORY);
    setCustomerType(null);
    setNeedsHitchAfterBikes(false);
    setName("");
    setEmail("");
    setReasonText("");
    setSubmitted(false);
    confettiFired.current = false;
  }

  function handleClose() {
    reset();
    onClose();
  }

  // Walks the guided chain — hitch check, then kids wheel size → fat-tire
  // width → e-bike weight, in order — skipping anything not actually
  // relevant, then falling through to the fold-preference question (11)
  // once nothing's left. From step 2 specifically: if bike questions were
  // already done (the reordered Bike Compatibility path), continue on to
  // 11 instead of asking the inventory step a second time. 20/21/22 are
  // all part of the e-bike-weight sub-flow, so none of them re-trigger 20.
  function resolveNextStep(fromStepId: number): number {
    if (fromStepId === 2) return history.includes(10) ? 11 : 10;
    if (fromStepId === 10 && inventory.kidsBike > 0) return 18;
    if ((fromStepId === 10 || fromStepId === 18) && inventory.fatBike > 0) return 19;
    if (fromStepId !== 20 && fromStepId !== 21 && fromStepId !== 22 && inventory.eBike > 0) return 20;
    if (needsHitchAfterBikes && !history.includes(2)) return 2;
    return 11;
  }

  function handleChoice(button: ChoiceButton) {
    setAnswers((a) => ({ ...a, [stepId]: button.hint ? `${button.label} (${button.hint})` : button.label }));
    if (stepId === 1) setNeedsHitchAfterBikes(false);
    if (button.customerType) setCustomerType(button.customerType);
    if (button.needsHitchAfterBikes) setNeedsHitchAfterBikes(true);
    if (button.bikeCount) setBikeCount(button.bikeCount);
    // Set absolutely (not just true-when-flagged) on their own steps, so
    // going Back and picking a different answer actually clears a
    // previously-flagged want instead of leaving it stuck true.
    if (stepId === 11) setWantsStrut(Boolean(button.wantsStrut));
    if (stepId === 12) setWantsStand(Boolean(button.wantsStand));
    trackGA4("quiz_answer", { quiz_step: stepId, quiz_question: step.type === "choice" ? step.question : "", quiz_answer: button.label });
    goTo(button.chainNext ? resolveNextStep(stepId) : button.next);
  }

  const totalBikes = Object.values(inventory).reduce((sum, n) => sum + n, 0);

  function adjustInventory(key: BikeCategory, delta: number) {
    setInventory((inv) => ({ ...inv, [key]: Math.max(0, Math.min(9, inv[key] + delta)) }));
  }

  function handleInventorySubmit() {
    if (totalBikes === 0) return;
    const tier: 4 | 5 | 6 = totalBikes <= 4 ? 4 : totalBikes === 5 ? 5 : 6;
    setBikeCount(tier);
    const summary = bikeCategories
      .filter((c) => inventory[c.key] > 0)
      .map((c) => `${inventory[c.key]} ${c.label}`)
      .join(", ");
    setAnswers((a) => ({ ...a, [stepId]: summary }));
    trackGA4("quiz_answer", { quiz_step: stepId, quiz_question: "What bikes are you carrying?", quiz_answer: summary });
    goTo(resolveNextStep(stepId));
  }

  // The explicit answer from step 0 wins; if that's somehow unset, infer
  // from the bike inventory instead — a kids bike reads as a family/
  // household purchase before anything else, then mountain/fat bikes, then
  // general cycling, "other" as the last resort. Used both for the Klaviyo
  // profile property and to personalize the reveal screen's kicker.
  const resolvedCustomerType: CustomerType =
    customerType ??
    (inventory.kidsBike > 0
      ? "family_adventures"
      : inventory.mountainBike > 0 || inventory.fatBike > 0
        ? "mountain_biking"
        : inventory.roadGravel > 0 || inventory.hybrid > 0 || inventory.eBike > 0
          ? "cycling"
          : "other");

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
      customer_type: resolvedCustomerType,
    });
    await submitToApi({
      name,
      email,
      recommendedRack: recommendedRack.label,
      recommendedAddons: recommendedAddonNames,
      customerType: resolvedCustomerType,
    });
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
  // path (see MAX_STEPS) — hidden entirely on terminal end states. Shown as
  // a bar rather than "Step X of 12": most real paths finish well short of
  // the worst case, and a literal step count that high reads as scarier
  // than the actual experience.
  const progressIndex = Math.min(history.length, MAX_STEPS);
  // The recommendation reveal is the actual finish line regardless of how
  // many steps it took to get there, so the bar always reads as complete
  // once reached — not some fraction of the 12-step worst case.
  const progressPercent =
    step.type === "email" ? 100 : Math.max(6, Math.min(100, (progressIndex / MAX_STEPS) * 100));
  const showProgress = step.type !== "end";
  // The back button is available a step further than the progress bar —
  // including on end/disqualification steps, which otherwise have no
  // interactive element at all and would trap the shopper into closing the
  // whole quiz just to reconsider an earlier answer.
  const showBack = history.length > 1 && !submitted;
  // isRevealStep (the recommendation reveal splits into two columns on
  // desktop — recs left, form right — so it needs a lot more width than a
  // single question card) is computed above, alongside the confetti effect.
  // The live model-comparison table needs more room than a question card —
  // everything else (checklists, spec grids) fits the standard width fine.
  const isWideInfoStep = step.type === "choice" && step.id === MODEL_COMPARE_STEP_ID;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8" role="dialog" aria-modal="true">
      <div
        className={`relative flex max-h-[88vh] w-full flex-col rounded-xl bg-white shadow-lg transition-[max-width] ${
          isRevealStep ? "max-w-lg lg:max-w-5xl" : isWideInfoStep ? "max-w-lg lg:max-w-4xl" : "max-w-lg lg:max-w-3xl"
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

        {/* Everything below scrolls internally, capped by max-h-[88vh] on the
            card above — the close button stays fixed in the corner (it's
            positioned against the non-scrolling wrapper) even on the denser
            steps that would otherwise run past a laptop viewport. */}
        <div className="overflow-y-auto p-6 sm:p-8 lg:p-10">
          {(showBack || showProgress) && (
            <div className="mb-4 flex items-center gap-3 lg:mb-5">
              {showBack && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex shrink-0 items-center gap-1 text-xs font-bold text-brand-black/50 hover:text-brand-black lg:text-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5 lg:h-4 lg:w-4" strokeWidth={2.5} />
                  Back
                </button>
              )}
              {showProgress && (
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-brand-line"
                  role="progressbar"
                  aria-label="Quiz progress"
                  aria-valuenow={Math.round(progressPercent)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-brand-green transition-[width] duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {step.type === "choice" && (
            <div>
              <StepIcon icon={step.icon} />
              <h2 className="pr-8 text-xl font-extrabold text-brand-black sm:text-2xl lg:text-3xl">{step.question}</h2>
              <p className="mt-1.5 text-sm text-brand-black/60 lg:mt-2 lg:text-base">{step.subtitle}</p>

              {step.showHitchDiagram && (
                <div className="mt-4 flex justify-center lg:mt-5">
                  <HitchDiagram />
                </div>
              )}

              {step.checklist && (
                <ul className="mt-4 flex flex-col gap-2 lg:mt-5 lg:gap-2.5">
                  {step.checklist.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-[13px] text-brand-black/80 lg:text-[15px]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark lg:h-5 lg:w-5" strokeWidth={2.2} />
                      {line}
                    </li>
                  ))}
                </ul>
              )}

              {step.facts && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-5 lg:gap-2.5">
                  {step.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex flex-col items-center gap-1 rounded-lg border border-brand-line p-3 text-center lg:p-3.5"
                    >
                      <fact.icon className="h-5 w-5 text-brand-green-dark lg:h-6 lg:w-6" strokeWidth={2} />
                      <div className="mt-1 text-[13px] font-bold text-brand-black lg:text-sm">{fact.value}</div>
                      <div className="text-[10.5px] uppercase tracking-wide text-brand-black/45 lg:text-[11px]">{fact.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {step.note && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border-l-4 border-brand-green bg-brand-green-light px-3.5 py-2.5 lg:mt-4 lg:px-4 lg:py-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark lg:h-5 lg:w-5" strokeWidth={2.2} />
                  <p className="text-[12.5px] text-brand-green-dark lg:text-sm">{step.note}</p>
                </div>
              )}

              {step.id === MODEL_COMPARE_STEP_ID && (
                <div className="mt-4 overflow-x-auto rounded-xl border border-brand-line lg:mt-5">
                  <table className="w-full min-w-[480px] border-collapse text-left">
                    <thead>
                      <tr className="bg-brand-cream">
                        <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-brand-black/50 lg:px-5 lg:py-3 lg:text-xs">
                          &nbsp;
                        </th>
                        {rackSizes.map((r) => (
                          <th key={r.handle} className="px-3 py-2 text-sm font-extrabold text-brand-black lg:px-5 lg:py-3 lg:text-lg">
                            {r.label}
                            {r.badge && (
                              <span className="ml-1.5 inline-block rounded-full bg-brand-green-light px-2 py-0.5 align-middle text-[10px] font-bold text-brand-green-dark lg:text-[11px]">
                                {r.badge}
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-line">
                      <tr>
                        <td className="px-3 py-2 text-[12.5px] font-bold text-brand-black/60 lg:px-5 lg:py-3 lg:text-sm">Bikes carried</td>
                        {rackSizes.map((r) => (
                          <td key={r.handle} className="px-3 py-2 text-[13.5px] text-brand-black lg:px-5 lg:py-3 lg:text-base">
                            {r.bikes}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-[12.5px] font-bold text-brand-black/60 lg:px-5 lg:py-3 lg:text-sm">Best for</td>
                        {rackSizes.map((r) => (
                          <td key={r.handle} className="px-3 py-2 text-[13.5px] text-brand-black lg:px-5 lg:py-3 lg:text-base">
                            {r.sublabel}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-[12.5px] font-bold text-brand-black/60 lg:px-5 lg:py-3 lg:text-sm">Price</td>
                        {rackSizes.map((r) => (
                          <td key={r.handle} className="px-3 py-2 text-[13.5px] font-bold text-brand-black lg:px-5 lg:py-3 lg:text-base">
                            ${r.price}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-[12.5px] font-bold text-brand-black/60 lg:px-5 lg:py-3 lg:text-sm">You save</td>
                        {rackSizes.map((r) => (
                          <td key={r.handle} className="px-3 py-2 text-[13.5px] text-brand-green-dark lg:px-5 lg:py-3 lg:text-base">
                            {r.compareAtPrice > r.price ? `$${r.compareAtPrice - r.price}` : "—"}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {step.cardButtons ? (
                <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:mt-6 lg:gap-3">
                  {step.buttons.map((button) => (
                    <button
                      key={button.label}
                      type="button"
                      onClick={() => handleChoice(button)}
                      className={`rounded-xl border-2 p-3.5 text-center transition-colors lg:p-4 ${
                        button.note ? "sm:col-span-3 text-left" : ""
                      } ${
                        button.variant === "other"
                          ? "border-brand-green bg-brand-green-light"
                          : "border-brand-line hover:border-brand-black/40"
                      }`}
                    >
                      <div className="text-[15px] font-bold text-brand-black lg:text-base">{button.label}</div>
                      {button.hint && <div className="mt-1 text-xs text-brand-black/50 lg:text-[13px]">{button.hint}</div>}
                      {button.note && (
                        <p className="mt-2 text-[13px] leading-relaxed text-brand-black/70 lg:text-sm">{button.note}</p>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-2.5 lg:mt-6 lg:gap-3">
                  {step.buttons.map((button) => (
                    <button
                      key={button.label}
                      type="button"
                      onClick={() => handleChoice(button)}
                      className={`w-full rounded-full px-5 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-90 lg:px-7 lg:py-4 lg:text-lg lg:font-bold ${
                        button.variant === "other" ? "bg-[#22c55e] text-white" : "bg-[#f0f0f0] text-brand-black"
                      }`}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              )}

              {step.footerNote && (
                <p className="mt-3 text-xs text-brand-black/50 lg:mt-3.5 lg:text-sm">{step.footerNote}</p>
              )}

              {step.helper && (
                <details className="mt-3.5 rounded-xl border border-brand-line p-3.5 lg:mt-4 lg:p-4">
                  <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand-black lg:text-base">
                    <HelpCircle className="h-5 w-5 shrink-0 text-brand-black/50" strokeWidth={2} />
                    {step.helper.label}
                  </summary>
                  <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    {step.helper.showTireDiagram && <TireDiagram />}
                    <p className="text-[13px] leading-relaxed text-brand-black/70 lg:text-base">{step.helper.body}</p>
                  </div>
                </details>
              )}
            </div>
          )}

          {step.type === "inventory" && (
            <div>
              <StepIcon icon={step.icon} />
              <h2 className="pr-8 text-xl font-extrabold text-brand-black sm:text-2xl lg:text-3xl">{step.heading}</h2>
              <p className="mt-1.5 text-sm text-brand-black/60 lg:mt-2 lg:text-base">{step.subtitle}</p>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:mt-6 lg:gap-3">
                {bikeCategories.map((cat) => {
                  const count = inventory[cat.key];
                  return (
                    <div
                      key={cat.key}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-colors lg:gap-2 lg:p-4 ${
                        count > 0 ? "border-brand-black" : "border-brand-line"
                      }`}
                    >
                      <cat.icon
                        className={`h-6 w-6 lg:h-7 lg:w-7 ${count > 0 ? "text-brand-black" : "text-brand-black/35"}`}
                        strokeWidth={1.8}
                      />
                      <div className="text-[12.5px] font-semibold text-brand-black lg:text-sm">{cat.label}</div>
                      <div className="flex items-center gap-2.5 lg:gap-3">
                        <button
                          type="button"
                          onClick={() => adjustInventory(cat.key, -1)}
                          disabled={count === 0}
                          aria-label={`Remove a ${cat.label}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-line text-base font-bold leading-none text-brand-black disabled:opacity-30 lg:h-8 lg:w-8 lg:text-lg"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-lg font-black text-brand-black lg:text-xl">{count}</span>
                        <button
                          type="button"
                          onClick={() => adjustInventory(cat.key, 1)}
                          aria-label={`Add a ${cat.label}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-line text-base font-bold leading-none text-brand-black hover:border-brand-black lg:h-8 lg:w-8 lg:text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 lg:mt-5">
                <span className="text-sm font-semibold text-brand-black/60 lg:text-base">
                  {totalBikes} bike{totalBikes === 1 ? "" : "s"} selected
                </span>
                <button
                  type="button"
                  onClick={handleInventorySubmit}
                  disabled={totalBikes === 0}
                  className="rounded-full bg-brand-black px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-30 lg:px-7 lg:py-3.5 lg:text-base"
                >
                  {step.cta}
                </button>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10">
                {/* LEFT — the recommendation */}
                <div>
                  <div className="rounded-2xl bg-gradient-to-br from-brand-green-dark to-brand-green px-5 py-3 text-center sm:py-4 lg:px-6 lg:py-3.5">
                    <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 lg:text-xs">
                      {CUSTOMER_TYPE_KICKER[resolvedCustomerType]}
                    </div>
                    <div className="mt-0.5 text-xl font-black uppercase tracking-tight text-white sm:text-2xl lg:text-xl">
                      Your Recommended Rack
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col items-center gap-4 text-center lg:mt-4 lg:gap-3">
                    <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-xl bg-brand-cream sm:w-48 lg:w-full lg:max-w-[170px]">
                      <Image
                        src={recommendedRack.imagesByColor.Black[0]}
                        alt={recommendedRack.label}
                        fill
                        sizes="(min-width: 1024px) 170px, 192px"
                        className="object-contain p-2"
                        priority
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-black lg:text-sm">
                        <span className="tracking-widest text-brand-star">★★★★★</span>
                        {reviewStats.average}/5 · 20,000+ customers
                      </div>
                      <h3 className="mt-1.5 text-2xl font-black tracking-tight text-brand-black lg:mt-1.5 lg:text-2xl">
                        {recommendedRack.label} Vertical Rack
                      </h3>
                      <div className="mt-2 flex flex-wrap items-baseline justify-center gap-2 lg:mt-1.5">
                        <span className="text-3xl font-black text-brand-black lg:text-3xl">${recommendedRack.price}</span>
                        <span className="text-lg text-brand-black/40 line-through lg:text-base">${recommendedRack.compareAtPrice}</span>
                        {savings > 0 && (
                          <span className="rounded-full bg-brand-green-light px-2.5 py-1 text-[12.5px] font-bold text-brand-green-dark lg:px-2.5 lg:py-1 lg:text-xs">
                            Save ${savings}
                          </span>
                        )}
                      </div>

                      <ul className="mx-auto mt-4 hidden max-w-[34ch] flex-col gap-1.5 text-left sm:flex lg:mt-3 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-4 lg:gap-y-1">
                        {benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-[13.5px] text-brand-black/75 lg:text-[12.5px]">
                            <span className="mt-0.5 shrink-0 text-brand-green">✓</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {recommendedAddons.length > 0 && (
                    <div className="mx-auto mt-4 max-w-[38ch] lg:mx-0 lg:mt-3 lg:max-w-none">
                      <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-brand-black/50 lg:text-[11px]">
                        Complete your setup
                      </div>
                      <div className="flex flex-col gap-1.5 lg:gap-1.5">
                        {recommendedAddons.map((addon) => (
                          <div
                            key={addon.name}
                            className="flex items-center gap-3 rounded-lg border border-brand-line bg-brand-cream p-2.5 text-left lg:p-2"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white lg:h-10 lg:w-10">
                              <Image src={addon.image} alt={addon.name} fill sizes="64px" className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13px] font-bold text-brand-black lg:text-[12.5px]">{addon.name}</div>
                              <div className="truncate text-[11.5px] text-brand-black/60 lg:text-[11px]">{addon.note}</div>
                            </div>
                            <div className="flex shrink-0 items-baseline gap-1.5">
                              {addon.compareAtPrice > addon.price && (
                                <span className="text-xs text-brand-black/40 line-through lg:text-xs">${addon.compareAtPrice}</span>
                              )}
                              <span className="text-sm font-extrabold text-brand-black lg:text-sm">+${addon.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT — the sign-up form */}
                <div className="mt-6 border-t border-brand-line pt-6 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <h2 className="pr-8 text-xl font-extrabold uppercase tracking-tight text-brand-black sm:text-2xl lg:pr-0 lg:text-2xl">
                    {step.heading}
                  </h2>
                  <p className="mt-2 text-[15px] text-brand-black/70 lg:mt-2 lg:text-base">{step.body}</p>

                  <div className="mt-5 flex flex-col gap-2.5 lg:mt-5 lg:gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-full border border-brand-line px-4 py-3 text-[15px] text-brand-black outline-none focus:border-brand-black lg:px-5 lg:py-3 lg:text-base"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-full border border-brand-line px-4 py-3 text-[15px] text-brand-black outline-none focus:border-brand-black lg:px-5 lg:py-3 lg:text-base"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    disabled={submitting || !email}
                    className="mt-4 w-full rounded-full bg-[#22c55e] px-5 py-4 text-base font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60 lg:mt-4 lg:py-4 lg:text-lg"
                  >
                    {submitting ? "Sending…" : step.cta}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-4 w-full text-center text-sm text-brand-black/50 underline lg:mt-3 lg:text-sm"
                  >
                    {step.declineLabel}
                  </button>
                </div>
              </div>
            ))}

          {step.type === "text" && (
            <div>
              <StepIcon icon={step.icon} />
              <h2 className="pr-8 text-xl font-extrabold text-brand-black sm:text-2xl lg:text-3xl">{step.heading}</h2>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder={step.placeholder}
                rows={4}
                className="mt-5 w-full resize-none rounded-2xl border border-brand-line px-4 py-3 text-[15px] text-brand-black outline-none focus:border-brand-black lg:mt-6 lg:px-6 lg:py-4 lg:text-lg"
              />
              <button
                type="button"
                onClick={() => handleTextSubmit(step.next)}
                disabled={submitting || !reasonText.trim()}
                className="mt-4 w-full rounded-full bg-[#22c55e] px-5 py-3.5 text-[15px] font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60 lg:mt-5 lg:py-4 lg:text-lg"
              >
                {submitting ? "Sending…" : step.cta}
              </button>
            </div>
          )}

          {step.type === "end" && (
            <div className="pr-8">
              <StepIcon icon={step.icon} />
              <h2 className="text-xl font-extrabold text-brand-black sm:text-2xl lg:text-3xl">{step.heading}</h2>
              <div className="mt-3 flex flex-col gap-2.5 lg:mt-5 lg:gap-3">
                {step.body.map((p) => (
                  <p key={p} className="text-[15px] leading-relaxed text-brand-black/70 lg:text-base">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
