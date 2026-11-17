import { useMemo, useState } from "react";
import { ArrowRight, Check, Info, Wrench, Zap, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Link } from "@/lib/router";
import { checkFitment, machineProfiles, products } from "@/data/catalog";
import { money } from "@/lib/format";
import { buttonClass, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

const icons = { fits: Check, caution: Zap, no: X } as const;
const tone = {
  fits: { wrap: "border-emerald-600/25 bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-600" },
  caution: { wrap: "border-amber-500/35 bg-amber-soft", text: "text-amber-900", dot: "bg-amber-500" },
  no: { wrap: "border-rust/25 bg-rust/5", text: "text-rust", dot: "bg-rust" },
} as const;

export default function Fitment() {
  const [machineId, setMachineId] = useState(machineProfiles[2].id);
  const [showAll, setShowAll] = useState(false);
  const machine = machineProfiles.find((m) => m.id === machineId) ?? machineProfiles[0];

  const evaluated = useMemo(
    () =>
      products
        .filter((p) => p.requires)
        .map((p) => ({ product: p, fit: checkFitment(p, machine) }))
        .sort((a, b) => {
          const rank = { fits: 0, caution: 1, no: 2 };
          return rank[a.fit.status] - rank[b.fit.status] || a.product.price - b.product.price;
        }),
    [machine],
  );

  const visible = showAll ? evaluated : evaluated.filter((e) => e.fit.status !== "no");
  const counts = {
    fits: evaluated.filter((e) => e.fit.status === "fits").length,
    caution: evaluated.filter((e) => e.fit.status === "caution").length,
    no: evaluated.filter((e) => e.fit.status === "no").length,
  };

  return (
    <div className="bg-bone">
      {/* Hero */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Eyebrow>Part finder</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.8rem]">
            Tell us your machine. We’ll tell you what bolts up.
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-slate">
            Pressure ratings, pump types and quick-connect sizes checked in one pass. Nothing here is
            guesswork — every rating comes from the manufacturer’s spec sheet.
          </p>

          <div className="mt-7 rounded-2xl border border-line bg-bone p-4 sm:p-5">
            <label htmlFor="machine" className="mb-2 block text-[11.5px] font-semibold text-ink">
              Your pressure washer
            </label>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <select
                id="machine"
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="brand-select h-11 flex-1 rounded-xl border border-ink/15 bg-paper pl-3.5 text-[13px] font-medium text-ink outline-none focus:border-spray"
              >
                <optgroup label="Our machines">
                  {machineProfiles.slice(0, 4).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} · {m.psi.toLocaleString()} PSI · {m.gpm} GPM
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Another brand">
                  {machineProfiles.slice(4).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <a
                href={site.phoneHref}
                className={buttonClass("primary", "md", "h-11 shrink-0")}
              >
                <Wrench className="h-4 w-4" /> Ask a human
              </a>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { k: "Pressure", v: `${machine.psi.toLocaleString()} PSI` },
                { k: "Flow", v: `${machine.gpm} GPM` },
                { k: "Pump", v: machine.pumpType },
                { k: "Connection", v: machine.connection },
              ].map((s) => (
                <div key={s.k} className="rounded-xl bg-paper px-3 py-2 ring-1 ring-line">
                  <dt className="text-[10px] uppercase tracking-wider text-slate">{s.k}</dt>
                  <dd className="mt-0.5 text-[12.5px] font-semibold text-ink">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-5xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-slate">
            <strong className="font-semibold text-ink">{counts.fits}</strong> direct fits ·{" "}
            <strong className="font-semibold text-amber-800">{counts.caution}</strong> need an adapter ·{" "}
            <strong className="font-semibold text-rust">{counts.no}</strong> won’t work
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-slate">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="h-4 w-4 rounded accent-spray"
            />
            Show parts that don’t fit
          </label>
        </div>

        <ul className="mt-4 space-y-2.5">
          {visible.map(({ product, fit }) => {
            const Icon = icons[fit.status];
            const t = tone[fit.status];
            return (
              <li
                key={product.slug}
                className={cn("flex flex-col gap-3 rounded-2xl border bg-paper p-4 sm:flex-row sm:items-center", t.wrap)}
              >
                <img src={product.image} alt="" className="h-16 w-16 shrink-0 rounded-xl border border-line object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13.5px] font-semibold text-ink">{product.shortName}</p>
                    <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white", t.dot)}>
                      <Icon className="h-2.5 w-2.5" strokeWidth={4} /> {fit.headline}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate">{fit.detail}</p>
                  {product.requires?.note && (
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate/80">
                      <Info className="h-3 w-3" /> {product.requires.note}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                  <span className="font-display text-[15px] font-semibold text-ink">{money(product.price)}</span>
                  <Link
                    to={`/product/${product.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink transition hover:bg-ink hover:text-paper"
                  >
                    View <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-paper px-5 py-5">
          <p className="text-[13px] font-semibold text-ink">Still not sure? Two ways to cheat.</p>
          <ol className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-slate">
            <li>
              <strong className="text-ink">1.</strong> Photograph the model plate on the back of the
              machine and text it to {site.phone}. We’ll reply with the exact SKU.
            </li>
            <li>
              <strong className="text-ink">2.</strong> Measure the fitting. 14 mm across the cone is
              M22-14; 15 mm is M22-15. A quick-connect collar has a spring-loaded sleeve, not threads.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
