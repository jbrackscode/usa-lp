import Image from "next/image";
import { dealsUrl, type Reason } from "@/lib/newsroom";

export function ReasonBlock({
  number,
  kicker,
  image,
  imageAlt,
  heading,
  paragraphs,
  stat,
  pills,
  flip,
}: Reason) {
  return (
    <div className="border-t border-nr-rule px-5 py-10 sm:px-10 sm:py-12">
      <div className="mb-2 text-[3em] font-black leading-none tracking-tight text-nr-ink sm:text-[3.7em]">
        <span className="mr-1.5 text-nr-orange">{number}</span>
        {kicker}
      </div>

      <div className="mt-5 grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
        <div className={`overflow-hidden rounded-[10px] bg-nr-bg ${flip ? "sm:order-2" : ""}`}>
          <div className="relative aspect-square w-full">
            <Image src={image} alt={imageAlt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>

        <div>
          <h3 className="mb-3.5 text-2xl font-bold leading-[1.25] text-nr-ink">{heading}</h3>
          {paragraphs.map((p) => (
            <p key={p} className="mb-3 text-base leading-[1.75] text-nr-ink-mid">
              {p}
            </p>
          ))}

          {stat && (
            <div className="mt-4 rounded-lg border border-nr-orange/20 bg-nr-orange-light px-4 py-3.5 text-sm text-nr-ink-mid">
              <strong className="mb-0.5 block text-xl font-bold text-nr-orange-dark">{stat.headline}</strong>
              {stat.detail}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
            {pills.map((pill) => (
              <span key={pill} className="flex items-center gap-2 text-sm font-medium text-nr-ink-mid">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nr-green text-xs font-bold text-white">
                  ✓
                </span>
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-5 border-t border-nr-rule pt-4">
            <a
              href={dealsUrl}
              className="block rounded-full bg-brand-green py-3.5 text-center text-lg font-black uppercase tracking-tight text-white"
            >
              Today&apos;s Deals →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
