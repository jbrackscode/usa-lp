import { pdpTestimonials } from "@/lib/verticalRackPdp";

// Compact desktop-only quote strip — matches the real product page, which
// hides this block below 990px in favor of the fuller Testimonials section.
export function PressTestimonials() {
  return (
    <div className="hidden border-t border-brand-line py-10 lg:block">
      <div className="mx-auto grid max-w-[1100px] grid-cols-3 gap-8 px-6 text-center">
        {pdpTestimonials.map((t) => (
          <div key={t.author}>
            <div className="text-brand-star tracking-widest">★★★★★</div>
            <p className="mx-auto mt-2 max-w-[38ch] text-[13.5px] leading-relaxed text-brand-black/70">{t.quote}</p>
            <p className="mt-2 text-[13px] font-bold text-brand-black">{t.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
