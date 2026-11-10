import type { Metadata } from "next";
import { ComparisonTable } from "@/components/lp/ComparisonTable";
import { InUseMarquee } from "@/components/bikeracks/InUseMarquee";
import { ReviewsColumn } from "@/components/bikeracks/ReviewsColumn";
import { FAQ } from "@/components/lp/FAQ";
import { ClosingCTA } from "@/components/lp/ClosingCTA";
import { Footer } from "@/components/lp/Footer";
import { BlackFridayBar } from "@/components/blackfriday/BlackFridayBar";
import { ArticleHeader } from "@/components/blackfriday/ArticleHeader";
import { ArticleReason } from "@/components/blackfriday/ArticleReason";
import { EditorsNote } from "@/components/blackfriday/EditorsNote";
import { BlackFridayOffer } from "@/components/blackfriday/BlackFridayOffer";
import { SaleChips } from "@/components/blackfriday/SaleChips";
import { featureRows, product } from "@/lib/config";
import { getLiveBikeRackData } from "@/lib/bikeRacksLive";
import { getBlackFridayOffer } from "@/lib/blackFriday";
import { getVisibleReviewPhotos } from "@/lib/okendo";

// Black Friday advertorial built from /lp-demonstration-videos' content.
// Reads as an article first (sentence-case headline, summary, intro, five
// numbered reasons with the same videos and real owner
// quotes), with the sale kept to the top strip, a soft editor's note
// mid-article, and the full offer (countdown + sale-progress bar) low on
// the page — then customer photos, reviews and the FAQ. Every offer number
// comes from live Shopify pricing via getBlackFridayOffer.
export const metadata: Metadata = {
  title: "5 Reasons 20,000+ Riders Swear by Vertical Bike Racks - JB Racks",
  description:
    "Why riders are switching to vertical hitch racks - plus JB Racks' Black Friday sale on every rack size. E-bike rated, 4-year warranty, free shipping.",
};

// Same 5-minute ISR as the other buy-box pages — pricing comes from the same
// live (cached) Shopify data instead of a static number.
export const revalidate = 300;

// Verbatim excerpts from 5-star reviews in verticalRackReviews.ts, matched
// to the reason they back up.
const reasonQuotes = [
  { text: "Easy to load bikes on and off.", author: "Scott G." },
  { text: "Great bike rack, quality build and excellent value for money.", author: "Angus B." },
  { text: "Bike went on easy, they did not touch each other.", author: "Sandy M." },
  { text: "Fits well. No issues. Perfect design.", author: "Russell W." },
  {
    text: "…it is super easy to load and take off the bikes; there is no adjusting and readjusting to get the bikes to fit.",
    author: "Michael O.",
  },
];

export default async function LpDemoBlackFridayPage() {
  // Customer photos are checked against Okendo's public feed so any photo
  // hidden in Okendo never reaches the "racks in use" strip.
  const [{ rackSizes }, photos] = await Promise.all([getLiveBikeRackData(), getVisibleReviewPhotos()]);
  const offer = getBlackFridayOffer(rackSizes);

  const reasons = featureRows.map((row, i) => (
    <ArticleReason
      key={row.title}
      number={i + 1}
      title={row.title}
      // This page uses hyphens, not em dashes; featureRows is shared with
      // the /lp-demonstration pages, so it's swapped here rather than there.
      body={row.body.replaceAll(" — ", " - ")}
      image={row.image}
      // Light 560x560 encodes of the same square clips plus a first-frame
      // poster each, in /videos/bf — ~1.1 MB total vs ~11.6 MB for the
      // 1080p originals the other pages use.
      video={row.video.replace("/videos/", "/videos/bf/")}
      poster={row.video.replace("/videos/", "/videos/bf/").replace(/\.mp4$/, ".webp")}
      quote={reasonQuotes[i]}
    />
  ));

  return (
    <>
      <BlackFridayBar offer={offer} />
      {/* Header/nav bar hidden on this page for now — re-add
          <StoreNavHeader /> (components/blackfriday) here to bring it back. */}
      <main className="bg-white">
        <ArticleHeader />

        {reasons.slice(0, 2)}
        <EditorsNote offer={offer} />
        {reasons.slice(2)}

        <div className="mt-14">
          <ComparisonTable price={offer.price} ctaHref={product.productUrl} />
        </div>

        <BlackFridayOffer offer={offer} />

        <InUseMarquee photos={photos} />
        <ReviewsColumn />
        <SaleChips offer={offer} />

        <section className="pb-[39px] pt-[30px] sm:pb-[52px] sm:pt-10">
          <div className="mx-auto max-w-[1000px] px-5">
            <h2 className="mb-6 text-center text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <FAQ />
          </div>
        </section>

        {/* Every "Claim My Rack" on this page goes to the 4-bike rack's
            product page on the store rather than straight to checkout. */}
        <ClosingCTA price={offer.price} ctaHref={product.productUrl} />
      </main>
      <Footer />
    </>
  );
}
