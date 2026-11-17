import { ArrowRight, Check, Sparkles } from "lucide-react";
import { byId } from "@/data/products";
import { useCart } from "@/store/cart";
import { money, Reveal, SectionHead, Pill } from "@/components/ui";

const kits = [
  {
    id: "starter-kit",
    eyebrow: "For the machine you already own",
    includes: ["Rotary 15 surface cleaner", "Color Code 5-Pack tips", "Brass Quick-Connect Kit"],
    note: "The three things almost everyone orders in their first month — bundled.",
  },
  {
    id: "driveway-kit",
    eyebrow: "For a driveway that's given up",
    includes: ["Monsoon 20 pro deck", "Cyclone turbo nozzle", "Pump Guard concentrate"],
    note: "Everything for a full spring restore, including the chemistry that protects the pump.",
  },
];

export default function Kits() {
  const { add } = useCart();

  return (
    <section id="kits" className="relative overflow-hidden bg-[#efede6] py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(14,17,19,0.18)_1px,transparent_0)] [background-size:22px_22px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Bundles"
          title={
            <>
              Two kits. <span className="text-ink/35">Both cheaper than the sum.</span>
            </>
          }
          desc="We priced these so the bundle is genuinely the better deal — not a marked-up basket with a crossed-out number."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {kits.map((kit, idx) => {
            const p = byId(kit.id);
            const saving = (p.compareAt ?? p.price) - p.price;
            const heroProduct = byId(kit.id === "starter-kit" ? "rotary-15" : "monsoon-20");

            return (
              <Reveal key={kit.id} delay={idx * 90}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white sm:flex-row">
                  <div className="relative w-full shrink-0 overflow-hidden bg-[#f2f0ea] sm:w-[44%]">
                    <img
                      src={heroProduct.image}
                      alt=""
                      className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:h-full"
                    />
                    <div className="absolute left-3 top-3">
                      <Pill tone="sale">Save {money(saving)}</Pill>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-safety-deep">
                      <Sparkles className="h-3.5 w-3.5" /> {kit.eyebrow}
                    </p>
                    <h3 className="mt-1.5 font-display text-[22px] font-extrabold leading-tight">
                      {p.name}
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/55">{kit.note}</p>

                    <ul className="mt-3 space-y-1.5">
                      {kit.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[12.5px] text-ink/70">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lagoon" strokeWidth={3} />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="flex items-baseline gap-2">
                            <span className="text-[24px] font-extrabold tracking-tight tabular">
                              {money(p.price)}
                            </span>
                            {p.compareAt && (
                              <span className="text-[13px] text-ink/35 line-through tabular">
                                {money(p.compareAt)}
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 text-[11px] text-ink/45">{p.shipsIn}</p>
                        </div>
                        <button
                          onClick={() => add(p.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[12.5px] font-bold text-paper transition-colors hover:bg-safety"
                        >
                          Add kit <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <a
                        href={`#pdp-${p.id}`}
                        className="mt-3 inline-block text-[11.5px] font-semibold text-ink/45 underline-offset-2 hover:text-ink hover:underline"
                      >
                        What's inside →
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
