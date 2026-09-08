import Image from "next/image";
import { trustIcons } from "@/lib/verticalRackPdp";

export function TrustIconsRow() {
  return (
    <div className="border-t border-brand-line bg-brand-cream py-6">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 sm:justify-between">
        {trustIcons.map((t) => (
          <span key={t.label} className="inline-flex items-center gap-3 text-[13px] font-bold uppercase tracking-wide text-brand-black">
            <Image src={t.icon} alt="" width={32} height={32} className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
