import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { categoryName } from "@/data/products";
import { useCart } from "@/store/cart";
import { Stars, money, Pill } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/utils/cn";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { add, lines } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = lines.find((l) => l.id === product.id);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1600);
    return () => clearTimeout(t);
  }, [justAdded]);

  const off = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  return (
    <article
      id={`product-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_22px_50px_-26px_rgba(14,17,19,0.45)]"
    >
      <a href={`#pdp-${product.id}`} className="relative block aspect-square overflow-hidden bg-[#efede7]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.045]">
          <ProductImage
            image={product.image}
            gallery={product.gallery}
            alt={`${product.name} — ${product.tagline}`}
            eager={priority}
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && <Pill tone="sale">–{off}%</Pill>}
          {product.badges?.slice(0, 1).map((b) => (
            <Pill key={b} tone="neutral" className="bg-white/90 backdrop-blur">
              {b}
            </Pill>
          ))}
        </div>
        {product.stock === "low" && (
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-safety-deep backdrop-blur">
            Low stock
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-8 text-[11.5px] font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {product.bestFor}
        </div>
      </a>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/35">
          {categoryName(product.category)}
        </p>
        <a href={`#pdp-${product.id}`} className="mt-1 block">
          <h3 className="text-[15.5px] font-bold leading-snug text-ink group-hover:text-ink">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[12.5px] text-ink/55">{product.tagline}</p>
        </a>

        <div className="mt-2 flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-[11.5px] text-ink/45 tabular">
            {product.rating.toFixed(1)} ({product.reviews.toLocaleString()})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[19px] font-extrabold tracking-tight text-ink tabular">
                {money(product.price)}
              </span>
              {product.compareAt && (
                <span className="text-[12.5px] text-ink/35 line-through tabular">
                  {money(product.compareAt)}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-ink/45">{product.shipsIn}</p>
          </div>

          <button
            onClick={() => {
              add(product.id, 1, { openDrawer: false });
              setJustAdded(true);
            }}
            className={cn(
              "grid h-10 shrink-0 place-items-center rounded-full transition-all duration-200",
              inCart && !justAdded ? "w-10 bg-ink/8 text-ink" : "w-10 text-white",
              justAdded ? "bg-wash" : inCart ? "" : "bg-ink hover:bg-safety",
            )}
            aria-label={justAdded ? "Added" : `Add ${product.name} to cart`}
          >
            {justAdded ? (
              <Check className="h-4.5 w-4.5" strokeWidth={3} />
            ) : inCart ? (
              <span className="text-[12px] font-bold tabular">{inCart.qty}</span>
            ) : (
              <Plus className="h-4.5 w-4.5" strokeWidth={2.6} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
