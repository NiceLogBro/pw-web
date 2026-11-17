import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Package,
  RotateCcw,
  ShieldCheck,
  ShipWheel,
  Truck,
  X,
  Zap,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Link, navigate, shopHref, useRoute } from "@/lib/router";
import {
  categoryBySlug,
  checkFitment,
  machineProfiles,
  productBySlug,
  products,
  type FitmentResult,
} from "@/data/catalog";
import { money, percentOff } from "@/lib/format";
import { shipping } from "@/lib/site";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { Badge, Button, Price, Reveal, Stars, StockPill } from "@/components/ui";
import ProductCard from "@/components/ProductCard";

export default function ProductPage() {
  const route = useRoute();
  const slug = route.segments[1] ?? "";
  const product = productBySlug(slug);
  const { add } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "specs" | "shipping">("details");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setQty(1);
    setActiveImage(0);
    setTab("details");
  }, [slug]);

  useEffect(() => {
    if (product) document.title = `${product.name} — PowerWashingOahu.com`;
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    const sameCat = products.filter((p) => p.category === product.category && p.slug !== product.slug);
    const fillers = products.filter(
      (p) => p.category !== product.category && (p.bestseller || p.featured) && p.slug !== product.slug,
    );
    return [...sameCat, ...fillers].slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="font-display text-2xl font-semibold text-ink">Product not found</p>
        <p className="mt-2 text-sm text-slate">That link may be from an older catalog.</p>
        <Button variant="primary" className="mt-6" onClick={() => navigate("/shop")}>
          Browse the catalog
        </Button>
      </div>
    );
  }

  const cat = categoryBySlug(product.category);
  const off = percentOff(product.price, product.compareAt);
  // Only real photography of this SKU — never another product's photo.
  const gallery = [product.image];

  return (
    <div className="bg-bone">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-slate">
          <Link to="/" className="transition hover:text-ink">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="transition hover:text-ink">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={shopHref({ category: product.category })} className="transition hover:text-ink">
            {cat?.name}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-ink">{product.shortName}</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-[#eef1f4]">
              <img
                key={gallery[activeImage]}
                src={gallery[activeImage]}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
              <div className="absolute left-3.5 top-3.5 flex flex-col gap-1.5">
                {product.bestseller && <Badge tone="ink">Bestseller</Badge>}
                {off && <Badge tone="amber">Save {off}%</Badge>}
              </div>
            </div>

            {gallery.length > 1 && (
            <div className="mt-3 flex gap-2.5">
              {gallery.map((g, i) => (
                <button
                  key={g + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "overflow-hidden rounded-xl border-2 transition",
                    activeImage === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={g} alt="" className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
                </button>
              ))}
            </div>
            )}

            {/* Trust row */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {[
                { icon: Truck, title: "Free shipping", note: `Over ${money(shipping.freeThreshold)}` },
                { icon: RotateCcw, title: "30-day returns", note: "We pay return label" },
                { icon: ShieldCheck, title: "Warranty", note: "US service center" },
              ].map((t) => (
                <div key={t.title} className="rounded-xl border border-line bg-paper px-2.5 py-3 text-center">
                  <t.icon className="mx-auto h-4 w-4 text-spray-deep" />
                  <p className="mt-1.5 text-[11px] font-semibold leading-tight text-ink">{t.title}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-slate">{t.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-eyebrow text-[10px] text-slate">{product.brand}</span>
              <span className="h-3 w-px bg-ink/15" />
              <Link to={shopHref({ category: product.category })} className="text-[11.5px] text-slate underline-offset-2 hover:text-ink hover:underline">
                {cat?.name}
              </Link>
            </div>

            <h1 className="mt-2.5 font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.1rem]">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Stars rating={product.rating} count={product.reviews} />
              <StockPill stock={product.stock} />
            </div>

            <p className="mt-4 text-[14.5px] leading-relaxed text-slate">{product.blurb}</p>

            <div className="mt-5 rounded-2xl border border-line bg-paper p-4 sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <Price product={product} size="lg" />
                  <p className="mt-1.5 text-[11.5px] text-slate">
                    or 4 interest-free payments of <strong className="text-ink">{money(Math.round(product.price / 4))}</strong>
                  </p>
                </div>
                <span className="rounded-full bg-spray-soft px-2.5 py-1 text-[11px] font-semibold text-spray-deep">
                  {product.shipsIn}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <div className="inline-flex h-12 items-center rounded-full border border-ink/15 bg-bone">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-full w-11 items-center justify-center rounded-full transition hover:bg-ink/5 disabled:opacity-30"
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(12, q + 1))}
                    className="flex h-full w-11 items-center justify-center rounded-full transition hover:bg-ink/5 disabled:opacity-30"
                    disabled={qty >= 12}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  variant="primary"
                  className="h-12 flex-1 text-[15px]"
                  onClick={() => {
                    add(product.slug, qty);
                    toast(`${product.shortName}${qty > 1 ? ` ×${qty}` : ""} added to cart`);
                  }}
                >
                  Add to cart · {money(product.price * qty)}
                </Button>
              </div>

              <button
                type="button"
                onClick={() => {
                  add(product.slug, qty);
                  toast("Saved — heading to checkout");
                  navigate("/checkout");
                }}
                className="mt-2.5 w-full rounded-full border border-ink py-3 text-[14px] font-semibold text-ink transition hover:bg-ink hover:text-paper"
              >
                Buy it now
              </button>

              <ul className="mt-4 space-y-1.5 border-t border-line pt-3.5">
                {product.bullets.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink/80">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-spray-deep" strokeWidth={3} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fitment checker */}
            {product.requires && <FitmentChecker slug={product.slug} />}

            {/* Tabs */}
            <div className="mt-7">
              <div className="flex gap-1 border-b border-line">
                {(
                  [
                    ["details", "Details"],
                    ["specs", "Specs"],
                    ["shipping", "Shipping & returns"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={cn(
                      "relative px-3 py-2.5 text-[13px] font-semibold transition-colors",
                      tab === id ? "text-ink" : "text-slate hover:text-ink",
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        "absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-ink transition-transform",
                        tab === id ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="pt-4 text-[13.5px] leading-relaxed text-slate">
                {tab === "details" && (
                  <div className="space-y-3">
                    <p>{product.description}</p>
                    <ul className="space-y-1.5">
                      {product.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-spray-deep" strokeWidth={3} />
                          <span className="text-ink/80">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === "specs" && (
                  <dl className="overflow-hidden rounded-xl border border-line bg-paper">
                    {product.specs.map((s, i) => (
                      <div
                        key={s.label}
                        className={cn("flex justify-between gap-6 px-4 py-2.5", i % 2 === 0 ? "bg-bone/60" : "")}
                      >
                        <dt className="text-slate">{s.label}</dt>
                        <dd className="text-right font-medium text-ink">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {tab === "shipping" && (
                  <div className="space-y-3">
                    <p className="flex items-start gap-2">
                      <Truck className="mt-0.5 h-4 w-4 shrink-0 text-spray-deep" />
                      <span>
                        <strong className="text-ink">{product.shipsIn}.</strong> Orders placed before 1pm HST ship
                        the same business day from a US warehouse. O’ahu addresses typically see delivery in
                        2–3 business days; neighbor islands 3–5.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-spray-deep" />
                      <span>
                        <strong className="text-ink">30-day fit guarantee.</strong> If it doesn’t bolt up, we
                        email a prepaid label and there’s no restocking fee. Chemicals and opened detergent
                        are non-returnable once the seal is broken.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <ShipWheel className="mt-0.5 h-4 w-4 shrink-0 text-spray-deep" />
                      <span>
                        <strong className="text-ink">Ground-only items.</strong> Chemicals and gas machines
                        can’t fly, so they travel by ocean/ground freight — expect one extra day.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-16 border-t border-line pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label-eyebrow text-spray-deep">Pairs with</p>
              <h2 className="mt-2.5 font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
                What else goes on this job
              </h2>
            </div>
            <Link to="/shop" className="hidden text-[12.5px] font-semibold text-ink hover:text-spray-deep sm:block">
              Shop all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} compact />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function FitmentChecker({ slug }: { slug: string }) {
  const product = productBySlug(slug)!;
  const [machineId, setMachineId] = useState("");
  const machine = machineProfiles.find((m) => m.id === machineId);
  const result: FitmentResult | null = machine ? checkFitment(product, machine) : null;

  const tone = {
    fits: { wrap: "border-emerald-600/30 bg-emerald-50", icon: Check, text: "text-emerald-800", chip: "bg-emerald-600" },
    caution: { wrap: "border-amber-500/40 bg-amber-soft", icon: Zap, text: "text-amber-900", chip: "bg-amber-500" },
    no: { wrap: "border-rust/30 bg-rust/5", icon: X, text: "text-rust", chip: "bg-rust" },
  } as const;

  return (
    <div className="mt-4 rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-spray-deep" />
        <p className="text-[12.5px] font-semibold text-ink">Will this fit my machine?</p>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <select
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
          className="brand-select h-10 flex-1 rounded-full border border-ink/15 bg-bone pl-3.5 text-[12.5px] font-medium text-ink outline-none focus:border-spray"
          aria-label="Choose your machine"
        >
          <option value="">Select your washer…</option>
          {machineProfiles.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} · {m.psi.toLocaleString()} PSI
            </option>
          ))}
        </select>
        <Link
          to="/fitment"
          className="flex h-10 items-center justify-center rounded-full border border-ink/15 px-4 text-[12px] font-semibold text-ink transition hover:border-ink sm:shrink-0"
        >
          Full finder
        </Link>
      </div>

      {result && (
        <div className={cn("mt-3 flex gap-3 rounded-xl border p-3.5", tone[result.status].wrap)}>
          <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white", tone[result.status].chip)}>
            {(() => {
              const Icon = tone[result.status].icon;
              return <Icon className="h-3 w-3" strokeWidth={3.5} />;
            })()}
          </span>
          <div>
            <p className={cn("text-[12.5px] font-bold", tone[result.status].text)}>{result.headline}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-ink/70">{result.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}
