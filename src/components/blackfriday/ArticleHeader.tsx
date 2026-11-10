// Advertorial opening for /lp-demo-black-friday, laid out like the Hollow
// Socks listicle intro: left-aligned in the same 1000px container as the
// reason rows below (so the headline lines up with their media), a
// problem-question headline, a regular-weight "N reasons X is the best Y you
// can buy" line tight underneath, then a summary set off by a dark left bar
// with a mono "Summary:" label (matching the reasons' inset counts).
export function ArticleHeader() {
  return (
    <header className="mx-auto max-w-[1000px] px-5 pt-10 sm:pt-14">
      <h1 className="text-[30px] font-black uppercase leading-[1.1] tracking-tight text-nr-ink sm:text-[44px] lg:text-[52px]">
        Tired of wrestling heavy bikes onto your rack?
      </h1>

      <p className="mt-3 text-[19px] font-normal leading-[1.35] text-nr-ink sm:text-[24px]">
        5 Reasons A Vertical Rack Is The Best Bike Rack You Can Buy
      </p>

      <div className="mt-8 border-l-4 border-nr-ink py-1 pl-5 sm:mt-10">
        <p className="mb-1.5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-nr-ink-mid">Summary:</p>
        <p className="text-[17px] font-semibold leading-[1.55] text-nr-ink sm:text-[18px]">
          The JB Racks vertical hitch rack has 5 big benefits that&apos;ll ruin platform and roof racks for you forever.
        </p>
      </div>
    </header>
  );
}
