"use client";

import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { colors, toVariantGid, type Color, type RackSize, type Addons } from "@/lib/bikeRacks";
import { storeUrl } from "@/lib/config";
import { PaymentIcons } from "./PaymentIcons";
import { SpecsAccordion } from "./SpecsAccordion";

const benefits = [
  "Lightweight 53-66 lbs — one person can fit it",
  "Anti-wobble hitch bracket included",
  "Fits wheels up to 29\" and tires up to 3\" wide",
  "Structural steel — load & vibration tested",
];

type BuyBoxProps = {
  rackSizes: RackSize[];
  addons: Addons;
  showSpecs?: boolean;
  stickyAddToCart?: boolean;
  // Numeric variant IDs flagged out_of_stock via the "stock_status"
  // metafield (see getLiveBikeRackData) — nothing here can be added to
  // cart, regardless of which page/instance of BuyBox is rendering.
  outOfStockVariantIds?: Set<number>;
};

export function BuyBox({
  rackSizes,
  addons,
  showSpecs = false,
  stickyAddToCart = false,
  outOfStockVariantIds = new Set(),
}: BuyBoxProps) {
  const [sizeIndex, setSizeIndex] = useState(1); // default to 5-bike ("Most Popular")
  const [color, setColor] = useState<Color>("Black");
  const [wantStand, setWantStand] = useState(false);
  const [wantStrut, setWantStrut] = useState(false);
  const [wantSwingArm, setWantSwingArm] = useState(false);
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  // Sticky bar appears once the real Add to Cart button scrolls out of
  // view, and shares this exact same handleAddToCart/price/rackLine state
  // — never a separate, potentially-stale copy of the selection.
  useEffect(() => {
    if (!stickyAddToCart) return;
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [stickyAddToCart]);

  const rack = rackSizes[sizeIndex];
  const images = rack.imagesByColor[color];

  function prevImage() {
    setImageIndex((i) => (i - 1 + images.length) % images.length);
  }
  function nextImage() {
    setImageIndex((i) => (i + 1) % images.length);
  }

  const touchStartX = useRef<number | null>(null);
  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) nextImage();
      else prevImage();
    }
    touchStartX.current = null;
  }

  // Bundle-SKU substitution: when the shopper wants Garage Stand (and
  // optionally the Strut too), swap the rack line to the real bundle product
  // instead of stacking full-price add-on lines — that's what keeps the
  // total matching Shopify's actual bundle pricing instead of overcharging.
  const rackLine = useMemo(() => {
    if (wantStand && wantStrut) {
      return {
        variantId: rack.fullBundle.variants[color],
        price: rack.fullBundle.price,
        compareAtPrice: rack.fullBundle.compareAtPrice,
        title: `${rack.label} Rack + Garage Stand + Slow-Fold Strut`,
      };
    }
    if (wantStand) {
      return {
        variantId: rack.standBundle.variants[color],
        price: rack.standBundle.price,
        compareAtPrice: rack.standBundle.compareAtPrice,
        title: `${rack.label} Rack + Garage Stand`,
      };
    }
    return {
      variantId: rack.variants[color],
      price: rack.price,
      compareAtPrice: rack.compareAtPrice,
      title: `${rack.label} Rack`,
    };
  }, [rack, color, wantStand, wantStrut]);

  // Strut and Swing Arm only get their own cart line when not already folded
  // into the bundle SKU above.
  const extraLines = useMemo(() => {
    const extras: { variantId: number; price: number; label: string }[] = [];
    if (wantStrut && !wantStand) {
      extras.push({ variantId: addons.slowFoldStrut.variantId, price: addons.slowFoldStrut.price, label: addons.slowFoldStrut.name });
    }
    if (wantSwingArm) {
      extras.push({ variantId: addons.swingArm.variantId, price: addons.swingArm.price, label: addons.swingArm.name });
    }
    return extras;
  }, [wantStrut, wantStand, wantSwingArm, addons]);

  const price = rackLine.price * qty + extraLines.reduce((sum, e) => sum + e.price, 0);
  const compareAtPrice = rackLine.compareAtPrice * qty + extraLines.reduce((sum, e) => sum + e.price, 0);
  const savings = compareAtPrice - price;

  // Which variant a given color would resolve to under the current
  // bundle selection — used to grey out colors that can't be purchased
  // before the shopper even reaches the Add to Cart button.
  function variantIdForColor(c: Color) {
    if (wantStand && wantStrut) return rack.fullBundle.variants[c];
    if (wantStand) return rack.standBundle.variants[c];
    return rack.variants[c];
  }

  const currentSelectionOutOfStock =
    outOfStockVariantIds.has(rackLine.variantId) || extraLines.some((e) => outOfStockVariantIds.has(e.variantId));

  async function handleAddToCart() {
    if (currentSelectionOutOfStock) return;
    setLoading(true);
    setError(false);

    const lines = [
      { variantId: toVariantGid(rackLine.variantId), quantity: qty },
      ...extraLines.map((e) => ({ variantId: toVariantGid(e.variantId), quantity: 1 })),
    ];

    try {
      const res = await fetch("/api/checkout-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      if (!res.ok) throw new Error("checkout failed");
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      setError(true);
      setLoading(false);
      window.location.href = `${storeUrl}/products/${rack.handle}`;
    }
  }

  return (
    <>
    <div id="buy-box" className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-2 lg:items-start lg:gap-12">
      {/* Gallery */}
      <div className="lg:sticky lg:top-6">
        <div
          className="relative aspect-square w-full touch-pan-y overflow-hidden rounded-xl bg-white"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            key={images[imageIndex]}
            src={images[imageIndex]}
            alt={`${rack.label} bike rack`}
            fill
            sizes="(min-width: 1024px) 500px, 100vw"
            className="object-contain"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-brand-black shadow hover:bg-white sm:flex"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-brand-black shadow hover:bg-white sm:flex"
              >
                ›
              </button>
            </>
          )}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setImageIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white ${
                i === imageIndex ? "border-brand-black" : "border-transparent"
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-black">
          <span className="tracking-widest text-brand-star">★★★★★</span>
          4.7/5.0 · 20,000+ customers
        </div>
        <h2 className="mt-2 text-3xl font-black tracking-tighter text-brand-black sm:text-4xl">The JB Vertical Bike Rack</h2>
        <p className="mt-2 text-[15.5px] leading-relaxed text-brand-black/70">
          The vertical-style hitch rack for hauling 4, 5, or 6 bikes. Fits 2&quot; (50mm) receivers.
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-brand-black/80">
              <span className="mt-0.5 text-brand-green">✓</span>
              {b}
            </li>
          ))}
        </ul>

        {/* Buy panel: size, color, add-ons, price, CTA — one bordered/shadowed card */}
        <div className="mt-5 rounded-xl border border-brand-line bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:p-6">
          {/* Size switcher */}
          <div className="mb-6 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-black">
              How many bikes? <span className="text-sm normal-case text-brand-black">{rack.label}</span>
            </div>
            {rack.compareAtPrice > rack.price && (
              <span
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white [animation:pulse-subtle_2s_ease-in-out_infinite]"
                style={{ background: "linear-gradient(135deg, var(--color-brand-orange) 0%, #f7931e 100%)" }}
              >
                Save ${rack.compareAtPrice - rack.price}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {rackSizes.map((s, i) => (
              <button
                key={s.bikes}
                type="button"
                onClick={() => {
                  setSizeIndex(i);
                  setImageIndex(0);
                }}
                className={`relative flex flex-col items-center gap-0.5 rounded-lg border-2 bg-white px-2 py-3 text-center transition-colors ${
                  i === sizeIndex ? "border-brand-black shadow-[inset_0_0_0_1px_#1a1a1a]" : "border-brand-line hover:border-brand-black/40"
                }`}
              >
                {s.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-green px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:text-[10px]">
                    {s.badge}
                  </span>
                )}
                <strong className="text-sm text-brand-black sm:text-lg">{s.label}</strong>
                <span className="flex items-baseline gap-1">
                  <span className="text-sm font-extrabold text-brand-black sm:text-base">${s.price}</span>
                  <span className="text-[10px] text-brand-black/40 line-through sm:text-[11px]">${s.compareAtPrice}</span>
                </span>
                <span className="text-[10px] text-brand-black/60 sm:text-xs">{s.sublabel}</span>
              </button>
            ))}
          </div>

          {/* Color swatches */}
          <div className="mb-2 mt-5 flex items-baseline gap-2 text-xs font-bold uppercase tracking-wide text-brand-black">
            Color <small className="font-medium normal-case tracking-normal text-brand-black/50">{color}</small>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const outOfStock = outOfStockVariantIds.has(variantIdForColor(c.name));
              return (
                <button
                  key={c.name}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => {
                    setColor(c.name);
                    setImageIndex(0);
                  }}
                  className={`relative inline-flex items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-3.5 text-sm transition-colors ${
                    outOfStock
                      ? "cursor-not-allowed border-brand-line opacity-40"
                      : color === c.name
                        ? "border-brand-orange font-semibold shadow-[0_0_0_3px_rgba(255,96,0,0.18)]"
                        : "border-brand-line hover:border-brand-black/40"
                  }`}
                >
                  <span className="h-6 w-6 rounded-full ring-1 ring-black/15" style={{ background: c.hex }} />
                  {c.name}
                  {outOfStock && <span className="text-[11px] font-semibold text-brand-black/50">Sold out</span>}
                </button>
              );
            })}
          </div>

          {/* Add-ons */}
          <div className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-brand-black">Add to your rack</div>
          <div className="flex flex-col gap-2">
            <AddonCard
              checked={wantStand}
              onChange={setWantStand}
              image={addons.garageStand.image}
              name={addons.garageStand.name}
              note={addons.garageStand.note}
              price={addons.garageStand.price}
              outOfStock={outOfStockVariantIds.has(addons.garageStand.variantId)}
            />
            <AddonCard
              checked={wantStrut}
              onChange={setWantStrut}
              image={addons.slowFoldStrut.image}
              name={addons.slowFoldStrut.name}
              note={addons.slowFoldStrut.note}
              price={addons.slowFoldStrut.price}
              outOfStock={outOfStockVariantIds.has(addons.slowFoldStrut.variantId)}
            />
            <AddonCard
              checked={wantSwingArm}
              onChange={setWantSwingArm}
              image={addons.swingArm.image}
              name={addons.swingArm.name}
              note={addons.swingArm.note}
              price={addons.swingArm.price}
              outOfStock={outOfStockVariantIds.has(addons.swingArm.variantId)}
            />
          </div>

          {/* Price + CTA */}
          <div className="mt-6 border-t border-brand-line pt-5">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="text-[30px] font-black text-brand-black">${price}</span>
              {savings > 0 && <span className="text-lg text-brand-black/40 line-through">${compareAtPrice}</span>}
              {savings > 0 && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] font-bold uppercase tracking-wide text-white [animation:pulse-subtle_2s_ease-in-out_infinite]"
                  style={{ background: "linear-gradient(135deg, var(--color-brand-orange) 0%, #f7931e 100%)" }}
                >
                  Save ${savings}
                </span>
              )}
            </div>

            <p className="mt-2 text-[13px] text-brand-black">
              <span className="rounded bg-[#b1fff1] px-1.5 py-0.5 font-bold">${Math.round(price / 4)}/mo</span> Pay in 4 with
              Afterpay (at checkout)
            </p>

            <div className="mt-3 flex items-center gap-2.5 rounded-lg border-2 border-brand-line px-3.5 py-2 text-[13.5px] text-brand-black">
              <span aria-hidden>📦</span>
              <div>
                <strong className="font-semibold">FREE Shipping</strong>{" "}
                <span className="text-brand-black/60">Delivered in 4-7 business days.</span>
              </div>
            </div>

            <div className="mt-3.5 flex gap-2.5">
              <div className="flex items-stretch overflow-hidden rounded-lg border-2 border-brand-line">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 text-lg text-brand-black"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex w-11 items-center justify-center text-[15px] font-semibold text-brand-black">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(9, q + 1))}
                  className="w-10 text-lg text-brand-black"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                ref={ctaRef}
                type="button"
                onClick={handleAddToCart}
                disabled={loading || currentSelectionOutOfStock}
                className={`flex-1 rounded-full py-4 text-[19px] font-black uppercase tracking-tight text-white transition-opacity disabled:opacity-70 ${
                  currentSelectionOutOfStock ? "cursor-not-allowed bg-brand-black/40" : "bg-brand-green hover:opacity-90"
                }`}
              >
                {currentSelectionOutOfStock ? "Out of Stock" : loading ? "Adding…" : error ? "Redirecting to store…" : "Add to Cart"}
              </button>
            </div>

            <div className="mt-4 border-t border-brand-line pt-4">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
                {["FREE SHIPPING", "4-YEAR WARRANTY", "DELIVERED IN 4-7 DAYS"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide text-brand-black/80">
                    <span className="text-brand-green">✓</span>
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <PaymentIcons />
              </div>
            </div>
          </div>
        </div>

        {showSpecs && <SpecsAccordion />}
      </div>
    </div>

    {stickyAddToCart && (
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-brand-line bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-200 sm:hidden ${
          stickyVisible ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!stickyVisible}
      >
        <div className="min-w-0">
          <div className="truncate text-[12.5px] font-semibold text-brand-black/70">{rackLine.title}</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-brand-black">${price}</span>
            {savings > 0 && <span className="text-xs text-brand-black/40 line-through">${compareAtPrice}</span>}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading || currentSelectionOutOfStock}
          className={`shrink-0 whitespace-nowrap rounded-full px-6 py-3 text-sm font-black uppercase tracking-tight text-white disabled:opacity-70 ${
            currentSelectionOutOfStock ? "bg-brand-black/40" : "bg-brand-green"
          }`}
        >
          {currentSelectionOutOfStock ? "Out of Stock" : loading ? "Adding…" : error ? "Redirecting…" : "Add to Cart"}
        </button>
      </div>
    )}
    </>
  );
}

function AddonCard({
  checked,
  onChange,
  image,
  name,
  note,
  price,
  outOfStock = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  image: string;
  name: string;
  note: string;
  price: number;
  outOfStock?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 rounded-lg border-2 p-2.5 text-left transition-colors ${
        outOfStock
          ? "cursor-not-allowed border-brand-line opacity-40"
          : checked
            ? "border-brand-black shadow-[inset_0_0_0_1px_#1a1a1a]"
            : "border-brand-line hover:border-brand-black/40"
      }`}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white">
        <Image src={image} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <strong className="text-sm font-semibold text-brand-black">
            {name}
            {outOfStock && <span className="ml-1.5 font-normal text-brand-black/50">(Sold out)</span>}
          </strong>
          <span className="shrink-0 text-sm font-bold text-brand-black">+${price}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-brand-black/60">{note}</p>
      </div>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold text-white ${
          checked ? "border-brand-green bg-brand-green" : "border-brand-line bg-white"
        }`}
        aria-hidden
      >
        {checked ? "✓" : ""}
      </span>
    </button>
  );
}
