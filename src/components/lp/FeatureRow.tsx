"use client";

import { useState } from "react";
import Image from "next/image";

type FeatureRowProps = {
  image: string;
  // Optional — when set (the /lp-demonstration-videos page), renders this
  // video instead of the static image, same frame/crop. The poster image
  // stays visible (with a small loading indicator over it) until the video
  // actually reports it can play, then cross-fades in — so there's never a
  // blank/empty tile while the video downloads.
  video?: string;
  title: string;
  body: string;
};

export function FeatureRow({ image, video, title, body }: FeatureRowProps) {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className="mx-auto mb-5 grid max-w-[1000px] grid-cols-1 sm:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-brand-cream shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        {video ? (
          <>
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 640px) 500px, 100vw"
              className={`object-cover transition-opacity duration-500 ${videoReady ? "opacity-0" : "opacity-100"}`}
            />
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
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
        ) : (
          <Image src={image} alt="" fill sizes="(min-width: 640px) 500px, 100vw" className="object-cover" />
        )}
      </div>
      <div className="flex flex-col justify-center px-5 py-8 sm:px-8">
        <h2 className="text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black sm:text-5xl">{title}</h2>
        <p className="mt-3 max-w-md text-base text-brand-black/80">{body}</p>
      </div>
    </div>
  );
}
