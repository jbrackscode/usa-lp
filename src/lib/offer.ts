// Site-wide "current offer" banner, driven entirely by env vars — see
// .env.local.example. Leave NEXT_PUBLIC_OFFER_TEXT blank and OfferBanner
// renders nothing (no empty bar, no broken link).
export const currentOffer = {
  text: process.env.NEXT_PUBLIC_OFFER_TEXT ?? "",
  link: process.env.NEXT_PUBLIC_OFFER_LINK ?? "",
};
