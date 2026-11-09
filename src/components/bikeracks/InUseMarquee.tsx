"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { reviewPhotos } from "@/lib/reviewPhotos";

// The same real customer photos as RacksInUse, as a continuously scrolling
// full-bleed strip instead of a carousel/masonry wall. Same two-copy trick
// as Ticker: the track holds two identical sets and animates by exactly
// -50%, so the loop point is pixel-identical. Pauses on hover so a shopper
// can actually look at a photo, and stops for reduced-motion users.
//
// Native lazy loading only reacts to vertical distance, so tiles sliding in
// sideways were still mid-download and showed up blank. Instead nothing is
// mounted until the section is within ~a screen of the viewport, then every
// photo loads eagerly so the strip is full by the time it's seen — without
// pulling 40+ images during the initial page load.
export function InUseMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1000px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} id="racks-in-use" className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-8 max-w-[62ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">REAL CUSTOMERS, REAL RACKS</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">Loaded Up and Ready to Ride</h2>
        </div>
      </div>

      <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="flex w-max animate-[bikeracks-ticker_180s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <PhotoSet load={nearViewport} />
          <PhotoSet load={nearViewport} aria-hidden />
        </div>
      </div>
    </div>
  );
}

function PhotoSet({ load, "aria-hidden": ariaHidden }: { load: boolean; "aria-hidden"?: boolean }) {
  return (
    <div className="flex shrink-0 gap-3 pr-3" aria-hidden={ariaHidden}>
      {reviewPhotos.map((photo) => (
        <div
          key={photo.src}
          className="relative h-[240px] w-[180px] shrink-0 overflow-hidden rounded-xl bg-brand-cream sm:h-[300px] sm:w-[225px] lg:h-[440px] lg:w-[330px]"
        >
          {load && (
            <Image
              src={photo.src}
              alt={ariaHidden ? "" : photo.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 330px, (min-width: 640px) 225px, 180px"
              className="object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}
