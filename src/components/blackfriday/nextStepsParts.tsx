import Image from "next/image";
import type { ReactNode } from "react";

// Building blocks shared by NextSteps (server) and SizeColorSteps (client):
// the numbered step row and the one card shape every step uses.

export function BikeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="5" cy="11" r="4" />
      <circle cx="19" cy="11" r="4" />
      <path d="M5 11 9.5 4h6L19 11M9.5 4 12 11h-7M15.5 4l-3.5 7M8 2h3" />
    </svg>
  );
}

export function Step({ n, kicker, title, intro, children, last = false }: { n: string; kicker: string; title: string; intro: ReactNode; children: ReactNode; last?: boolean }) {
  return (
    <li className="relative grid grid-cols-[40px_1fr] gap-4 sm:grid-cols-[56px_1fr] sm:gap-7">
      {/* Number + the rail joining it to the next step. */}
      <div className="flex flex-col items-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange font-display text-[24px] leading-none text-white sm:h-14 sm:w-14 sm:text-[32px]">
          {n}
        </span>
        {!last && <span className="mt-2 w-0.5 flex-1 bg-[repeating-linear-gradient(to_bottom,#d9d9d9_0_6px,transparent_6px_12px)]" aria-hidden />}
      </div>
      <div className={`min-w-0 ${last ? "" : "pb-12 sm:pb-16"}`}>
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-[13px]">{kicker}</p>
        <h3 className="mt-1.5 text-[24px] font-extrabold uppercase leading-[1.1] tracking-tighter text-brand-black sm:text-[32px]">{title}</h3>
        <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-brand-black/75">{intro}</p>
        <div className="mt-6">{children}</div>
      </div>
    </li>
  );
}

// The one card shape every step shares: media on top (left on phones),
// then a small "eyebrow" row, a condensed title, a line of detail and an
// optional footer.
export const cardShell = "group relative flex overflow-hidden rounded-xl border-2 border-brand-line bg-white sm:flex-col";
export const cardBody = "flex min-w-0 flex-1 flex-col justify-center px-4 py-3.5 sm:justify-start sm:px-5 sm:pb-5 sm:pt-4";
export const cardTitle = "font-display text-[32px] uppercase leading-none text-brand-black sm:text-[38px]";
export const cardDetail = "mt-1.5 text-[14px] leading-snug text-brand-black/65";

export function CardImage({ src, alt, badge }: { src: string; alt: string; badge?: string }) {
  return (
    <div className="relative aspect-square w-[112px] shrink-0 bg-brand-cream sm:w-auto">
      {badge && (
        <span className="absolute left-2 top-2 z-10 whitespace-nowrap rounded-full bg-brand-black px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white sm:left-3 sm:top-3 sm:text-[10px]">
          {badge}
        </span>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 640px) 300px, 112px"
        loading="lazy"
        className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03] sm:p-4"
      />
    </div>
  );
}
