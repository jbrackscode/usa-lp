import Link from "next/link";
import { Logo } from "./Logo";
import { storeUrl } from "@/lib/config";

const discoverLinks = [
  { label: "Bike Racks", href: `${storeUrl}/collections/bike-racks` },
  { label: "Garage Stand", href: `${storeUrl}/collections/garage-stand` },
  { label: "Accessories", href: `${storeUrl}/collections/accessories` },
  { label: "Bundles", href: `${storeUrl}/collections/bundles` },
  { label: "About JB Racks", href: `${storeUrl}/pages/about` },
  { label: "Reviews", href: `${storeUrl}/pages/reviews` },
];

const policyLinks = [
  { label: "Shipping Policy", href: `${storeUrl}/policies/shipping-policy` },
  { label: "Privacy Policy", href: `${storeUrl}/policies/privacy-policy` },
  { label: "Terms of Service", href: `${storeUrl}/policies/terms-of-service` },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-line bg-brand-black text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Logo dark className="w-32" />
            <p className="mt-3 text-sm">
              <Link href={storeUrl} className="underline underline-offset-4 hover:text-white">
                Visit the store
              </Link>
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-white/40">Discover</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {discoverLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-white/40">Policies</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-white/40">
          © {new Date().getFullYear()}, JB Racks | USA
        </p>
      </div>
    </footer>
  );
}
