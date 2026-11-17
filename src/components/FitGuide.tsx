import { useMemo, useState } from "react";
import { ArrowRight, Check, CircleHelp, Gauge, RotateCcw } from "lucide-react";
import { products } from "@/data/products";
import { SectionHead, Reveal } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/utils/cn";

/**
 * A real, useful compatibility check. Almost every accessory in this catalog
 * uses a 1/4" quick-connect, so the honest answer is almost always "yes" —
 * but pressure class and flow matter, and we warn when a machine can't drive
 * an attachment properly.
 */
type Machine = "electric-light" | "electric-mid" | "gas-mid" | "gas-pro";
type Job = "driveway" | "siding" | "vehicles" | "everything";

const machines: { id: Machine; label: string; detail: string; psi: number; gpm: number }[] = [
  { id: "electric-light", label: "Small electric", detail: "1,400–1,800 PSI, ~1.2 GPM", psi: 1600, gpm: 1.2 },
  { id: "electric-mid", label: "Electric", detail: "2,000–3,000 PSI, ~1.4 GPM", psi: 2800, gpm: 1.4 },
  { id: "gas-mid", label: "Gas", detail: "2,500–3,200 PSI, ~2.5 GPM", psi: 3000, gpm: 2.5 },
  { id: "gas-pro", label: "Pro gas / commercial", detail: "3,500–4,000+ PSI, 3+ GPM", psi: 4000, gpm: 3.5 },
];

const jobs: { id: Job; label: string }[] = [
  { id: "driveway", label: "Driveway & concrete" },
  { id: "siding", label: "Siding & roof" },
  { id: "vehicles", label: "Cars & trucks" },
  { id: "everything", label: "A bit of everything" },
];

// Minimum PSI a given product realistically needs to do its job.
const minPsi: Record<string, number> = {
  "rotary-15": 2000,
  "foam-cannon": 1200,
  "turbo-nozzle": 1500,
  "nozzle-tips-5": 1000,
  "telescoping-18": 2000,
  "extension-wand-2pc": 1000,
  "undercarriage-cleaner": 1400,
  "gutter-cleaner": 1600,
  "qc-kit": 1000,
  "starter-kit": 2000,
  "driveway-kit": 2000,
};

export default function FitGuide() {
  const [machine, setMachine] = useState<Machine>("electric-mid");
  const [job, setJob] = useState<Job>("everything");

  const specs = machines.find((m) => m.id === machine)!;

  const picks = useMemo(() => {
    const jobMatch: Record<Job, string[]> = {
      driveway: ["rotary-15", "turbo-nozzle", "driveway-kit", "starter-kit", "nozzle-tips-5"],
      siding: ["telescoping-18", "extension-wand-2pc", "nozzle-tips-5", "gutter-cleaner", "foam-cannon"],
      vehicles: ["foam-cannon", "undercarriage-cleaner", "nozzle-tips-5", "extension-wand-2pc"],
      everything: ["rotary-15", "nozzle-tips-5", "foam-cannon", "telescoping-18", "qc-kit", "starter-kit"],
    };
    return jobMatch[job]
      .map((id) => products.find((p) => p.id === id)!)
      .filter(Boolean)
      .map((p) => ({ product: p, works: specs.psi >= (minPsi[p.id] ?? 1000) }));
  }, [job, specs.psi]);

  const fitCount = picks.filter((p) => p.works).length;

  return (
    <section id="fit" className="bg-ink py-16 text-paper sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHead
              tone="dark"
              eyebrow="Fit guide"
              title={
                <>
                  Will it fit your machine?
                  <span className="block text-paper/35">Yes — mostly.</span>
                </>
              }
              desc={
                <>
                  Nearly every accessory sold here uses the standard 1/4″ quick-connect, so the real
                  question isn't threading — it's whether your machine has the pressure and flow to
                  drive the attachment properly. Pick yours below.
                </>
              }
            />
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-spray" />
              <p className="text-[12.5px] leading-relaxed text-paper/65">
                Undersized machine? A 15″ rotary deck still works at 1,800 PSI — it just turns slower
                and needs a second pass. We flag anything that would disappoint.
              </p>
            </div>
          </div>

          <div>
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-paper/40">
                1 · Your machine
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {machines.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMachine(m.id)}
                    className={cn(
                      "rounded-xl border p-3 text-left transition-all",
                      machine === m.id
                        ? "border-spray bg-spray/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25",
                    )}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-[13px] font-bold">{m.label}</span>
                      {machine === m.id && <Check className="h-4 w-4 text-spray" strokeWidth={3} />}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-paper/45">{m.detail}</span>
                  </button>
                ))}
              </div>

              <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-paper/40">
                2 · The job
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {jobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setJob(j.id)}
                    className={cn(
                      "rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors",
                      job === j.id
                        ? "bg-safety text-white"
                        : "border border-white/12 text-paper/70 hover:border-white/30",
                    )}
                  >
                    {j.label}
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100} className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-paper/40">
                  3 · Recommended
                </p>
                <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-spray">
                  <Gauge className="h-3.5 w-3.5" />
                  {fitCount} of {picks.length} suit your PSI
                </p>
              </div>
              <ul className="space-y-2">
                {picks.map(({ product: p, works }) => (
                  <li key={p.id}>
                    <a
                      href={`#pdp-${p.id}`}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl border p-2.5 transition-colors",
                        works
                          ? "border-white/10 bg-white/[0.04] hover:border-spray/40 hover:bg-spray/[0.07]"
                          : "border-white/[0.06] bg-transparent opacity-60",
                      )}
                    >
                      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                        <ProductImage image={p.image} gallery={p.gallery} alt="" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold">{p.name}</span>
                        <span className="flex items-center gap-1 truncate text-[11px] text-paper/45">
                          {works ? (
                            <>
                              <Check className="h-3 w-3 text-spray" strokeWidth={3} /> Good match for{" "}
                              {specs.psi.toLocaleString()} PSI
                            </>
                          ) : (
                            <>
                              <RotateCcw className="h-3 w-3" /> Wants ~
                              {(minPsi[p.id] ?? 1000).toLocaleString()}+ PSI
                            </>
                          )}
                        </span>
                      </span>
                      <span className="text-[12.5px] font-bold tabular">${p.price}</span>
                      <ArrowRight className="h-4 w-4 text-paper/25 transition-transform group-hover:translate-x-0.5 group-hover:text-spray" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] leading-relaxed text-paper/35">
                Threads covered by the Brass QC Kit: M22-14, 3/8″ and 1/4″. If your machine has an
                unusual fitting, that kit is the $19 fix.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
