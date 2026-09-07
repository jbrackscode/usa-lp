import Image from "next/image";
import { testimonials } from "@/lib/config";

export function Testimonials() {
  return (
    <div
      className="py-14"
      style={{ background: "linear-gradient(180deg, #F6F5F2 0%, #ffffff 100%)" }}
    >
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="mb-10 text-center text-3xl font-black text-[#333] sm:text-[2.5rem]">
          Join 20,000+ Other JB Racks Customers
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-lg border border-[#e5e5e5] bg-white p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5e5e5] text-sm font-semibold text-[#666]">
                    {t.initials}
                  </div>
                  <span className="text-base font-semibold text-[#333]">{t.name}</span>
                </div>
                <Image src="/images/okendo-logo.webp" alt="Okendo" width={48} height={48} className="h-12 w-12 object-contain" />
              </div>

              <div className="mb-1.5 text-base text-[#16a34a]" aria-hidden>
                ★★★★★
              </div>

              <h3 className="mb-1.5 text-sm font-bold uppercase tracking-wide text-[#1f2937]">
                {t.title}
              </h3>
              <p className="text-sm leading-snug text-[#4b5563]">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
