import { currentOffer } from "@/lib/offer";

// Renders nothing unless NEXT_PUBLIC_OFFER_TEXT is set — see
// .env.local.example. The link is optional; without one, the text renders
// as a plain (unlinked) banner.
export function OfferBanner() {
  if (!currentOffer.text) return null;

  const content = (
    <span className="text-[13px] font-bold text-white sm:text-sm">
      {currentOffer.text}
      {currentOffer.link && (
        <span className="ml-2 underline decoration-white/50 underline-offset-4">Shop Now →</span>
      )}
    </span>
  );

  return (
    <div className="bg-brand-orange py-2.5 text-center">
      {currentOffer.link ? (
        <a href={currentOffer.link} className="inline-block px-4">
          {content}
        </a>
      ) : (
        <div className="px-4">{content}</div>
      )}
    </div>
  );
}
