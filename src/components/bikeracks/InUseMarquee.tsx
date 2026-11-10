"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { reviewPhotos, type ReviewPhoto } from "@/lib/reviewPhotos";

// The same real customer photos as RacksInUse, as a continuously scrolling
// full-bleed strip instead of a carousel/masonry wall. Same two-copy trick
// as Ticker: the track holds two identical sets and animates by exactly
// -50%, so the loop point is pixel-identical. Pauses on hover so a shopper
// can actually look at a photo, and stops for reduced-motion users.
//
// Native lazy loading only reacts to vertical distance, so tiles sliding in
// sideways were still mid-download and showed up blank. Instead nothing is
// mounted until the section is within ~a screen of the viewport, then
// photos mount in order, in batches that stay ahead of the scroll: the
// strip moves about one tile every ~4.3s at every breakpoint, so a first
// batch of 12 (≈8 tiles past a desktop viewport) plus 2 more every 4s
// keeps every tile loaded before it slides in — without pulling all 42 at
// once, most of which a visitor never scrolls far enough to see.
const INITIAL_BATCH = 12;
const BATCH_SIZE = 2;
const BATCH_INTERVAL_MS = 4000;

// `photos` defaults to the static list; /lp-demo-black-friday passes the
// Okendo-filtered one (getVisibleReviewPhotos) so hidden photos never show.
export function InUseMarquee({ photos = reviewPhotos }: { photos?: ReviewPhoto[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mountedCount, setMountedCount] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMountedCount(INITIAL_BATCH);
          observer.disconnect();
        }
      },
      { rootMargin: "1000px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mountedCount === 0 || mountedCount >= photos.length) return;
    const id = setTimeout(() => setMountedCount((n) => Math.min(photos.length, n + BATCH_SIZE)), BATCH_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [mountedCount, photos.length]);

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
          <PhotoSet photos={photos} mountedCount={mountedCount} />
          <PhotoSet photos={photos} mountedCount={mountedCount} aria-hidden />
        </div>
      </div>
    </div>
  );
}

function PhotoSet({ photos, mountedCount, "aria-hidden": ariaHidden }: { photos: ReviewPhoto[]; mountedCount: number; "aria-hidden"?: boolean }) {
  return (
    <div className="flex shrink-0 gap-3 pr-3" aria-hidden={ariaHidden}>
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          className="relative h-[240px] w-[180px] shrink-0 overflow-hidden rounded-xl bg-brand-cream sm:h-[300px] sm:w-[225px] lg:h-[440px] lg:w-[330px]"
        >
          {i < mountedCount && (
            <Image
              src={photo.src}
              alt={ariaHidden ? "" : photo.alt}
              fill
              loading="eager"
              // Phones ask for less than the 180px tile so a 3x screen gets
              // the 384w file (~2x density, plenty for a moving strip)
              // instead of 640w at roughly 3x the bytes.
              sizes="(min-width: 1024px) 330px, (min-width: 640px) 225px, 120px"
              className="object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}
