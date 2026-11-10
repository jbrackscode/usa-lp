// Advertorial opening for /lp-demo-black-friday: kicker, a sentence-case
// headline (not the all-caps ad headline the other LPs use), summary box
// and two intro paragraphs. US copy — the /lp-newsroom components this is
// modeled on are written for Australia.
export function ArticleHeader() {
  return (
    <header className="mx-auto max-w-[760px] px-5 pt-8 sm:pt-12">
      <div className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.14em] text-brand-green-dark">Riding Guide · 4 min read</div>

      <h1 className="text-[30px] font-black uppercase leading-[1.12] tracking-tight text-nr-ink sm:text-[44px] lg:text-[50px]">
        Tired of wrestling heavy bikes onto your rack? 5 reasons 20,000+ riders{" "}
        <span className="bg-[linear-gradient(transparent_58%,var(--color-brand-yellow)_58%)] px-0.5">swear by vertical</span>
      </h1>

      <div className="mt-7 rounded-r-md border-l-4 border-brand-yellow bg-nr-bg px-[18px] py-[14px] text-base leading-[1.7] text-nr-ink-mid">
        <strong className="text-nr-ink">The short version: </strong>
        Vertical hitch racks carry bikes upright instead of side by side on a tray - so they load faster, fit more bikes
        in less space, and keep bikes from knocking into each other. Here&apos;s why riders are switching, and what
        owners say after making the move.
      </div>

      <div className="mt-7 space-y-4 text-[18px] leading-[1.75] text-nr-ink-mid">
        <p>
          A bike rack doesn&apos;t usually make headlines. But more and more riders are trading roof racks and
          tray-style platform racks for vertical hitch racks - and once you&apos;ve loaded one, it&apos;s easy to see why.
        </p>
        <p>
          If you&apos;ve ever lifted a heavy e-bike overhead onto a roof rack, or played Tetris with pedals and
          handlebars on a platform rack, you already know the problem. Here are five reasons over 20,000 riders made
          the switch to JB Racks.
        </p>
      </div>
    </header>
  );
}
