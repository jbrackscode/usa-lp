"use client";

import { useEffect, useRef } from "react";
import { quality } from "@/lib/verticalRackPdp";

export function QualityBlock() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Don't fetch the video at all until it's about to scroll into view —
  // it sits well below the fold, so loading it eagerly on page load just
  // adds dead weight to initial page load time for nothing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.src = quality.video;
          video.play().catch(() => {});
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="mx-auto mb-8 max-w-[36ch] text-center text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black sm:mb-10 sm:text-5xl">
          {quality.headline} <span className="text-brand-orange">{quality.headlineAccent}</span>
        </h2>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <video
            ref={videoRef}
            className="aspect-video w-full rounded-xl bg-brand-cream object-cover"
            muted
            loop
            playsInline
            preload="none"
          />

          <ul className="flex flex-col gap-0 divide-y divide-brand-line">
            {quality.items.map((item) => (
              <li key={item.title} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-[11px] font-bold text-white">
                  ✓
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-brand-black">{item.title}</h3>
                  <p className="text-[13.5px] text-brand-black/60">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
