import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCart, getCart, addCartLines, updateCartLine, removeCartLine, type CartLine } from "@/lib/shopify";

// Persistent on-site cart, distinct from /api/checkout-cart (which spins up
// a disposable cart just to redirect straight to Shopify checkout). The
// cart id lives in an httpOnly cookie — only this route ever reads/writes
// it, so the client never needs direct cookie access.
const CART_COOKIE = "jb_cart_id";
const MAX_AGE = 60 * 60 * 24 * 30;
const GID_PATTERN = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

function parseLines(input: unknown): CartLine[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const lines: CartLine[] = [];
  for (const line of input) {
    if (
      typeof line !== "object" ||
      line === null ||
      typeof (line as { variantId?: unknown }).variantId !== "string" ||
      !GID_PATTERN.test((line as { variantId: string }).variantId) ||
      typeof (line as { quantity?: unknown }).quantity !== "number" ||
      (line as { quantity: number }).quantity < 1
    ) {
      return null;
    }
    lines.push(line as CartLine);
  }
  return lines;
}

export async function GET() {
  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;
  if (!cartId) return NextResponse.json({ cart: null });

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      store.delete(CART_COOKIE);
    }
    return NextResponse.json({ cart });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown cart error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { lines?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const lines = parseLines(body.lines);
  if (!lines) return NextResponse.json({ error: "Invalid line item(s)." }, { status: 400 });

  const store = await cookies();
  const existingCartId = store.get(CART_COOKIE)?.value;

  try {
    // If the cookied cart is stale/expired on Shopify's end, fall back to
    // creating a fresh one instead of erroring out.
    const cart = existingCartId
      ? await addCartLines(existingCartId, lines).catch(() => createCart(lines))
      : await createCart(lines);

    store.set(CART_COOKIE, cart.id, { path: "/", maxAge: MAX_AGE, sameSite: "lax", httpOnly: true });
    return NextResponse.json({ cart });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown cart error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  let body: { lineId?: unknown; quantity?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.lineId !== "string" || typeof body.quantity !== "number" || body.quantity < 0) {
    return NextResponse.json({ error: "Invalid line update." }, { status: 400 });
  }

  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;
  if (!cartId) return NextResponse.json({ error: "No active cart." }, { status: 400 });

  try {
    const cart =
      body.quantity === 0 ? await removeCartLine(cartId, body.lineId) : await updateCartLine(cartId, body.lineId, body.quantity);
    return NextResponse.json({ cart });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown cart error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  let body: { lineId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.lineId !== "string") {
    return NextResponse.json({ error: "Invalid line id." }, { status: 400 });
  }

  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;
  if (!cartId) return NextResponse.json({ error: "No active cart." }, { status: 400 });

  try {
    const cart = await removeCartLine(cartId, body.lineId);
    return NextResponse.json({ cart });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown cart error" }, { status: 500 });
  }
}
