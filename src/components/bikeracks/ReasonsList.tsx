"use client";

import { useState } from "react";
import Image from "next/image";
import { reasons, reasonsEyebrow, reasonsHeadline } from "@/lib/bikeRacksListicle";

function ReasonMedia({ image, video, title }: { image: string; video?: string; title: string }) {
  const [videoReady, setVideoReady] = useState(false);

  if (!video) {
    return <Image src={image} alt={title} fill sizes="(min-width: 640px) 500px, 100vw" className="object-cover" />;
  }

  return (
    <>
      {!videoReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-cream">
          <div className="flex items-center gap-2 rounded-full bg-brand-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
            Loading video…
          </div>
        </div>
      )}
      <video
        src={video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}

export function ReasonsList() {
  return (
    <div className="py-12 sm:py-14" id="reasons">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-10 max-w-[82ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">{reasonsEyebrow}</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">{reasonsHeadline}</h2>
        </div>

        <div>
          {reasons.map((r, i) => (
            <div
              key={r.number}
              className={`grid grid-cols-1 items-center gap-6 border-t border-brand-line py-9 sm:grid-cols-2 sm:gap-10 sm:py-10 ${
                i === reasons.length - 1 ? "border-b" : ""
              }`}
            >
              {/* Text: shows second on mobile (below the image), left column on desktop */}
              <div className="order-2 sm:order-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black leading-none text-brand-green">{r.number}</span>
                  <h3 className="text-3xl tracking-tighter uppercase font-black leading-[1.25] text-brand-black">{r.title}</h3>
                </div>
                <p className="mt-2.5 max-w-[52ch] text-[15px] text-brand-black/70">{r.body}</p>
              </div>

              {/* Media: shows first on mobile, right column on desktop */}
              <div className="relative order-1 aspect-[1/1] w-full overflow-hidden rounded-xl bg-white sm:order-2">
                <ReasonMedia image={r.image} video={r.video} title={r.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
