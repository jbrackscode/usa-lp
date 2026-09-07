import type { Metadata } from "next";
import { Header } from "@/components/lp/Header";
import { Footer } from "@/components/lp/Footer";
import { Masthead } from "@/components/newsroom/Masthead";
import { ArticleHero } from "@/components/newsroom/ArticleHero";
import { ArticleIntro } from "@/components/newsroom/ArticleIntro";
import { ReasonBlock } from "@/components/newsroom/ReasonBlock";
import { InlineCTA } from "@/components/newsroom/InlineCTA";
import { ReviewsGrid } from "@/components/newsroom/ReviewsGrid";
import { PhotoStrip } from "@/components/newsroom/PhotoStrip";
import { FinalCTA } from "@/components/newsroom/FinalCTA";
import { DealStrip } from "@/components/newsroom/DealStrip";
import { reasons } from "@/lib/newsroom";

export const metadata: Metadata = {
  title: "JB Racks Newsroom",
  description: "7 reasons why vertical bike racks are every family's secret weapon for weekend rides.",
};

export default function LpNewsroomPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1140px] bg-white">
        <Masthead />
        <ArticleHero />
        <ArticleIntro />

        {reasons.slice(0, 3).map((reason) => (
          <ReasonBlock key={reason.number} {...reason} />
        ))}

        <InlineCTA />

        {reasons.slice(3).map((reason) => (
          <ReasonBlock key={reason.number} {...reason} />
        ))}

        <ReviewsGrid />
        <PhotoStrip />
        <FinalCTA />
        <DealStrip />
      </main>
      <Footer />
    </>
  );
}
