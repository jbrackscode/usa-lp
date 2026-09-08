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

export const metadata: Metadata = {
  title: "JB Racks — Vertical Bike Rack",
  description:
    "5 reasons 20,000+ riders swear by vertical. E-bike rated, 4-year warranty, free shipping.",
};

export default function LpDemonstrationPage() {
  const [row1, row2, row3, row4, row5] = featureRows;

  return (
    <>
      <PromoBar />
      <Header />
      <main className="bg-white">
        <Hero />

        <FeatureRow {...row1} />
        <FeatureRow {...row2} />

        <ComparisonTable />

        <FeatureRow {...row3} />
        <FeatureRow {...row4} />
        <FeatureRow {...row5} />

        <PricingSection />
        <Testimonials />

        <section className="pb-[39px] pt-[30px] sm:pb-[52px] sm:pt-10">
          <div className="mx-auto max-w-[1000px] px-5">
            <h2 className="mb-6 text-center text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <FAQ />
          </div>
        </section>

        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
