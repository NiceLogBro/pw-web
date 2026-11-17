import { useEffect, useRef, useState } from "react";
import { Droplets, Menu, Search, ShoppingBag, Truck, X, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCart } from "@/store/cart";
import { products, categories } from "@/data/products";
import { money } from "@/components/ui";

const links = [
  { label: "Shop all", href: "#catalog" },
  { label: "Surface cleaners", href: "#catalog" },
  { label: "Kits", href: "#kits" },
  { label: "The Lab", href: "#lab" },
  { label: "Support", href: "#support" },
];

export function AnnouncementBar() {
  return (
    <div className="relative z-40 bg-ink text-paper">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-[11.5px] font-medium tracking-wide">
          <Truck className="h-3.5 w-3.5 shrink-0 text-spray" strokeWidth={2.2} />
          <span className="whitespace-nowrap">Free shipping over $59</span>
          <span className="hidden text-paper/25 sm:inline" aria-hidden>
            |
          </span>
          <span className="hidden whitespace-nowrap text-paper/65 sm:inline">
            30-day returns, no restocking fee
          </span>
        </p>
        <p className="hidden items-center gap-2 text-[11.5px] tracking-wide text-paper/65 md:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-spray animate-pulse" />
          Ships from Savannah, GA — most orders leave same day
        </p>
      </div>
    </div>
  );
}

export default function Header() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = search.trim().toLowerCase();
  const results = q
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.bestFor.toLowerCase().includes(q) ||
            p.category.includes(q),
        )
        .slice(0, 5)
    : [];

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-colors duration-300",
          scrolled
            ? "border-ink/10 bg-paper/92 backdrop-blur-xl"
            : "border-transparent bg-paper",
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-8 lg:px-8">
          {/* Mobile menu */}
          <button
            onClick={() => setMenu(true)}
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>

          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-ink shadow-sm">
              <Droplets className="h-[19px] w-[19px] text-spray" strokeWidth={2.4} />
            </span>
            <span className="font-display text-[19px] font-extrabold leading-none tracking-tight">
              Bahama<span className="text-safety">Blast</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[13.5px] font-medium text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            {/* Inline search, desktop */}
            <div className="relative hidden lg:block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search accessories…"
                aria-label="Search accessories"
                className="h-10 w-[240px] rounded-full border border-ink/12 bg-white/70 pl-10 pr-4 text-[13.5px] outline-none transition-all placeholder:text-ink/35 focus:w-[300px] focus:border-wash/50 focus:bg-white focus:ring-4 focus:ring-wash/10"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink/40 hover:bg-ink/5"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink/80 hover:bg-ink/5 lg:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setOpen(true)}
              className="relative ml-0.5 flex h-10 items-center gap-2 rounded-full px-3 text-ink transition-colors hover:bg-ink/5"
              aria-label={`Cart, ${count} items`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.9} />
              <span className="hidden text-[13.5px] font-semibold sm:inline tabular">{count}</span>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-safety px-1 text-[10px] font-bold text-white sm:hidden tabular">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop search results dropdown */}
        {searchOpen && q && (
          <>
            <div className="fixed inset-0 z-30 bg-ink/10" onClick={() => setSearchOpen(false)} />
            <div className="absolute inset-x-0 top-full z-40 hidden border-b border-ink/10 bg-white shadow-xl lg:block">
              <div className="mx-auto max-w-3xl px-6 py-4">
                {results.length === 0 ? (
                  <p className="py-6 text-center text-sm text-ink/50">
                    No accessories match “{search}”. Try “nozzle”, “hose” or “foam”.
                  </p>
                ) : (
                  <ul className="divide-y divide-ink/5">
                    {results.map((p) => (
                      <li key={p.id}>
                        <a
                          href={`#product-${p.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-4 py-2.5 hover:bg-paper"
                        >
                          <img
                            src={p.image}
                            alt=""
                            className="h-12 w-12 rounded-lg border border-ink/8 object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-semibold">{p.name}</span>
                            <span className="block truncate text-xs text-ink/50">{p.tagline}</span>
                          </span>
                          <span className="text-[13.5px] font-semibold tabular">{money(p.price)}</span>
                          <ChevronRight className="h-4 w-4 text-ink/25" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="border-t border-ink/5 pt-3 text-[11px] uppercase tracking-[0.18em] text-ink/35">
                  {results.length} of {products.length} accessories —{" "}
                  <a href="#catalog" onClick={() => setSearchOpen(false)} className="text-wash">
                    browse all
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile search sheet */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 veil" onClick={() => setSearchOpen(false)} />
          <div className="relative mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-ink/8 px-4">
              <Search className="h-4.5 w-4.5 text-ink/40" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nozzles, hoses, kits…"
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink/35"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-ink/50 hover:bg-ink/5"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto">
              {(q ? results : products.slice(0, 4)).map((p) => (
                <li key={p.id}>
                  <a
                    href={`#product-${p.id}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearch("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 active:bg-paper"
                  >
                    <img src={p.image} alt="" className="h-11 w-11 rounded-lg border border-ink/8" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.name}</span>
                      <span className="block truncate text-xs text-ink/50">{p.tagline}</span>
                    </span>
                    <span className="text-sm font-semibold tabular">{money(p.price)}</span>
                  </a>
                </li>
              ))}
              {q && results.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-ink/50">Nothing matches that yet.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile nav drawer */}
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 veil" onClick={() => setMenu(false)} />
          <div className="relative flex h-full w-[84%] max-w-sm flex-col bg-paper drawer-panel">
            <div className="flex h-16 items-center justify-between px-5">
              <span className="font-display text-lg font-extrabold">
                Bahama<span className="text-safety">Blast</span>
              </span>
              <button
                onClick={() => setMenu(false)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 pb-6">
              <p className="px-3 pb-2 pt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/35">
                Shop by category
              </p>
              {categories.map((c) => (
                <a
                  key={c.id}
                  href="#catalog"
                  onClick={() => setMenu(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium hover:bg-ink/5"
                >
                  {c.name}
                  <ChevronRight className="h-4 w-4 text-ink/30" />
                </a>
              ))}
              <p className="px-3 pb-2 pt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/35">
                More
              </p>
              {[
                ["Kits & bundles", "#kits"],
                ["The Lab — how-to", "#lab"],
                ["Reviews", "#reviews"],
                ["Shipping & returns", "#support"],
                ["Fit guide", "#fit"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenu(false)}
                  className="block rounded-xl px-3 py-3 text-[15px] font-medium hover:bg-ink/5"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="border-t border-ink/10 p-5">
              <button
                onClick={() => {
                  setMenu(false);
                  setOpen(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper"
              >
                <ShoppingBag className="h-4 w-4" /> View cart ({count})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
