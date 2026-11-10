import { product } from "@/lib/config";
import type { BlackFridayOffer } from "@/lib/blackFriday";

// Soft, in-article mention of the sale (instead of a loud banner mid-read)
// that jumps down to the full offer block (#offer).
export function EditorsNote({ offer }: { offer: BlackFridayOffer }) {
  const ends = new Date(product.blackFridayEndsAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });

  return (
    <aside className="mx-auto mt-12 max-w-[760px] px-5">
      <div className="rounded-lg border-2 border-dashed border-brand-black/20 bg-nr-orange-light px-5 py-4 text-[16px] leading-[1.65] text-nr-ink-mid">
        <strong className="text-nr-ink">Editor&apos;s note:</strong> JB Racks&apos; Black Friday sale - their biggest of the year
        - has {offer.allSamePrice ? "every rack size at" : "racks from"}{" "}
        <strong className="text-nr-ink">${offer.price}</strong> (regularly ${offer.compareAtPrice}) until {ends}.{" "}
        <a href="#offer" className="font-bold text-brand-green-dark underline underline-offset-2">
          See the deal ↓
        </a>
      </div>
    </aside>
  );
}
