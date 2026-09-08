import { description, pressQuote } from "@/lib/verticalRackPdp";

export function ProductDescription() {
  return (
    <div className="py-12 sm:py-14">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="mx-auto max-w-[62ch]">
          <h2 className="text-2xl font-extrabold uppercase tracking-tighter leading-tight text-brand-black sm:text-3xl">
            {description.heading}
          </h2>
          {description.paragraphs.map((p) => (
            <p key={p} className="mt-4 text-[15px] leading-relaxed text-brand-black/70">
              {p}
            </p>
          ))}
        </div>

        <div className="flex flex-col justify-center border-t border-brand-line pt-6 text-center lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 lg:text-left">
          <p className="text-lg font-bold leading-snug text-brand-black">&ldquo;{pressQuote.quote}&rdquo;</p>
          <p className="mt-1.5 text-sm text-brand-black/50">{pressQuote.source}</p>
        </div>
      </div>
    </div>
  );
}
