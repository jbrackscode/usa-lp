"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { reviewPhotos } from "@/lib/reviewPhotos";

// Varies each tile's aspect ratio so the desktop masonry columns don't all
// line up into a flat grid — a real "wall" rather than a uniform table.
const aspectByIndex = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"];

const INITIAL_VISIBLE = 4;

export function RacksInUse() {
  const trackRef = useRef<HTMLDivElement>(null);
  // Only one of the two layouts is ever actually mounted — rendering both
  // simultaneously (one CSS-hidden) was doubling this section's image count
  // to 80+ <img> tags, which was bloating the page and hurting PageSpeed.
  // Starts null so SSR/first paint ships neither (this section isn't the
  // LCP element), then picks the real layout once we know the viewport.
  const [layout, setLayout] = useState<"mobile" | "desktop" | null>(null);
  // Browsers' native `loading="lazy"` is distance-to-viewport based, which
  // doesn't account for horizontal scroll position inside a track — so in a
  // 41-wide horizontal carousel it was firing all 41 image requests at once
  // as soon as the section neared the viewport vertically. This tracks which
  // tiles have actually scrolled near horizontally and only mounts <Image>
  // for those (plus a small initial batch so the carousel isn't empty).
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(() => new Set(Array.from({ length: INITIAL_VISIBLE }, (_, i) => i)));

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setLayout(mq.matches ? "desktop" : "mobile");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (layout !== "mobile") return;
    const track = trackRef.current;
    if (!track) return;

    const tiles = track.querySelectorAll<HTMLElement>("[data-photo-index]");
    const observer = new IntersectionObserver(
      (entries) => {
        setLoadedIndexes((prev) => {
          let changed = false;
          const next = new Set(prev);
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const index = Number((entry.target as HTMLElement).dataset.photoIndex);
            if (!next.has(index)) {
              next.add(index);
              changed = true;
            }
            observer.unobserve(entry.target);
          }
          return changed ? next : prev;
        });
      },
      { root: track, rootMargin: "0px 400px 0px 400px" }
    );

    tiles.forEach((tile) => observer.observe(tile));
    return () => observer.disconnect();
  }, [layout]);

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

      {layout === "mobile" && (
        <div className="relative mx-auto max-w-[1100px]">
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
                {loadedIndexes.has(i) && (
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 230px, 190px" className="object-cover" priority={i === 0} />
                )}
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
      )}

      {layout === "desktop" && (
        <div className="mx-auto max-w-[1100px] px-6">
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
      )}
    </div>
  );
}
