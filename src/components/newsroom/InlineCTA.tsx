import { dealsUrl } from "@/lib/newsroom";

export function InlineCTA() {
  return (
    <div className="mx-5 my-10 flex flex-col items-center gap-6 rounded-xl bg-nr-ink px-6 py-7 text-center text-white sm:mx-10 sm:flex-row sm:justify-between sm:text-left">
      <div>
        <h4 className="mb-1.5 text-xl font-bold text-white">Ready to upgrade your family&apos;s weekends?</h4>
        <p className="text-sm text-white/65">4, 5 &amp; 6-bike racks. Free Slow-Fold Strut included. Limited time offer.</p>
        <span className="mt-1.5 block text-2xl font-bold text-nr-orange">RRP $950 - Bundles from $1,499</span>
        <div className="mt-3.5 flex flex-wrap justify-center gap-5 sm:justify-start">
          {["4-year warranty", "Free shipping*", "20,000+ customers", "Secure checkout"].map((b) => (
            <div key={b} className="text-xs text-white/55">
              {b}
            </div>
          ))}
        </div>
      </div>
      <a
        href={dealsUrl}
        className="inline-block shrink-0 whitespace-nowrap rounded-full bg-nr-orange px-7 py-3.5 text-[15px] font-bold text-white"
      >
        Today&apos;s Deals →
      </a>
    </div>
  );
}
