import Link from "next/link";
import { Logo } from "@/components/lp/Logo";
import { storeUrl } from "@/lib/config";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-brand-black">
      <Link
        href={storeUrl}
        className="transition-opacity hover:opacity-80"
        aria-label="Visit the JB Racks store"
      >
        <Logo dark className="w-56 sm:w-72" />
      </Link>
    </main>
  );
}
