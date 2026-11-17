import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Link, navigate, shopHref, useRoute } from "@/lib/router";
import { categories, products } from "@/data/catalog";
import { money } from "@/lib/format";
import { site, shipping } from "@/lib/site";
import { useCart } from "@/store/cart";
import { Logo } from "@/components/layout/Logo";

const primaryLinks = [
  { to: "/shop", label: "Shop all" },
  { to: shopHref({ category: "machines" }), label: "Machines" },
  { to: shopHref({ category: "pumps" }), label: "Parts" },
  { to: shopHref({ category: "chemicals" }), label: "Chemicals" },
  { to: "/service", label: "Wash service" },
  { to: "/fitment", label: "Find my part" },
];

export default function Header() {
  const { totals, openCart } = useCart();
  const route = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [route.path, route.query.toString()]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-line bg-bone/92 backdrop-blur-md"
            : "border-transparent bg-bone",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[70px] sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-ink/5 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo className="mr-2" />

          <nav aria-label="Store" className="ml-4 hidden items-center gap-1 lg:flex">
            {primaryLinks.map((l) => {
              const target = l.to.split("?")[0];
              const isActive =
                route.path === target &&
                (l.to.includes("?") ? route.query.get("category") === l.to.split("category=")[1] : true);
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-[13.5px] font-medium text-ink/75 transition-colors hover:bg-ink/5 hover:text-ink",
                    isActive && "bg-ink/5 text-ink",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-ink/5"
              aria-label={searchOpen ? "Close search" : "Search products"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <a
              href={site.phoneHref}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold text-ink transition hover:bg-ink/5 xl:flex"
            >
              <Phone className="h-4 w-4 text-spray-deep" />
              {site.phone}
            </a>

            <button
              type="button"
              onClick={openCart}
              className="relative ml-0.5 flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-semibold text-paper transition hover:bg-marine"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-spray px-1.5 text-[11px] font-bold text-white tabular-nums">
                {totals.itemCount}
              </span>
            </button>
          </div>
        </div>

        {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      </header>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}

function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-6 px-4 text-[11.5px] font-medium tracking-[0.01em] sm:justify-between sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-spray" />
          Free shipping over {money(shipping.freeThreshold)}
          <span className="hidden text-paper/40 sm:inline">·</span>
          <span className="hidden text-paper/65 sm:inline">2-day delivery to O&apos;ahu</span>
        </p>
        <p className="hidden items-center gap-2 text-paper/65 sm:flex">
          <Wrench className="h-3.5 w-3.5 text-spray" />
          {site.pickup} · {site.hours}
        </p>
      </div>
    </div>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return products
      .filter((p) =>
        [p.name, p.brand, p.category, ...p.tags].join(" ").toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [q]);

  return (
    <div className="border-t border-line bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!q.trim()) return;
            navigate(shopHref({ q: q.trim() }));
            onClose();
          }}
          className="flex items-center gap-3 rounded-full border border-ink/15 bg-bone px-4 focus-within:border-spray"
        >
          <Search className="h-4 w-4 shrink-0 text-slate" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search nozzles, pumps, hoses, chemicals…"
            className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate/70"
            aria-label="Search products"
          />
          <button type="submit" className="shrink-0 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-semibold text-paper">
            Search
          </button>
        </form>

        {q.trim().length >= 2 && (
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper">
            {results.length === 0 && (
              <li className="px-4 py-4 text-sm text-slate">
                No match for “{q}”. Try “nozzle”, “pump”, or “hose” — or{" "}
                <Link to="/fitment" onClick={onClose} className="font-semibold text-spray-deep underline-offset-2 hover:underline">
                  use the fitment finder
                </Link>
                .
              </li>
            )}
            {results.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/product/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-bone"
                >
                  <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{p.shortName}</span>
                    <span className="block text-[11px] text-slate">{p.brand} · {p.category}</span>
                  </span>
                  <span className="text-sm font-semibold text-ink">{money(p.price)}</span>
                  <ChevronRight className="h-4 w-4 text-slate" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />
      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-bone shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile store">
          <p className="label-eyebrow text-slate">Shop by category</p>
          <ul className="mt-2 space-y-0.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to={shopHref({ category: c.slug })}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink transition hover:bg-paper"
                >
                  {c.name}
                  <ChevronRight className="h-4 w-4 text-slate" />
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-6 label-eyebrow text-slate">More</p>
          <ul className="mt-2 space-y-0.5">
            {[
              { to: "/service", label: "Wash service (O'ahu)" },
              { to: "/fitment", label: "Find my part" },
              { to: "/support", label: "Shipping & returns" },
              { to: "/about", label: "About us" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink transition hover:bg-paper"
                >
                  {l.label}
                  <ChevronRight className="h-4 w-4 text-slate" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line p-4">
          <a
            href={site.phoneHref}
            className="flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-paper"
          >
            <Phone className="h-4 w-4" /> {site.phone}
          </a>
          <p className="mt-2 text-center text-[11px] text-slate">{site.hours}</p>
        </div>
      </div>
    </div>
  );
}
