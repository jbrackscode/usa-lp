import Image from "next/image";
import { reasons, reasonsEyebrow, reasonsHeadline } from "@/lib/bikeRacksListicle";

export function ReasonsList() {
  return (
    <div className="py-12 sm:py-14" id="reasons">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-10 max-w-[82ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">{reasonsEyebrow}</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">{reasonsHeadline}</h2>
        </div>

        <div>
          {reasons.map((r, i) => (
            <div
              key={r.number}
              className={`grid grid-cols-1 items-center gap-6 border-t border-brand-line py-9 sm:grid-cols-2 sm:gap-10 sm:py-10 ${
                i === reasons.length - 1 ? "border-b" : ""
              }`}
            >
              {/* Text: shows second on mobile (below the image), left column on desktop */}
              <div className="order-2 sm:order-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black leading-none text-brand-green">{r.number}</span>
                  <h3 className="text-3xl tracking-tighter uppercase font-black leading-[1.25] text-brand-black">{r.title}</h3>
                </div>
                <p className="mt-2.5 max-w-[52ch] text-[15px] text-brand-black/70">{r.body}</p>
              </div>

              {/* Image: shows first on mobile, right column on desktop */}
              <div className="relative order-1 aspect-[1/1] w-full overflow-hidden rounded-xl bg-white sm:order-2">
                <Image src={r.image} alt={r.title} fill sizes="(min-width: 640px) 500px, 100vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
