import Image from "next/image";
import { keyFeatures } from "@/lib/verticalRackPdp";

export function KeyFeaturesGrid() {
  return (
    <div className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="mx-auto mb-8 max-w-[30ch] text-center text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black sm:mb-10 sm:text-5xl">
          {keyFeatures.headline} <span className="text-brand-orange">{keyFeatures.headlineAccent}</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {keyFeatures.items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 sm:flex-col sm:items-stretch sm:gap-0">
              <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream sm:mb-4 sm:w-full">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-tight text-brand-black sm:text-base">{item.title}</h3>
                <p className="mt-0.5 text-[12.5px] leading-snug text-brand-black/60 sm:mt-1.5 sm:text-[13.5px]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
