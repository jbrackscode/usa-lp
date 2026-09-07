import Image from "next/image";
import { warranty } from "@/lib/bikeRacksListicle";

export function WarrantyBand() {
  return (
    <div className="py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-white px-6 py-10 text-center sm:px-12 sm:py-12">
          <div className="absolute -top-4 right-4 h-20 w-20 rotate-12 sm:right-8 sm:h-[118px] sm:w-[118px]">
            <Image src="/images/bikeracks/warranty-badge.svg" alt="4-Year Warranty seal" fill />
          </div>

          <h2 className="mx-auto max-w-[18ch] text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-tight text-brand-black">
            {warranty.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-[62ch] text-[15px] leading-relaxed text-brand-black/70">
            {warranty.body}
          </p>
        </div>
      </div>
    </div>
  );
}
