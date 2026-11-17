import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { byId, categoryName, fitsLabel, products } from "@/data/products";
import { useCart } from "@/store/cart";
import { Stars, money, Pill } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/utils/cn";

/** Reads the current `#pdp-<id>` hash, if any. */
function useHashProduct() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#pdp-(.+)$/);
      setId(m ? decodeURIComponent(m[1]) : null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return id && products.some((p) => p.id === id) ? id : null;
}

export default function ProductModal() {
  const id = useHashProduct();
  const { add, open: cartOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const close = useCallback(() => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, []);

  // Never show two dialogs at once: adding to cart opens the drawer, so the
  // product modal steps aside.
  useEffect(() => {
    if (id && cartOpen) close();
  }, [id, cartOpen, close]);

  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [id]);

  if (!id) return null;
  const p = byId(id);

  const related = products
    .filter((x) => x.id !== p.id && (x.category === p.category || x.bestFor === p.bestFor))
    .slice(0, 3);
  const off = p.compareAt ? p.compareAt - p.price : 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name} details`}
    >
      <div className="absolute inset-0 bg-ink/55 backdrop-blur-[3px] veil" onClick={close} />
      <div className="relative flex max-h-[93vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white"
          aria-label="Close product details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          <div className="grid sm:grid-cols-2">
            {/* image side */}
            <div className="relative bg-[#efede7]">
              <ProductImage
                image={p.image}
                gallery={p.gallery}
                alt={`${p.name} — ${p.tagline}`}
                className="h-64 sm:h-full sm:min-h-[420px]"
                eager
              />
              <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
                {off > 0 && <Pill tone="sale">Save {money(off)}</Pill>}
                {p.badges?.map((b) => (
                  <Pill key={b} tone="neutral" className="bg-white/90 backdrop-blur">
                    {b}
                  </Pill>
                ))}
              </div>
            </div>

            {/* detail side */}
            <div className="p-5 sm:p-7">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink/40">
                {categoryName(p.category)}
              </p>
              <h2 className="mt-1.5 font-display text-[26px] font-extrabold leading-tight text-ink sm:text-[30px]">
                {p.name}
              </h2>
              <p className="mt-1 text-[13.5px] text-ink/55">{p.tagline}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="flex items-center gap-1.5">
                  <Stars rating={p.rating} size="md" />
                  <span className="text-[12.5px] font-semibold tabular">{p.rating.toFixed(1)}</span>
                  <a href="#reviews" onClick={close} className="text-[12.5px] text-ink/45 underline underline-offset-2 hover:text-ink">
                    {p.reviews.toLocaleString()} reviews
                  </a>
                </span>
                <span className="text-ink/15" aria-hidden>|</span>
                <span className="flex items-center gap-1 text-[12px] font-medium text-lagoon">
                  <BadgeCheck className="h-4 w-4 text-wash" /> In stock
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-2.5">
                <span className="text-[30px] font-extrabold tracking-tight tabular">{money(p.price)}</span>
                {p.compareAt && (
                  <span className="text-[16px] text-ink/35 line-through tabular">{money(p.compareAt)}</span>
                )}
                {off > 0 && (
                  <span className="rounded-md bg-sale/10 px-1.5 py-0.5 text-[11.5px] font-bold text-sale">
                    You save {money(off)}
                  </span>
                )}
              </div>

              <p className="mt-4 text-[13.5px] leading-relaxed text-ink/65">{p.blurb}</p>

              {/* bullets */}
              <ul className="mt-4 space-y-1.5">
                {p.bullets.slice(0, 5).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-ink/70">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-wash" strokeWidth={3} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* fits */}
              <div className="mt-5 rounded-xl border border-ink/8 bg-white/60 p-3.5">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/40">
                  Fits
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.fits.map((f) => (
                    <li
                      key={f}
                      className="rounded-full bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink/70 ring-1 ring-ink/8"
                    >
                      {fitsLabel[f]}
                    </li>
                  ))}
                </ul>
              </div>

              {/* qty + add */}
              <div className="mt-5 flex items-stretch gap-2.5">
                <div className="flex items-center rounded-full border border-ink/15 bg-white">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-11 w-10 place-items-center rounded-l-full text-ink/60 hover:bg-ink/5 disabled:opacity-30"
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-7 text-center text-[14px] font-bold tabular">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="grid h-11 w-10 place-items-center rounded-r-full text-ink/60 hover:bg-ink/5"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    add(p.id, qty);
                    setAdded(true);
                  }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-bold text-white transition-all active:scale-[0.99]",
                    added ? "bg-wash" : "bg-safety hover:bg-safety-deep",
                  )}
                >
                  {added ? (
                    <>
                      <Check className="h-4.5 w-4.5" strokeWidth={3} /> Added — {money(p.price * qty)}
                    </>
                  ) : (
                    <>Add to cart — {money(p.price * qty)}</>
                  )}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 rounded-lg bg-ink/[0.03] px-2 py-2.5 text-center">
                  <Truck className="h-4 w-4 text-ink/45" />
                  <span className="text-[10.5px] font-semibold leading-tight text-ink/55">{p.shipsIn}</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-ink/[0.03] px-2 py-2.5 text-center">
                  <RotateCcw className="h-4 w-4 text-ink/45" />
                  <span className="text-[10.5px] font-semibold leading-tight text-ink/55">30-day returns</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-ink/[0.03] px-2 py-2.5 text-center">
                  <ShieldCheck className="h-4 w-4 text-ink/45" />
                  <span className="text-[10.5px] font-semibold leading-tight text-ink/55">2-yr warranty</span>
                </div>
              </div>

              {/* specs */}
              <div className="mt-6 border-t border-ink/10 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                  Specifications
                </p>
                <dl className="mt-2 divide-y divide-ink/5">
                  {p.specs.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between gap-4 py-1.5">
                      <dt className="text-[12.5px] text-ink/50">{s.label}</dt>
                      <dd className="text-right text-[12.5px] font-semibold tabular">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <details className="group mt-4 border-t border-ink/10 pt-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[12.5px] font-bold">
                  Shipping, returns & warranty
                  <ChevronDown className="h-4 w-4 text-ink/40 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-ink/55">
                  <p>{p.shipsIn} on orders over $59. Orders placed before 2pm ET leave the same day.</p>
                  <p>30 days to return it in any condition, minus return freight. No restocking fee, ever.</p>
                  <p>Two-year warranty against manufacturing defects — we ship replacement parts, not attitude.</p>
                </div>
              </details>
            </div>
          </div>

          {/* related */}
          {related.length > 0 && (
            <div className="border-t border-ink/10 bg-white/50 px-5 py-6 sm:px-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                Pairs well with
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {related.map((r) => (
                  <a
                    key={r.id}
                    href={`#pdp-${r.id}`}
                    className="flex items-center gap-3 rounded-xl border border-ink/8 bg-white p-2.5 transition-colors hover:border-ink/20"
                  >
                    <img src={r.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] font-bold">{r.name}</span>
                      <span className="text-[12px] text-ink/50 tabular">{money(r.price)}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
