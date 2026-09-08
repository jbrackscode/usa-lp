import { pricingHighlights, product } from "@/lib/config";
import { ClaimRackButton } from "./ClaimRackButton";

export function PricingSection() {
  const savings = product.compareAtPrice - product.price;

  return (
    <div className="mx-auto max-w-[1000px] px-5 pb-[39px] pt-[30px] text-center text-brand-black sm:pb-[52px] sm:pt-10">
      <span className="mb-4 inline-block rounded-full bg-[#fdeee3] px-4 py-1.5 text-[13px] font-bold text-[#c2530a]">
        Limited-Time Price
      </span>
      <h2 className="text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] sm:text-5xl">
        Get the 4 Bike Vertical Rack for ${product.price}
      </h2>
      <p className="mx-auto mt-2.5 max-w-[560px] text-base text-[#666]">
        Down from the regular ${product.compareAtPrice} price — while this batch lasts.
      </p>

      <div className="mx-auto mt-7 max-w-[480px] rounded-[14px] border border-brand-line bg-white px-6 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-baseline justify-center gap-3">
          <span className="text-[46px] font-extrabold leading-none">${product.price}</span>
          <span className="text-[22px] text-[#a3a3a3] line-through">${product.compareAtPrice}</span>
        </div>
        <span className="mt-2 inline-block rounded-full bg-brand-green-light px-3 py-1.5 text-[13px] font-bold text-brand-green-dark">
          Save ${savings}
        </span>

        <ul className="mt-6 space-y-1.5 text-left">
          {pricingHighlights.map((line) => (
            <li key={line} className="flex items-center gap-2.5 py-1.5 text-[14.5px] text-[#333]">
              <span
                className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-green-light bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='none' stroke='%230f7a52' stroke-width='3' d='M4 12l6 6L20 6'/></svg>\")",
                  backgroundSize: "11px",
                }}
              />
              {line}
            </li>
          ))}
        </ul>

        <ClaimRackButton label={`Claim My Rack - $${product.price}`} full className="mt-6" />
        <p className="mt-3 text-xs text-[#999]">Free shipping, no code needed.</p>
      </div>
    </div>
  );
}
