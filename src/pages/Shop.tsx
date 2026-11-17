import { useMemo, useState } from "react";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Link, navigate, useRoute } from "@/lib/router";
import { categories, products, type CategorySlug, type Product } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { Button, Eyebrow, Reveal } from "@/components/ui";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";
type StockFilter = "all" | "in-stock";

const sortLabels: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
};

const priceBands = [
  { id: "under-30", label: "Under $30", test: (p: Product) => p.price < 3000 },
  { id: "30-100", label: "$30 – $100", test: (p: Product) => p.price >= 3000 && p.price <= 10000 },
  { id: "100-250", label: "$100 – $250", test: (p: Product) => p.price > 10000 && p.price <= 25000 },
  { id: "over-250", label: "Over $250", test: (p: Product) => p.price > 25000 },
];

export default function Shop() {
  const route = useRoute();
  const category = route.query.get("category") as CategorySlug | null;
  const query = route.query.get("q") ?? "";
  const sort = (route.query.get("sort") as SortKey) ?? "featured";
  const stock = (route.query.get("stock") as StockFilter) ?? "all";
  const band = route.query.get("price");
  const [mobileFilters, setMobileFilters] = useState(false);

  const activeCategory = categories.find((c) => c.slug === category) ?? null;

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(route.query.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    navigate(`/shop${qs ? `?${qs}` : ""}`, { keepScroll: true });
  };

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (stock === "in-stock" && p.stock !== "in-stock") return false;
      if (band) {
        const b = priceBands.find((x) => x.id === band);
        if (b && !b.test(p)) return false;
      }
      if (term) {
        const hay = [p.name, p.shortName, p.brand, p.blurb, ...p.tags].join(" ").toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return Number(b.featured ?? false) - Number(a.featured ?? false) || b.reviews - a.reviews;
      }
    });
    return list;
  }, [category, query, sort, stock, band]);

  const activeFilterCount =
    (category ? 1 : 0) + (stock === "in-stock" ? 1 : 0) + (band ? 1 : 0) + (query ? 1 : 0);

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <p className="label-eyebrow text-slate">Category</p>
        <ul className="mt-3 space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => setParam("category", null)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13.5px] transition",
                !category ? "bg-ink text-paper" : "text-ink/75 hover:bg-paper",
              )}
            >
              All products
              <span className="text-[11px] opacity-70 tabular-nums">{products.length}</span>
            </button>
          </li>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            const active = category === c.slug;
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => setParam("category", c.slug)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13.5px] transition",
                    active ? "bg-ink text-paper" : "text-ink/75 hover:bg-paper",
                  )}
                >
                  {c.name}
                  <span className="text-[11px] opacity-70 tabular-nums">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="label-eyebrow text-slate">Price</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {priceBands.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setParam("price", band === b.id ? null : b.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-medium transition",
                band === b.id
                  ? "bg-spray text-white"
                  : "bg-paper text-ink/70 ring-1 ring-line hover:text-ink",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-eyebrow text-slate">Availability</p>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[13px] text-ink/80">
          <input
            type="checkbox"
            checked={stock === "in-stock"}
            onChange={(e) => setParam("stock", e.target.checked ? "in-stock" : null)}
            className="h-4 w-4 rounded border-ink/25 accent-spray"
          />
          In stock, ships in 2 days
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={() => navigate("/shop", { keepScroll: true })}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-rust transition hover:underline"
        >
          <X className="h-3.5 w-3.5" /> Clear all filters
        </button>
      )}

      <div className="rounded-xl bg-ink p-4 text-paper">
        <p className="font-display text-[13px] font-semibold">Not sure what fits?</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-paper/60">
          Enter your washer model and we'll flag the parts that don't match.
        </p>
        <Link
          to="/fitment"
          className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-spray hover:underline"
        >
          Open fitment finder <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-bone">
      {/* Header band */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11.5px] text-slate">
            <Link to="/" className="transition hover:text-ink">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="transition hover:text-ink">
              Shop
            </Link>
            {activeCategory && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-ink">{activeCategory.name}</span>
              </>
            )}
          </nav>

          <Eyebrow className="mt-4">{activeCategory ? "Category" : "Full catalog"}</Eyebrow>
          <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.6rem]">
            {activeCategory ? activeCategory.name : query ? `Results for “${query}”` : "Every part on the counter"}
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-slate">
            {activeCategory
              ? activeCategory.blurb
              : "Machines, pumps, nozzles, hose, surface cleaners and chemistry. All stock held in US warehouses, all of it rated for island water and red dirt."}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[236px_1fr] lg:gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">{filterPanel}</div>
          </aside>

          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <p className="text-[12.5px] text-slate">
                <span className="font-semibold text-ink tabular-nums">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "product" : "products"}
                {query && <span className="text-slate"> · “{query}”</span>}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFilters(true)}
                  className="flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 text-[12px] font-semibold text-ink lg:hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-spray px-1.5 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <label className="flex items-center gap-2 text-[12px] text-slate">
                  <span className="hidden sm:inline">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => setParam("sort", e.target.value)}
                    className="brand-select h-9 rounded-full border border-ink/15 bg-paper pl-3 text-[12.5px] font-medium text-ink outline-none focus:border-spray"
                  >
                    {Object.entries(sortLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {category && (
                  <Chip label={categories.find((c) => c.slug === category)?.name ?? category} onClear={() => setParam("category", null)} />
                )}
                {band && <Chip label={priceBands.find((b) => b.id === band)?.label ?? band} onClear={() => setParam("price", null)} />}
                {stock === "in-stock" && <Chip label="In stock" onClear={() => setParam("stock", null)} />}
                {query && <Chip label={`“${query}”`} onClear={() => setParam("q", null)} />}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 3) * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-ink/20 bg-paper px-6 py-14 text-center">
                <p className="font-display text-lg font-semibold text-ink">Nothing matches those filters</p>
                <p className="mx-auto mt-2 max-w-sm text-[13px] text-slate">
                  Try clearing a filter — or tell us your machine model and we'll pull the exact part.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button variant="primary" onClick={() => navigate("/shop", { keepScroll: true })}>
                    Clear filters
                  </Button>
                  <Link
                    to="/fitment"
                    className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 text-sm font-semibold text-ink transition hover:border-ink"
                  >
                    Find my part
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFilters(false)}
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-3xl bg-bone p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-ink">Filters</p>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
            <Button variant="primary" size="lg" className="mt-6 w-full" onClick={() => setMobileFilters(false)}>
              Show {filtered.length} products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-[11.5px] font-medium text-ink ring-1 ring-line">
      {label}
      <button type="button" onClick={onClear} aria-label={`Remove ${label} filter`} className="text-slate transition hover:text-rust">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
