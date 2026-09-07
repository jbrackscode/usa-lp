import { NextResponse } from "next/server";
import { createCartCheckoutUrl, type CartLine } from "@/lib/shopify";

// Accepts the buy box's selected line items (rack variant + any add-ons) and
// creates a real multi-line Shopify cart. Variant IDs are validated as
// numeric Shopify gids so this can't be used to add arbitrary merchandise.
const GID_PATTERN = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

export async function POST(request: Request) {
  let body: { lines?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return NextResponse.json({ error: "No line items provided." }, { status: 400 });
  }

  const lines: CartLine[] = [];
  for (const line of body.lines) {
    if (
      typeof line !== "object" ||
      line === null ||
      typeof (line as { variantId?: unknown }).variantId !== "string" ||
      !GID_PATTERN.test((line as { variantId: string }).variantId) ||
      typeof (line as { quantity?: unknown }).quantity !== "number" ||
      (line as { quantity: number }).quantity < 1
    ) {
      return NextResponse.json({ error: "Invalid line item." }, { status: 400 });
    }
    lines.push(line as CartLine);
  }

  try {
    const checkoutUrl = await createCartCheckoutUrl(lines);
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown checkout error" },
      { status: 500 }
    );
  }
}
