import type { Metadata } from "next";
import { Header } from "@/components/lp/Header";
import { Footer } from "@/components/lp/Footer";
import { getPageByHandle, isShopifyConfigured } from "@/lib/shopify";

// Mirrors the "Build" page from Shopify Admin > Online Store > Pages
// (handle: "build") — assembly manuals/videos per rack model. Fetched live
// on every revalidation so editing that page in Shopify is all it takes to
// update this route too.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Build Guides — JB Racks",
  description: "Assembly manuals and tutorial videos for every JB Racks product.",
};

export default async function BuildPage() {
  const page = isShopifyConfigured ? await getPageByHandle("build").catch(() => null) : null;

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[50vh] max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black sm:text-5xl">{page?.title ?? "Build Guides"}</h1>

        {page ? (
          <div
            className="mt-8 [&_a]:font-semibold [&_a]:text-brand-green [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-brand-green-dark [&_h2:first-child]:mt-0 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-brand-line [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:text-brand-black [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-brand-black [&_li]:text-brand-black/80 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        ) : (
          <p className="mt-6 text-brand-black/60">Build guides are temporarily unavailable — please check back shortly.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
