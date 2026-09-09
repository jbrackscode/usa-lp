import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "JB Racks",
  description: "JB Racks — vertical bike racks that load fast and ride sooner.",
};

// Set in .env.local — see .env.local.example. Left unset, the pixel simply
// doesn't render (no broken script, no empty tracking calls).
const fbPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Only the two faces every page actually paints above the fold —
            Gotham Pro regular (body copy) and Tungsten (every headline) —
            preloaded so they're not discovered late via the CSS parse. */}
        <link rel="preload" href="/fonts/gotham/GothamPro.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/tungsten/tungsten-bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        {fbPixelId && (
          <>
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');`}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                alt=""
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
        {ga4Id && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
