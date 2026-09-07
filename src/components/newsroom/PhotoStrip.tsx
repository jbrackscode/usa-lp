import Image from "next/image";
import { photoStrip } from "@/lib/newsroom";

export function PhotoStrip() {
  return (
    <div className="bg-white px-5 pb-12 sm:px-10">
      <div className="grid grid-cols-3 gap-2.5">
        {photoStrip.map((src) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-nr-bg">
            <Image src={src} alt="JB Racks customer photo" fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
