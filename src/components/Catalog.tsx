import { useMemo, useState } from "react";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { categories, products, type CategoryId } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { SectionHead } from "@/components/ui";
import { cn } from "@/utils/cn";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const sorts: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

export default function Catalog() {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [maxPrice, setMaxPrice] = useState(400);
  const [sort, setSort] = useState<Sort>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    let out = products.filter(
      (p) => (cat === "all" || p.category === cat) && p.price <= maxPrice,
    );
    if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "rating") out = [...out].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    return out;
  }, [cat, maxPrice, sort]);

  const active = cat !== "all" || maxPrice < 400;

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink/40">Category</p>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => setCat("all")}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors",
                cat === "all" ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5",
              )}
            >
              All accessories
              <span className={cn("text-[11px] tabular", cat === "all" ? "text-paper/60" : "text-ink/35")}>
                {products.length}
              </span>
            </button>
          </li>
          {categories.map((c) => {
            const n = products.filter((p) => p.category === c.id).length;
            return (
              <li key={c.id}>
                <button
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors",
                    cat === c.id ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5",
                  )}
                >
                  {c.name}
                  <span
                    className={cn("text-[11px] tabular", cat === c.id ? "text-paper/60" : "text-ink/35")}
                  >
                    {n}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/40">Max price</p>
          <p className="text-[13px] font-bold tabular">${maxPrice}</p>
        </div>
        <input
          type="range"
          min={19}
          max={400}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-safety"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-[11px] text-ink/40 tabular">
          <span>$19</span>
          <span>$400+</span>
        </div>
      </div>

      <div className="rounded-xl bg-ink/[0.035] p-4">
        <p className="text-[12.5px] font-bold">Not sure what fits?</p>
        <p className="mt-1 text-[12px] leading-relaxed text-ink/55">
          Every product here takes a standard 1/4″ quick-connect. Answer three questions and we'll say
          exactly what works with your machine.
        </p>
        <a
          href="#fit"
          className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-bold text-wash hover:underline"
        >
          Use the fit guide <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );

  return (
    <section id="catalog" className="bg-paper py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="The catalog"
          title={
            <>
              15 accessories. <span className="text-ink/35">No filler.</span>
            </>
          }
          desc="We only stock what survives a season of real use — every item rated, spec'd, and returnable for 30 days if it doesn't fit your machine."
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-[13px] font-semibold lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {active && <span className="h-1.5 w-1.5 rounded-full bg-safety" />}
              </button>
              <label className="hidden items-center gap-2 text-[13px] text-ink/60 sm:flex">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-full border border-ink/15 bg-white px-3.5 py-2 text-[13px] font-semibold text-ink outline-none focus:border-wash"
                >
                  {sorts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          }
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-10">
          {/* desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">{FilterPanel}</div>
          </aside>

          <div>
            {/* result line */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-[12.5px] text-ink/50 tabular">
                Showing <span className="font-bold text-ink">{list.length}</span>{" "}
                {list.length === 1 ? "accessory" : "accessories"}
                {cat !== "all" && <> in {categories.find((c) => c.id === cat)?.name.toLowerCase()}</>}
              </p>
              {active && (
                <button
                  onClick={() => {
                    setCat("all");
                    setMaxPrice(400);
                  }}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink/50 hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
              <label className="ml-auto flex items-center gap-2 text-[12.5px] text-ink/60 sm:hidden">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink"
                >
                  {sorts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3">
              {list.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 3} />
              ))}
            </div>

            {list.length === 0 && (
              <div className="rounded-2xl border border-dashed border-ink/15 py-16 text-center">
                <p className="font-display text-lg font-bold">Nothing in that price band.</p>
                <p className="mt-1 text-sm text-ink/50">Raise the max price or pick another category.</p>
                <button
                  onClick={() => {
                    setCat("all");
                    setMaxPrice(400);
                  }}
                  className="mt-4 rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 veil" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-paper p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold">Filters</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-ink/5"
                aria-label="Close filters"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            {FilterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-full bg-ink py-3.5 text-sm font-bold text-paper"
            >
              Show {list.length} results
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
