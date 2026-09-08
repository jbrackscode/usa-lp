import { productChecklist } from "@/lib/verticalRackPdp";

export function ProductFeatureBadges() {
  return (
    <div className="border-t border-brand-line py-6">
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-x-6 gap-y-2.5 px-6">
        {productChecklist.map((item) => (
          <span key={item} className="inline-flex items-center gap-2 text-[13.5px] font-medium text-brand-black">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-brand-green text-[10px] font-bold text-white">
              ✓
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
