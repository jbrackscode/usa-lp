import { compare } from "@/lib/bikeRacksListicle";

export function CompareTable() {
  return (
    <div className="border-t border-brand-line bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-10 max-w-[62ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">{compare.eyebrow}</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">
            {compare.headline.split(/(For under \$\d+\.?)/).map((part, i) =>
              part.startsWith("For under") ? (
                <span key={i} className="text-brand-orange">
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm">
          <table className="hidden w-full border-collapse text-left sm:table">
            <thead>
              <tr>
                <th className="border-b-2 border-brand-line p-4"></th>
                <th className="border-b-2 border-brand-line bg-brand-green-light p-4 text-center text-[15px] font-extrabold text-brand-green-dark">
                  {compare.columns[1]}
                </th>
                <th className="border-b-2 border-brand-line bg-[#f4f4f4] p-4 text-center text-[15px] font-extrabold text-[#8a8a8a]">
                  {compare.columns[2]}
                </th>
              </tr>
            </thead>
            <tbody>
              {compare.rows.map((row) => (
                <tr key={row.feature}>
                  <td className="border-t border-[#ececec] p-4 text-sm font-bold text-brand-black">{row.feature}</td>
                  <td className="border-t border-[#ececec] bg-[#f2fbf6] p-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[11px] font-black text-white">
                      {row.jb ? "✓" : "✕"}
                    </span>
                  </td>
                  <td className="border-t border-[#ececec] bg-[#fafafa] p-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#d6d6d6] text-[11px] font-black text-white">
                      {row.other ? "✓" : "✕"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: stacked cards instead of a cramped 3-column table */}
          <div className="sm:hidden">
            {compare.rows.map((row, i) => (
              <div key={row.feature} className={`p-4 ${i > 0 ? "border-t border-[#ececec]" : ""}`}>
                <div className="mb-2.5 text-sm font-bold text-brand-black">{row.feature}</div>
                <div className="mb-1.5 flex items-center gap-2.5 rounded-md bg-[#f2fbf6] px-2.5 py-1.5 text-sm font-semibold text-brand-black">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-[11px] font-black text-white">
                    {row.jb ? "✓" : "✕"}
                  </span>
                  {compare.columns[1]}
                </div>
                <div className="flex items-center gap-2.5 rounded-md bg-[#fafafa] px-2.5 py-1.5 text-sm text-[#9a9a9a]">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d6d6d6] text-[11px] font-black text-white">
                    {row.other ? "✓" : "✕"}
                  </span>
                  {compare.columns[2]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-lg font-bold text-brand-black">
          {compare.callout.split(/(\$300-\$400)/).map((part, i) =>
            part === "$300-$400" ? (
              <span key={i} className="text-brand-green-dark">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </p>
      </div>
    </div>
  );
}
