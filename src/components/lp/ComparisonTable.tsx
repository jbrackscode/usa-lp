import { comparisonRows, product } from "@/lib/config";
import { ClaimRackButton } from "./ClaimRackButton";
import { ComparisonMobile } from "./ComparisonMobile";

type ComparisonTableProps = {
  // Live 4 Bike Rack price, same source /lp-vertical-bike-racks uses —
  // falls back to the static config price if the caller doesn't have it.
  price?: number;
  // Passed through to ClaimRackButton — links there instead of checkout.
  ctaHref?: string;
  // Button wording before the price; defaults to "Claim My Rack".
  ctaLabel?: string;
  // false drops the " - $price" suffix (e.g. a plain "Learn More").
  ctaShowPrice?: boolean;
};

export function ComparisonTable({ price = product.price, ctaHref, ctaLabel = "Claim My Rack", ctaShowPrice = true }: ComparisonTableProps) {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-[39px] pt-[30px] text-brand-black sm:pb-[52px] sm:pt-10">
      <h2 className="mb-6 text-center text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] sm:text-5xl">
        Why Riders Are Going Vertical
      </h2>

      <div className="hidden overflow-hidden rounded-xl border border-brand-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:block">
        <table className="w-full border-collapse text-left sm:table">
          <thead>
            <tr>
              <th className="border-b-2 border-brand-line p-4"></th>
              <th className="border-b-2 border-brand-line bg-brand-green-light p-4 text-[15px] font-extrabold text-brand-green-dark">
                JB Racks Vertical Rack
              </th>
              <th className="border-b-2 border-brand-line bg-[#f4f4f4] p-4 text-[15px] font-extrabold text-[#8a8a8a]">
                Traditional Rack
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label}>
                <td className="w-1/5 border-t border-[#ececec] p-4 text-sm font-bold text-brand-black">
                  {row.label}
                </td>
                <td className="border-t border-[#ececec] bg-[#f2fbf6] p-4 text-[15px] font-semibold text-brand-black">
                  <span className="mr-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[11px] font-black text-white">
                    ✓
                  </span>
                  {row.vertical}
                </td>
                <td className="border-t border-[#ececec] bg-[#fafafa] p-4 text-[15px] text-[#9a9a9a]">
                  <span className="mr-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#d6d6d6] text-[11px] font-black text-white">
                    ✕
                  </span>
                  {row.traditional}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Outside the overflow-hidden card so its header can stay sticky. */}
      <ComparisonMobile />

      <div className="mt-7 flex justify-center">
        <ClaimRackButton label={ctaShowPrice ? `${ctaLabel} - $${price}` : ctaLabel} href={ctaHref} />
      </div>
      <p className="mt-3 text-center text-sm text-brand-black/70">4-year warranty · Free shipping</p>
    </div>
  );
}
