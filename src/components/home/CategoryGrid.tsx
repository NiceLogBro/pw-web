import { ArrowUpRight, Droplets } from "lucide-react";
import { cn } from "@/utils/cn";
import { Link, shopHref } from "@/lib/router";
import { categories, products } from "@/data/catalog";
import { Reveal, SectionHead, TextLink } from "@/components/ui";

const spans: Record<string, string> = {
  machines: "col-span-2 lg:col-span-6",
  pumps: "col-span-1 lg:col-span-3",
  nozzles: "col-span-1 lg:col-span-3",
  "hoses-wands": "col-span-1 lg:col-span-3",
  surface: "col-span-1 lg:col-span-3",
  chemicals: "col-span-1 lg:col-span-3",
  accessories: "col-span-1 lg:col-span-3",
};

export default function CategoryGrid() {
  return (
    <section className="relative bg-bone py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Shop by category"
          title={
            <>
              Everything between the spigot
              <br className="hidden sm:block" /> and the concrete.
            </>
          }
          desc="Machines, the parts that keep them running, and the chemistry that makes a driveway look new."
          action={
            <Link to="/shop">
              <TextLink>Browse all {products.length} products</TextLink>
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 70} className={cn(spans[c.slug])}>
              <Link
                to={shopHref({ category: c.slug })}
                className="group relative flex h-full min-h-[168px] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-ink lg:min-h-[196px]"
              >
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/35 to-ink/5" />
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/15 text-paper opacity-0 backdrop-blur transition-all duration-300 group-hover:bg-paper group-hover:text-ink group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div className="relative p-4 sm:p-5">
                  <p className="font-display text-[15px] font-semibold tracking-[-0.01em] text-paper sm:text-[17px]">
                    {c.name}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-paper/60 sm:text-[12px]">{c.blurb}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-ink/20 bg-paper/60 px-5 py-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2.5 text-[13px] text-ink">
            <Droplets className="h-4 w-4 shrink-0 text-spray-deep" />
            <span>
              <strong className="font-semibold">Don’t see your pump?</strong>{" "}
              <span className="text-slate">Send us the model plate and we’ll source the direct fit.</span>
            </span>
          </p>
          <Link
            to="/fitment"
            className="shrink-0 text-[12.5px] font-semibold text-spray-deep transition hover:text-ink"
          >
            Open the fitment finder →
          </Link>
        </div>
      </div>
    </section>
  );
}
