import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/lp/Header";
import { Footer } from "@/components/lp/Footer";
import { convertBox, hero, benefits, trustStrip, finalCta } from "@/lib/quiz";

export const metadata: Metadata = {
  title: "JB Racks — Find Your Rack Quiz",
  description: "Answer a few quick questions and get a personalized JB Racks recommendation.",
};

function QuizButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <a
      href={convertBox.triggerHref}
      className={`inline-block rounded-full bg-brand-green px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:opacity-90 ${className}`}
    >
      {label}
    </a>
  );
}

export default function LpQuizPage() {
  return (
    <>
      {/* Same ConvertBox loader (and account UUID) as the live
          jbracks.com/pages/quiz page, so the trigger links below open the
          identical, already-built quiz widget. The real snippet is an IIFE
          that just creates this exact <script src> tag and appends it to
          <head> — using the tag directly here (rather than the IIFE) is what
          actually gets Next's beforeInteractive strategy to head-place it. */}
      <Script
        id="app-convertbox-script"
        src="https://cdn.convertbox.com/convertbox/js/embed.js"
        data-uuid={convertBox.scriptUuid}
        strategy="beforeInteractive"
      />

      <Header />
      <main className="bg-white">
        {/* Hero */}
        <div className="border-b border-brand-line py-14 text-center sm:py-20">
          <div className="mx-auto max-w-2xl px-6">
            <span className="inline-block rounded-full bg-brand-green-light px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide text-brand-green-dark">
              {hero.kicker}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tighter text-brand-black sm:text-5xl">
              {hero.headline}
            </h1>
            <p className="mx-auto mt-5 max-w-[56ch] text-lg text-brand-black/70">{hero.sub}</p>
            <QuizButton label={hero.cta} className="mt-8" />
          </div>
        </div>

        {/* Benefits */}
        <div className="py-14 sm:py-16">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 px-6 sm:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title}>
                <h3 className="text-lg font-bold text-brand-black">{b.title}</h3>
                <p className="mt-2 text-[15px] text-brand-black/70">{b.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-y border-brand-line bg-brand-cream py-10">
          <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-6 px-6 text-center sm:grid-cols-4">
            {trustStrip.map((t) => (
              <div key={t.label}>
                <div className="text-2xl font-extrabold text-brand-black">{t.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-black/60">{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mx-5 my-14 rounded-xl bg-brand-black px-6 py-12 text-center text-white sm:mx-auto sm:max-w-[1100px] sm:px-10">
          <h2 className="mx-auto max-w-[24ch] text-3xl font-extrabold tracking-tighter text-white sm:text-4xl">
            {finalCta.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[15.5px] text-white/60">{finalCta.body}</p>
          <QuizButton label={finalCta.cta} className="mt-7" />
        </div>
      </main>
      <Footer />
    </>
  );
}
