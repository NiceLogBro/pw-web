import { Check, Truck } from "lucide-react";
import { Link } from "@/lib/router";
import { products } from "@/data/catalog";
import { money } from "@/lib/format";
import { buttonClass, Price, Reveal, SectionHead, Stars, TextLink } from "@/components/ui";

const machines = products.filter((p) => p.category === "machines");

const benefits = ["Ships free by freight", "Warranty handled in the US", "Our crew runs the same units"];

export default function FeaturedMachines() {
  return (
    <section className="relative bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Machines"
          title="Buy the pressure, not the plastic."
          desc="Three machines we actually put on job sites: one for condo lanais, one for family driveways, one for crews billing by the hour."
          action={
            <Link to="/shop?category=machines">
              <TextLink>All washers</TextLink>
            </Link>
          }
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {machines.slice(0, 3).map((m, i) => (
            <Reveal key={m.slug} delay={i * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bone transition-all duration-300 hover:border-ink/25 hover:shadow-[0_30px_60px_-40px_rgba(11,26,34,0.45)]">
                <Link to={`/product/${m.slug}`} className="relative block overflow-hidden bg-[#eef1f4]">
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-paper/95 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink ring-1 ring-ink/10">
                    {m.tags.includes("gas") ? "Gas · Contractor" : "Electric"}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="label-eyebrow text-[9.5px] text-slate">{m.brand}</p>
                      <h3 className="mt-1.5 font-display text-[19px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                        <Link to={`/product/${m.slug}`} className="transition hover:text-spray-deep">
                          {m.shortName}
                        </Link>
                      </h3>
                    </div>
                    <Stars rating={m.rating} className="mt-1 shrink-0" />
                  </div>

                  <p className="mt-2.5 text-[13px] leading-relaxed text-slate">{m.blurb}</p>

                  <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line pt-3.5 text-[11.5px]">
                    {m.specs.slice(0, 4).map((s) => (
                      <div key={s.label}>
                        <dt className="text-slate/80">{s.label}</dt>
                        <dd className="font-semibold text-ink">{s.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto pt-5">
                    <Price product={m} size="lg" />
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-slate">
                      <Truck className="h-3.5 w-3.5" /> {m.shipsIn}
                    </p>
                    <Link
                      to={`/product/${m.slug}`}
                      className={buttonClass("primary", "md", "mt-3.5 w-full")}
                    >
                      View machine
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-medium text-slate">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-spray-deep" strokeWidth={3} /> {b}
            </li>
          ))}
          <li className="text-slate/80">Financing from {money(22900 / 6)}/mo on approved credit</li>
        </ul>
      </div>
    </section>
  );
}
