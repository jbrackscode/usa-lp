import type { Metadata } from "next";
import { Header } from "@/components/lp/Header";
import { Footer } from "@/components/lp/Footer";
import { FAQ } from "@/components/lp/FAQ";
import { Ticker } from "@/components/bikeracks/Ticker";
import { OfferBanner } from "@/components/bikeracks/OfferBanner";
import { Hero } from "@/components/bikeracks/Hero";
import { ProblemBand } from "@/components/bikeracks/ProblemBand";
import { ReasonsList } from "@/components/bikeracks/ReasonsList";
import { TestedGrid } from "@/components/bikeracks/TestedGrid";
import { CompareTable } from "@/components/bikeracks/CompareTable";
import { Testimonials } from "@/components/bikeracks/Testimonials";
import { BundleOffer } from "@/components/bikeracks/BundleOffer";
import { WarrantyBand } from "@/components/bikeracks/WarrantyBand";
import { FinalCta } from "@/components/bikeracks/FinalCta";
import { BuyBox } from "@/components/bikeracks/BuyBox";
import { StickyBuyBar } from "@/components/bikeracks/StickyBuyBar";
import { sizesNote, faqs } from "@/lib/bikeRacksListicle";
import { getLiveBikeRackData } from "@/lib/bikeRacksLive";

export const metadata: Metadata = {
  title: "JB Racks — Build Your Vertical Bike Rack",
  description: "The vertical hitch rack built for what e-bikes actually weigh. Pick your size, color, and add-ons.",
};

// ISR instead of force-dynamic: the page (and its live Shopify price fetch)
// is cached and served instantly, then regenerated in the background at
// most every 5 minutes — a price change on the live store still shows up
// without a redeploy, but visitors aren't blocked on a live API round trip
// on every single request (that was tanking TTFB/PageSpeed).
export const revalidate = 300;

export default async function LpBikeRacksPage() {
  const { rackSizes, addons, outOfStockVariantIds } = await getLiveBikeRackData();

  return (
    <>
      <OfferBanner />
      <Header />
      <main className="bg-white pb-16 sm:pb-0">
        <Hero />
        <Ticker />

        {/* <ProblemBand /> */}
        <ReasonsList />

        <div className="border-t border-brand-line bg-white py-12 sm:py-14" id="sizes-head">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="mx-auto mb-10 max-w-[72ch] text-center">
              <div className="mb-2.5 text-sm font-bold text-brand-green-dark">CHOOSE YOUR SIZE</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">
                One rack platform. Built for however many bikes you&apos;re actually hauling.
              </h2>
            </div>
          </div>
          <BuyBox rackSizes={rackSizes} addons={addons} outOfStockVariantIds={outOfStockVariantIds} />
          <p className="mx-auto -mt-6 max-w-[1100px] px-6 text-[12.5px] text-brand-black/50">{sizesNote}</p>
        </div>

        <TestedGrid />
        <CompareTable />
        <Testimonials />
        <BundleOffer rackSizes={rackSizes} addons={addons} />
        <WarrantyBand />

        <section className="border-t border-brand-line py-12 sm:py-14">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="mx-auto mb-9 max-w-[62ch] text-center">
              <div className="mb-2.5 text-sm font-bold text-brand-green-dark">QUESTIONS</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">Before you order</h2>
            </div>
            <div className="mx-auto max-w-[760px]">
              <FAQ faqs={faqs} />
            </div>
          </div>
        </section>

        <FinalCta rackSizes={rackSizes} />
      </main>
      <Footer />
      <StickyBuyBar />
    </>
  );
}
