import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";

import { Link } from "@/lib/router";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { Badge, Price, Stars } from "@/components/ui";
import type { Product } from "@/data/catalog";

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const { toast } = useToast();

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_24px_48px_-32px_rgba(11,26,34,0.5)]",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#eef1f4]">
        <Link to={`/product/${product.slug}`} className="block h-full w-full" aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.bestseller && <Badge tone="ink">Bestseller</Badge>}
          {product.compareAt && <Badge tone="amber">On sale</Badge>}
          {product.stock === "low-stock" && <Badge tone="paper">Low stock</Badge>}
        </div>
        <button
          type="button"
          aria-label={`Add ${product.shortName} to cart`}
          onClick={() => {
            add(product.slug);
            toast(`${product.shortName} added to cart`);
          }}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper shadow-lg shadow-ink/25 transition-all duration-200 hover:scale-105 hover:bg-spray sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "p-4" : "p-4 sm:p-5")}>
        <p className="label-eyebrow text-[10px] text-slate">{product.brand}</p>
        <h3 className="mt-1.5 font-display text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink">
          <Link to={`/product/${product.slug}`} className="transition-colors hover:text-spray-deep">
            {product.shortName}
          </Link>
        </h3>
        {!compact && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate">{product.blurb}</p>}

        <div className="mt-2.5">
          <Stars rating={product.rating} count={product.reviews} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <Price product={product} size="md" />
            <p className="mt-0.5 text-[11px] text-slate/80">{product.shipsIn}</p>
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="shrink-0 rounded-full border border-ink/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
