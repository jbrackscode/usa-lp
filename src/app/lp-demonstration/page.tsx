import type { Metadata } from "next";
import { PromoBar } from "@/components/lp/PromoBar";
import { Header } from "@/components/lp/Header";
import { Hero } from "@/components/lp/Hero";
import { FeatureRow } from "@/components/lp/FeatureRow";
import { ComparisonTable } from "@/components/lp/ComparisonTable";
import { PricingSection } from "@/components/lp/PricingSection";
import { Testimonials } from "@/components/lp/Testimonials";
import { FAQ } from "@/components/lp/FAQ";
import { ClosingCTA } from "@/components/lp/ClosingCTA";
import { Footer } from "@/components/lp/Footer";
import { featureRows } from "@/lib/config";
import { getLiveBikeRackData } from "@/lib/bikeRacksLive";

export const metadata: Metadata = {
  title: "JB Racks — Vertical Bike Rack",
  description:
    "5 reasons 20,000+ riders swear by vertical. E-bike rated, 4-year warranty, free shipping.",
};

// Same 5-minute ISR as the other buy-box pages — the promo bar's price now
// comes from the same live (cached) Shopify data instead of a static number.
export const revalidate = 300;

export default async function LpDemonstrationPage() {
  const [row1, row2, row3, row4, row5] = featureRows;
  const { rackSizes } = await getLiveBikeRackData();
  const fourBike = rackSizes.find((r) => r.bikes === 4);

  return (
    <>
      <PromoBar price={fourBike?.price} />
      <Header />
      <main className="bg-white">
        <Hero />

        {/* image={row.image} title={row.title} body={row.body} only —
            never spread the row, since it also carries a `video` field
            meant for /lp-demonstration-videos only. */}
        <FeatureRow image={row1.image} title={row1.title} body={row1.body} />
        <FeatureRow image={row2.image} title={row2.title} body={row2.body} />

        <ComparisonTable price={fourBike?.price} />

        <FeatureRow image={row3.image} title={row3.title} body={row3.body} />
        <FeatureRow image={row4.image} title={row4.title} body={row4.body} />
        <FeatureRow image={row5.image} title={row5.title} body={row5.body} />

        <PricingSection price={fourBike?.price} compareAtPrice={fourBike?.compareAtPrice} />
        <Testimonials />

        <section className="pb-[39px] pt-[30px] sm:pb-[52px] sm:pt-10">
          <div className="mx-auto max-w-[1000px] px-5">
            <h2 className="mb-6 text-center text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <FAQ />
          </div>
        </section>

        <ClosingCTA price={fourBike?.price} />
      </main>
      <Footer />
    </>
  );
}
