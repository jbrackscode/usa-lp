import { dealsUrl } from "@/lib/newsroom";

export function FinalCTA() {
  return (
    <div className="mx-5 mb-3 rounded-xl bg-nr-orange px-6 py-12 text-center sm:mx-10 sm:px-10">
      <span className="mb-6 inline-block rounded-full bg-white px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide text-nr-orange-dark">
        🔴 Limited Time Offer - Ends Soon
      </span>
      <h2 className="mb-3 text-[26px] font-black leading-[1.2] text-white sm:text-[38px]">
        Get Your Family on the Trails Every Weekend
      </h2>
      <p className="mb-5 text-base text-white/85">4, 5 &amp; 6-bike racks RRP $950. Bundles from $1,499.</p>
      <a
        href={dealsUrl}
        className="mb-4 inline-block rounded-full bg-white px-10 py-4 text-[17px] font-bold text-nr-orange-dark"
      >
        Today&apos;s Deals
      </a>
      <div className="mt-4 flex flex-wrap justify-center gap-7">
        {["4-year warranty", "Free shipping*", "20,000+ customers", "Secure checkout"].map((b) => (
          <div key={b} className="text-[13px] font-semibold text-white/85">
            ✓ {b}
          </div>
        ))}
      </div>
    </div>
  );
}
