import { ArrowRight, Check } from "lucide-react";
import { byId } from "@/data/products";
import { useCart } from "@/store/cart";
import { money, Reveal, SectionHead } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";

/** Decision aid: the right first purchase depends on the job, not the budget. */
const paths = [
  {
    id: "rotary-15",
    label: "You have concrete to do",
    detail: "Driveway, patio, sidewalk, garage floor",
    why: "A rotary deck is the single biggest upgrade a machine can get — it covers 4× the square footage of a wand per minute and leaves no lap marks.",
    pick: "The Rotary 15",
  },
  {
    id: "foam-cannon",
    label: "You mostly wash vehicles",
    detail: "Cars, trucks, boats, vinyl siding",
    why: "Thick clinging foam does the work before a mitt ever touches the paint. It's the least expensive way to stop putting swirl marks in a finish.",
    pick: "Soapworks 1L Foam Cannon",
  },
  {
    id: "telescoping-18",
    label: "You're tired of ladders",
    detail: "Second-story siding, soffits, gutters",
    why: "An 18 ft telescoping wand with a shoulder harness replaces a ladder for everything a hose can reach — which, for most two-story homes, is all of it.",
    pick: "Skyreach 18 Telescoping Wand",
  },
];

export default function StartHere() {
  const { add } = useCart();

  return (
    <section id="start" className="bg-white/60 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Start here"
          title={
            <>
              What to buy first, <span className="text-ink/35">depending on your driveway.</span>
            </>
          }
          desc="Most people don't need an accessory haul — they need the one piece that matches the job they keep putting off. Pick the job you actually have."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {paths.map((path, i) => {
            const p = byId(path.id);
            return (
              <Reveal key={path.id} delay={i * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper">
                  <div className="relative h-44 overflow-hidden bg-[#efede7]">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                      <ProductImage image={p.image} gallery={p.gallery} alt={p.name} />
                    </div>
                    <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-paper">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-safety-deep">
                      {path.label}
                    </p>
                    <h3 className="mt-1 font-display text-[19px] font-extrabold leading-tight">
                      {path.pick}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-ink/45">{path.detail}</p>
                    <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink/60">{path.why}</p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <span className="flex items-baseline gap-1.5">
                        <span className="text-[19px] font-extrabold tabular">{money(p.price)}</span>
                        {p.compareAt && (
                          <span className="text-[12px] text-ink/35 line-through tabular">
                            {money(p.compareAt)}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`#pdp-${p.id}`}
                          className="rounded-full border border-ink/15 px-3 py-2 text-[11.5px] font-bold hover:border-ink/35"
                        >
                          Details
                        </a>
                        <button
                          onClick={() => add(p.id, 1, { openDrawer: false })}
                          className="inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-2 text-[11.5px] font-bold text-paper transition-colors hover:bg-safety"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120} className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-paper px-4 py-3">
          <p className="text-[12.5px] text-ink/60">
            Genuinely unsure?{" "}
            <span className="font-semibold text-ink">
              Tell us your machine's PSI and the job
            </span>{" "}
            — we'll answer in about two hours.
          </p>
          <a
            href="#support"
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-wash hover:underline"
          >
            Ask the crew <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
