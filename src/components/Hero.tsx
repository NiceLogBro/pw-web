import { ArrowRight, Check, Star, Truck } from "lucide-react";
import { useCart } from "@/store/cart";
import { byId } from "@/data/products";
import { CountUp, Reveal } from "@/components/ui";

const proof = [
  "Fits any standard 1/4″ quick-connect",
  "Rated to 4,000 PSI",
  "Ships free over $59",
];

export default function Hero() {
  const { add } = useCart();
  const hero = byId("rotary-15");

  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      {/* soft backdrop shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(47,125,255,0.10),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,106,31,0.08),transparent_65%)]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.02fr_1fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        {/* copy */}
        <div className="relative z-10 order-2 lg:order-1">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 py-1.5 pl-1.5 pr-3.5 text-[12px] font-medium shadow-sm">
              <span className="rounded-full bg-ink px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-spray">
                New
              </span>
              <span className="text-ink/70">
                <Star className="mb-0.5 mr-1 inline h-3.5 w-3.5 fill-safety text-safety" />
                4.8/5 from 9,400+ homes and crews
              </span>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 font-display text-[2.65rem] font-extrabold leading-[0.97] tracking-[-0.03em] text-ink sm:text-[3.4rem] lg:text-[4.1rem]">
              Your washer is fine.
              <br />
              <span className="relative inline-block">
                Its accessories
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[9px] w-full -rotate-[0.7deg] rounded-full bg-spray/70"
                />
              </span>{" "}
              are the problem.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink/65 sm:text-[17px]">
              The wand that came in the box will get you started — and then it won't. We stock the
              attachments that turn a $200 electric machine into something that actually finishes a
              driveway: rotary surface cleaners, foam cannons, brass fittings that don't strip.
            </p>
          </Reveal>

          <Reveal delay={230}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#catalog"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-safety px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_34px_-12px_rgba(255,106,31,0.9)] transition-all hover:bg-safety-deep active:scale-[0.99]"
              >
                Shop the accessories
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <button
                onClick={() => add(hero.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/60 px-6 py-4 text-[15px] font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-white"
              >
                Add the Rotary 15 — $79
              </button>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <ul className="mt-9 grid gap-x-5 gap-y-2.5 border-t border-ink/10 pt-6 sm:grid-cols-3">
              {proof.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12.5px] font-medium text-ink/60">
                  <Check className="mt-px h-4 w-4 shrink-0 text-wash" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* visual */}
        <Reveal delay={120} className="order-1 lg:order-2">
          <div className="relative">
            <div className="relative overflow-hidden rounded-[26px] bg-ink shadow-[0_30px_80px_-30px_rgba(14,17,19,0.55)]">
              <img
                src="/img/hero.webp"
                alt="A rotary surface cleaner cutting a clean stripe across a concrete driveway"
                className="h-[320px] w-full object-cover object-center sm:h-[420px] lg:h-[540px]"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />

              {/* photo credit chip */}
              <div className="absolute left-4 top-4 rounded-full bg-ink/55 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
                Rotary 15 in the wild
              </div>

              {/* spec strip on photo */}
              <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 sm:inset-x-5 sm:bottom-5">
                {[
                  ["15 in", "coverage"],
                  ["4× faster", "than a wand"],
                  ["0 stripes", "bye"],
                ].map(([big, small]) => (
                  <div
                    key={big}
                    className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md"
                  >
                    <p className="font-display text-[15px] font-bold leading-none text-white">{big}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-white/60">{small}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* floating product card — desktop only, it crowds the mobile layout */}
            <div className="absolute -bottom-16 -right-5 hidden w-[248px] rounded-2xl border border-ink/8 bg-white p-2.5 shadow-[0_20px_50px_-20px_rgba(14,17,19,0.4)] lg:block">
              <div className="flex gap-2.5">
                <img
                  src={hero.image}
                  alt=""
                  className="h-[68px] w-[68px] shrink-0 rounded-xl border border-ink/6 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-bold leading-tight">{hero.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-ink/50">{hero.tagline}</p>
                  <p className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[14px] font-extrabold tabular">$79</span>
                    <span className="text-[11px] text-ink/35 line-through tabular">$99</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => add(hero.id)}
                className="mt-2 w-full rounded-lg bg-ink py-2 text-[12px] font-bold text-paper transition-colors hover:bg-graphite"
              >
                Add to cart
              </button>
            </div>

            {/* free ship badge */}
            <div className="absolute -right-2 top-6 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11.5px] font-semibold shadow-lg sm:flex">
              <Truck className="h-4 w-4 text-wash" />
              <span>
                <CountUp to={9428} /> orders shipped
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* trust bar */}
      <div className="border-y border-ink/10 bg-white/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-4 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink/45 sm:justify-between sm:px-6 lg:px-8">
          <span>Free shipping over $59</span>
          <span className="text-ink/15" aria-hidden>•</span>
          <span>Same-day dispatch before 2pm ET</span>
          <span className="text-ink/15" aria-hidden>•</span>
          <span>30-day no-questions returns</span>
          <span className="text-ink/15" aria-hidden>•</span>
          <span>Real humans in Savannah, GA</span>
        </div>
      </div>
    </section>
  );
}
