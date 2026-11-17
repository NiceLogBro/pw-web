import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { products, type Product } from "@/data/catalog";
import { cn } from "@/utils/cn";
import { Reveal, SectionHead, TextLink } from "@/components/ui";
import ProductCard from "@/components/ProductCard";

const shelves: { id: string; label: string; pick: (p: Product) => boolean }[] = [
  {
    id: "bestsellers",
    label: "Bestsellers",
    pick: (p) => Boolean(p.bestseller || p.featured),
  },
  {
    id: "parts",
    label: "Parts & repair",
    pick: (p) => ["pumps", "nozzles", "hoses-wands", "accessories"].includes(p.category),
  },
  {
    id: "chemicals",
    label: "Chemicals",
    pick: (p) => p.category === "chemicals",
  },
  {
    id: "surface",
    label: "Surface cleaners",
    pick: (p) => p.category === "surface",
  },
];

export default function ProductShelf() {
  const [active, setActive] = useState("bestsellers");

  const items = useMemo(() => {
    const shelf = shelves.find((s) => s.id === active) ?? shelves[0];
    return products.filter(shelf.pick).slice(0, 4);
  }, [active]);

  return (
    <section className="relative bg-bone py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Counter picks"
          title="The shelf everyone leaves with."
          desc="Fast movers on O'ahu: hose, tips, injectors, and the pump that fixes a washer you were about to replace."
          action={
            <Link to="/shop">
              <TextLink>Shop everything</TextLink>
            </Link>
          }
        />

        <div className="mt-7 flex flex-wrap items-center gap-2 border-b border-line pb-4">
          {shelves.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              aria-pressed={active === s.id}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                active === s.id
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink/70 ring-1 ring-line hover:text-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={`${active}-${p.slug}`} delay={i * 60}>
              <ProductCard product={p} compact />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
