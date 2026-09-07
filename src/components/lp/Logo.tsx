import Image from "next/image";
import logo from "../../../public/images/logo.png";

type LogoProps = {
  className?: string;
  dark?: boolean;
};

// Real JB Racks wordmark, pulled from the live store. It's black-on-
// transparent, so the dark variant just inverts it to white rather than
// needing a second asset.
//
// No default width here on purpose: every caller passes its own w-* class,
// and Tailwind's cascade order (not HTML class order) decides which width
// utility wins when two are present — `w-auto` was compiling after the
// callers' `w-28`/`w-32`/etc and silently winning, so the logo rendered at
// its full intrinsic 1656px width instead of the intended size. Keeping
// only `h-auto` here (never overridden by callers) avoids that conflict.
export function Logo({ className = "", dark = false }: LogoProps) {
  return (
    <Image
      src={logo}
      alt="JB Racks | USA"
      priority
      sizes="(min-width: 640px) 288px, 224px"
      className={`h-auto ${dark ? "invert" : ""} ${className}`}
    />
  );
}
