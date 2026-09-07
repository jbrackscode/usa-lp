import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos will be served from Shopify's CDN. Vercel's image
    // optimizer re-encodes to WebP/AVIF on the fly, so dropping originals
    // (png/jpg) into /public/images works too — no manual conversion needed.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
