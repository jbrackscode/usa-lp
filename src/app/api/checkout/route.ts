import { NextResponse } from "next/server";
import { createCartCheckoutUrl } from "@/lib/shopify";
import { product } from "@/lib/config";

export async function POST() {
  if (!product.variantId) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SHOPIFY_VARIANT_ID is not set." },
      { status: 500 }
    );
  }

  try {
    const checkoutUrl = await createCartCheckoutUrl([{ variantId: product.variantId, quantity: 1 }]);
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown checkout error" },
      { status: 500 }
    );
  }
}
