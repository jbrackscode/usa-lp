import type { Metadata } from "next";
import { Header } from "@/components/lp/Header";
import { Footer } from "@/components/lp/Footer";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your Cart — JB Racks",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="min-h-[50vh]">
        <CartView />
      </main>
      <Footer />
    </>
  );
}
