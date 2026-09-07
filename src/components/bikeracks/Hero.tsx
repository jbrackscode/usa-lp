import { hero } from "@/lib/bikeRacksListicle";
import { HeroGallery } from "./HeroGallery";

export function Hero() {
  return (
    <div className="border-b border-brand-line py-6 sm:py-12">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="order-2 lg:order-1">
          <div className="mb-3.5 text-sm font-bold text-brand-green-dark">{hero.kicker}</div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-brand-black sm:text-5xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg text-brand-black/70">{hero.sub}</p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              id="hero-cta"
              href="#buy-box"
              className="inline-block rounded-full bg-brand-green px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:opacity-90"
            >
              {hero.ctaPrimary}
            </a>
            <a href="#reasons" className="text-sm font-semibold text-brand-black underline decoration-brand-line underline-offset-4">
              {hero.ctaSecondary}
            </a>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-brand-line pt-5">
            {hero.trustStrip.map((t) => (
              <div key={t.label} className="flex items-baseline gap-2 text-[13px] font-medium text-brand-black/60">
                <b className="text-base font-extrabold text-brand-black">{t.value}</b>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 -mx-6 sm:mx-0 lg:order-2">
          <HeroGallery />
        </div>
      </div>
    </div>
  );
}
