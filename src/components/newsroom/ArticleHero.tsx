export function ArticleHero() {
  return (
    <div className="border-b-[3px] border-nr-orange bg-white px-5 py-9 sm:px-10 sm:py-11">
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nr-orange-light text-lg"
          aria-hidden
        >
          🚲
        </span>
        <div className="text-[13px] text-nr-ink-muted">
          <strong className="block text-nr-ink">JB Racks Editorial Team</strong>
          Published · 2026
        </div>
      </div>

      <h1 className="mb-4 text-[26px] font-black leading-[1.15] tracking-tight text-nr-ink sm:text-[42px] lg:text-[56px]">
        7 Reasons Why Vertical Bike Racks Are <em className="italic text-nr-orange">Every Family&apos;s</em> Secret
        Weapon for Weekend Rides
      </h1>

      <div className="rounded-r-md border-l-4 border-nr-orange bg-nr-orange-light px-[18px] py-[14px] text-base text-nr-ink-mid">
        <strong className="text-nr-ink">Summary: </strong>
        We break down why families across Australia are switching from platform racks - and why once you go
        vertical, you&apos;ll never go back. After years of wrestling with roof racks and losing car boots to
        platform racks, here&apos;s the solution that changes weekends completely.
      </div>
    </div>
  );
}
