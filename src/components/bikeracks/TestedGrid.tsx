import { tested } from "@/lib/bikeRacksListicle";

export function TestedGrid() {
  return (
    <div className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-10 max-w-[72ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">{tested.eyebrow}</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">{tested.headline}</h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-brand-line bg-brand-line shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {tested.cells.map((c) => (
            <div key={c.label} className="bg-white p-6">
              <div className="mb-2 text-sm font-bold text-brand-green-dark">{c.label}</div>
              <h4 className="mb-2 text-[15.5px] font-semibold leading-tight text-brand-black">{c.title}</h4>
              <p className="text-[13px] text-brand-black/60">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-[70ch] text-xs text-brand-black/40">{tested.footnote}</p>
      </div>
    </div>
  );
}
