import Image from "next/image";

type FeatureRowProps = {
  image: string;
  // Optional — when set (the /lp-demonstration-videos page), renders this
  // video instead of the static image, same frame/crop.
  video?: string;
  title: string;
  body: string;
};

// Image always on the left, text always on the right — matches every
// image-with-text block on the live page (none of them alternate).
export function FeatureRow({ image, video, title, body }: FeatureRowProps) {
  return (
    <div className="mx-auto mb-5 grid max-w-[1000px] grid-cols-1 sm:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        {video ? (
          <video
            src={video}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image src={image} alt="" fill sizes="(min-width: 640px) 500px, 100vw" className="object-cover" />
        )}
      </div>
      <div className="flex flex-col justify-center px-5 py-8 sm:px-8">
        <h2 className="text-3xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black sm:text-5xl">{title}</h2>
        <p className="mt-3 max-w-md text-base text-brand-black/80">{body}</p>
      </div>
    </div>
  );
}
