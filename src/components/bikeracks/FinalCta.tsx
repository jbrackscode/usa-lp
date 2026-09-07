import { finalCta } from "@/lib/bikeRacksListicle";

export function FinalCta() {
  return (
    <div className="mx-5 mb-10 rounded-xl bg-brand-black px-6 py-10 text-center text-white sm:mx-10 sm:px-10 sm:py-12">
      <h2 className="mx-auto max-w-[20ch] text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-tight text-white">
        {finalCta.headline}
      </h2>
      <p className="mx-auto mt-4 max-w-[56ch] text-[15.5px] text-white/60">{finalCta.body}</p>
      <a
        href="#buy-box"
        className="mt-7 inline-block rounded-full bg-brand-green px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:opacity-90"
      >
        {finalCta.cta}
      </a>
    </div>
  );
}
