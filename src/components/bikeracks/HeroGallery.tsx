"use client";

import { useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { heroGallery } from "@/lib/bikeRacksListicle";

export function HeroGallery() {
  const [index, setIndex] = useState(0);
  const slide = heroGallery[index];

  function prevSlide() {
    setIndex((i) => (i - 1 + heroGallery.length) % heroGallery.length);
  }
  function nextSlide() {
    setIndex((i) => (i + 1) % heroGallery.length);
  }

  // Same swipe pattern as the BuyBox gallery — arrow buttons are desktop-
  // only (hover-revealed), so touch is the sole navigation on mobile.
  const touchStartX = useRef<number | null>(null);
  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  }

  return (
    <div className="relative">
      <div
        className="group relative aspect-[1/1] w-full touch-pan-y overflow-hidden sm:rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slide.type === "image" && (
          <>
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="(min-width: 1024px) 500px, 100vw"
              className={slide.fit === "contain" ? "bg-white object-contain" : "object-cover"}
              priority={index === 0}
            />
            {slide.pill && (
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-black shadow">
                {slide.pill}
              </span>
            )}
            {slide.badge && (
              <div className="absolute bottom-4 left-4 max-w-[190px] rounded-lg bg-brand-black px-[18px] py-3.5 text-white shadow-md">
                <div className="text-2xl font-extrabold leading-none">{slide.badge.num}</div>
                <div className="mt-1 text-xs text-white/70">{slide.badge.label}</div>
              </div>
            )}
          </>
        )}

        {slide.type === "stats" && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-brand-black px-8 text-center text-white">
            <div className="mb-6 text-xs font-bold tracking-[0.15em] text-brand-green">{slide.headline}</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-7">
              {slide.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold leading-none sm:text-3xl">{s.value}</div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-wide text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === "replaces" && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-white px-8 text-center">
            <div className="mb-6 text-xs font-bold tracking-[0.15em] text-brand-green-dark">{slide.headline}</div>
            <ul className="flex flex-col gap-3">
              {slide.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[15px] font-semibold text-brand-black">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-[11px] font-bold text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Desktop only (mobile navigates by swipe/dots), and hidden until
            the gallery itself is hovered — no controls sitting on top of
            the image otherwise. */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-brand-black opacity-0 shadow transition-opacity duration-200 hover:bg-white group-hover:opacity-100 sm:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-brand-black opacity-0 shadow transition-opacity duration-200 hover:bg-white group-hover:opacity-100 sm:flex"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {heroGallery.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-black" : "w-1.5 bg-brand-black/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
