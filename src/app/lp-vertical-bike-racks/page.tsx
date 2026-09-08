import type { Metadata } from "next";
import { Header } from "@/components/lp/Header";
import { Footer } from "@/components/lp/Footer";
import { OfferBanner } from "@/components/bikeracks/OfferBanner";
import { Ticker } from "@/components/bikeracks/Ticker";
import { BuyBox } from "@/components/bikeracks/BuyBox";
import { ProductFeatureBadges } from "@/components/bikeracks/ProductFeatureBadges";
import { ProductDescription } from "@/components/bikeracks/ProductDescription";
import { PressTestimonials } from "@/components/bikeracks/PressTestimonials";
import { TrustIconsRow } from "@/components/bikeracks/TrustIconsRow";
import { KeyFeaturesGrid } from "@/components/bikeracks/KeyFeaturesGrid";
import { QualityBlock } from "@/components/bikeracks/QualityBlock";
import { CompareTable } from "@/components/bikeracks/CompareTable";
import { InfluencerQuote } from "@/components/bikeracks/InfluencerQuote";
import { ReviewsCarousel } from "@/components/bikeracks/ReviewsCarousel";
import { RacksInUse } from "@/components/bikeracks/RacksInUse";
import { WarrantyBand } from "@/components/bikeracks/WarrantyBand";
import { FaqChat } from "@/components/bikeracks/FaqChat";
import { FinalCta } from "@/components/bikeracks/FinalCta";
import { getLiveBikeRackData } from "@/lib/bikeRacksLive";

export const metadata: Metadata = {
  title: "4 Vertical Bike Rack — JB Racks",
  description: "The JB 4 Rack is built for hauling four bikes with ease — e-bike rated, 65 lbs per wheel holder, 240 lbs total capacity.",
};

// ISR instead of force-dynamic: the page (and its live Shopify price fetch)
// is cached and served instantly, then regenerated in the background at
// most every 5 minutes — a price change on the live store still shows up
// without a redeploy, but visitors aren't blocked on a live API round trip
// on every single request (that was tanking TTFB/PageSpeed).
export const revalidate = 300;

export default async function LpVerticalBikeRacksPage() {
  const { rackSizes, addons, outOfStockVariantIds } = await getLiveBikeRackData();

  return (
    <>
      <OfferBanner />
      <Header />
      <Ticker />
      <main className="bg-white pb-16 sm:pb-0">
        <BuyBox rackSizes={rackSizes} addons={addons} showSpecs stickyAddToCart outOfStockVariantIds={outOfStockVariantIds} />
        <ProductFeatureBadges />
        {/* <ProductDescription /> */}
        <PressTestimonials />
        <TrustIconsRow />
        <KeyFeaturesGrid />
        <QualityBlock />
        <CompareTable />
        <InfluencerQuote />
        <RacksInUse />
        <ReviewsCarousel />
        <WarrantyBand />
        <FaqChat />

        <FinalCta rackSizes={rackSizes} />
      </main>
      <Footer />
    </>
  );
}
