import Link from "next/link";
import { Logo } from "./Logo";
import { storeUrl } from "@/lib/config";

// Landing pages skip the full store nav on purpose — a single link back to
// the store keeps traffic focused on the offer instead of routing people
// into collections/menus.
export function Header() {
  return (
    <header className="border-b border-brand-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo className="w-28 sm:w-32" />
        <Link
          href={storeUrl}
          className="text-sm font-semibold text-brand-black/70 underline decoration-brand-line underline-offset-4 hover:text-brand-green"
        >
          ← Back to store
        </Link>
      </div>
    </header>
  );
}
