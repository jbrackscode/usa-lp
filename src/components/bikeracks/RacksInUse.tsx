"use client";

import { useRef } from "react";
import Image from "next/image";
import { reviewPhotos } from "@/lib/reviewPhotos";

// Varies each tile's aspect ratio so the desktop masonry columns don't all
// line up into a flat grid — a real "wall" rather than a uniform table.
const aspectByIndex = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"];

export function RacksInUse() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * (track.clientWidth * 0.85), behavior: "smooth" });
  }

  return (
    <div id="racks-in-use" className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-8 max-w-[62ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">{reviewPhotos.length}+ CUSTOMER PHOTOS</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">Racks in Use</h2>
        </div>
      </div>

      {/* Mobile / tablet: swipeable carousel */}
      <div className="relative mx-auto max-w-[1100px] lg:hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviewPhotos.map((photo, i) => (
            <div
              key={photo.src}
              data-photo-index={i}
              className={`rack-photo rack-photo-${i} relative aspect-[3/4] w-[190px] shrink-0 snap-start overflow-hidden rounded-xl bg-brand-cream sm:w-[230px]`}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 230px, 190px" className="object-cover" priority={i === 0} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll photos left"
          className="absolute -left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-brand-black shadow-md hover:bg-brand-cream sm:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Scroll photos right"
          className="absolute -right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-brand-black shadow-md hover:bg-brand-cream sm:flex"
        >
          ›
        </button>
      </div>

      {/* Desktop: masonry wall, no scroller */}
      <div className="mx-auto hidden max-w-[1100px] px-6 lg:block">
        <div className="columns-3 gap-3 xl:columns-4">
          {reviewPhotos.map((photo, i) => (
            <div
              key={photo.src}
              data-photo-index={i}
              className={`rack-photo rack-photo-${i} relative mb-3 w-full overflow-hidden rounded-xl bg-brand-cream break-inside-avoid ${aspectByIndex[i % aspectByIndex.length]}`}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="280px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
