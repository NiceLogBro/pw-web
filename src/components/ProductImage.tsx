import { cn } from "@/utils/cn";

/**
 * Product photography. Single-SKU items use their studio tile; bundles show a
 * collage of exactly what's in the box, so the tile never misrepresents a set.
 */
export function ProductImage({
  image,
  gallery,
  alt,
  className,
  imgClassName,
  eager,
}: {
  image: string;
  gallery?: string[];
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  if (!gallery || gallery.length < 2) {
    return (
      <img
        src={image}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    );
  }

  const [a, b, c] = [gallery[0], gallery[1] ?? gallery[0], gallery[2] ?? gallery[1] ?? gallery[0]];

  return (
    <div className={cn("grid h-full w-full grid-cols-2 grid-rows-2 gap-[3px] bg-[#e6e3db]", className)}>
      <div className="row-span-2 overflow-hidden bg-[#efede7]">
        <img src={a} alt="" loading={eager ? "eager" : "lazy"} className="h-full w-full object-cover" />
      </div>
      <div className="overflow-hidden bg-[#efede7]">
        <img src={b} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="overflow-hidden bg-[#efede7]">
        <img src={c} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <span className="sr-only">{alt}</span>
    </div>
  );
}
