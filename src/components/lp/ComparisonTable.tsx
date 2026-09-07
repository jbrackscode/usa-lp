import { comparisonRows, product } from "@/lib/config";
import { ClaimRackButton } from "./ClaimRackButton";

export function ComparisonTable() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 text-brand-black sm:py-12">
      <h2 className="mb-6 text-center text-[26px] font-extrabold leading-tight sm:text-[40px]">
        Why Riders Go Vertical
      </h2>

      <div className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm">
        <table className="hidden w-full border-collapse text-left sm:table">
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

        <div className="sm:hidden">
          {comparisonRows.map((row, i) => (
            <div key={row.label} className={`p-4 ${i > 0 ? "border-t border-[#ececec]" : ""}`}>
              <div className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-brand-black">
                {row.label}
              </div>
              <div className="mb-1.5 flex items-center gap-2.5 rounded-md bg-[#f2fbf6] px-2.5 py-1.5 text-sm font-bold text-brand-black">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-[11px] font-black text-white">
                  ✓
                </span>
                JB: {row.vertical}
              </div>
              <div className="flex items-center gap-2.5 rounded-md bg-[#fafafa] px-2.5 py-1.5 text-sm text-[#9a9a9a]">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d6d6d6] text-[11px] font-black text-white">
                  ✕
                </span>
                Others: {row.traditional}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex justify-center">
        <ClaimRackButton label={`Claim My Rack - $${product.price}`} />
      </div>
      <p className="mt-3 text-center text-sm text-brand-black/70">4-year warranty · Free shipping</p>
    </div>
  );
}
