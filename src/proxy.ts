import { NextRequest, NextResponse } from "next/server";
import { splitTests, pickWeightedVariant } from "@/lib/splitTest";

// Search-engine/social crawlers skip bucketing entirely and always get the
// first (control) variant — otherwise the same canonical URL could get
// indexed with three different bodies depending on which crawl drew which
// cookie-less bucket.
const BOT_USER_AGENT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot/i;

export function proxy(request: NextRequest) {
  const test = splitTests.find((t) => t.enabled && t.sourcePath === request.nextUrl.pathname);
  if (!test) return NextResponse.next();

  if (BOT_USER_AGENT.test(request.headers.get("user-agent") ?? "")) {
    return NextResponse.next();
  }

  const cookieName = `ab_${test.id}`;
  const existingId = request.cookies.get(cookieName)?.value;
  // Honor an existing assignment even if that variant's weight has since
  // been set to 0 — weight 0 only stops *new* visitors from entering it,
  // it doesn't yank anyone already bucketed mid-test.
  const existingVariant = test.variants.find((v) => v.id === existingId);
  const variant = existingVariant ?? pickWeightedVariant(test.variants);

  const response =
    variant.path === request.nextUrl.pathname
      ? NextResponse.next()
      : NextResponse.rewrite(new URL(variant.path, request.url));

  if (variant.id !== existingId) {
    // Deliberately not httpOnly — SplitTestTracking (src/components/lp)
    // reads this same cookie client-side to report the assignment to GA4.
    response.cookies.set(cookieName, variant.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  return response;
}

// Next.js requires matcher paths to be static string literals here — add
// each new test's sourcePath as its own entry (see docs/split-testing.md).
export const config = {
  matcher: ["/lp-vertical-bike-racks"],
};
