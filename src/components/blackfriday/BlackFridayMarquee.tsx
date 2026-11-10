import Image from "next/image";

// The jbracks.com "BLACK FRIDAY" lockup (public/images/jb-racks-black-friday.svg)
// scrolling across the store's .bf-marquee gradient band (globals.css). Sits
// where the article hands over to the offer, right above the black
// BlackFridayOffer section, so the band's black bottom rule runs straight
// into it. Same two-copy -50% loop as the other tickers, so the loop point
// is seamless; each copy is wider than a 1920px screen so there's never a
// gap. Scroll and gradient drift both stop for reduced-motion users.
const LOGOS_PER_COPY = 8;

export function BlackFridayMarquee() {
  return (
    <div className="bf-marquee">
      <div className="flex w-max animate-[bikeracks-ticker_40s_linear_infinite] motion-reduce:animate-none">
        <LogoSet />
        <LogoSet aria-hidden />
      </div>
    </div>
  );
}

function LogoSet({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14" aria-hidden={ariaHidden}>
      {Array.from({ length: LOGOS_PER_COPY }, (_, i) => (
        <Image
          key={i}
          src="/images/jb-racks-black-friday.svg"
          // Only the very first lockup is announced; the repeats are decorative.
          alt={!ariaHidden && i === 0 ? "JB Racks Black Friday" : ""}
          width={1213}
          height={311}
          // A static SVG — nothing for the image optimizer to do.
          unoptimized
          // Lazy loading ignores horizontal distance, so off-screen repeats
          // would scroll in blank. It's one 3.7 KB file, cached after the
          // first request, so loading every copy up front costs nothing.
          loading="eager"
          className="h-[52px] w-auto shrink-0 sm:h-[76px]"
        />
      ))}
    </div>
  );
}
