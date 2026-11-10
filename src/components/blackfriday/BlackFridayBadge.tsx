import Image from "next/image";

// The store's "BLACK FRIDAY" SVG lockup on a small black-bordered tile with
// the .bf-gradient drift (globals.css) — replaces the plain orange
// "Black Friday" pill tags on /lp-demo-black-friday so every Black Friday
// label on the page uses the real brand lockup. Tilted slightly, like the
// pills it replaces. `size` sets the lockup height.
export function BlackFridayBadge({ size = "md", className = "" }: { size?: "sm" | "md"; className?: string }) {
  return (
    <span className={`bf-gradient inline-flex -rotate-2 items-center rounded-md border-[3px] border-black px-3 py-2 ${className}`}>
      <Image
        src="/images/jb-racks-black-friday.svg"
        alt="Black Friday"
        width={1213}
        height={311}
        unoptimized
        className={size === "sm" ? "h-[26px] w-auto sm:h-[30px]" : "h-[30px] w-auto sm:h-[38px]"}
      />
    </span>
  );
}
