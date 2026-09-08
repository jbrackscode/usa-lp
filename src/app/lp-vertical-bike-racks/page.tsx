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
import { StickyBuyBar } from "@/components/bikeracks/StickyBuyBar";
import { getLiveBikeRackData } from "@/lib/bikeRacksLive";

export const metadata: Metadata = {
  title: "4 Vertical Bike Rack — JB Racks",
  description: "The JB 4 Rack is built for hauling four bikes with ease — e-bike rated, 65 lbs per wheel holder, 240 lbs total capacity.",
};

// Prices are fetched fresh from Shopify on every request rather than cached
// with the rest of this static page, so a price change on the live store
// shows up here without a redeploy.
export const dynamic = "force-dynamic";

export default async function LpVerticalBikeRacksPage() {
  const { rackSizes, addons } = await getLiveBikeRackData();

  return (
    <>
      <OfferBanner />
      <Header />
      <Ticker />
      <main className="bg-white pb-16 sm:pb-0">
        <BuyBox rackSizes={rackSizes} addons={addons} showSpecs />
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
      <StickyBuyBar />
    </>
  );
}
