import { ArrowRight, BadgeCheck, MapPin, Package, ShieldCheck, Wrench } from "lucide-react";
import { Link } from "@/lib/router";
import { buttonClass } from "@/components/ui";
import { money } from "@/lib/format";
import { shipping } from "@/lib/site";

const chips = [
  { label: "1,800 PSI", top: "52%", left: "4%" },
  { label: "Bucket-feed ready", bottom: "12%", right: "4%" },
];

const specs = [
  { icon: Package, value: "2-day", label: "O’ahu delivery" },
  { icon: ShieldCheck, value: "30-day", label: "Fit guarantee" },
  { icon: Wrench, value: "7 days", label: "Parts help" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bone pb-14 pt-10 sm:pb-20 sm:pt-14">
      {/* faint technical grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,26,34,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,26,34,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 60% 30%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 60% 30%, black 10%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-8">
        {/* Copy */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-paper px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
              <MapPin className="h-3.5 w-3.5 text-spray-deep" />
              Kapolei · O’ahu
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-spray-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-spray-deep">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-spray" />
              Ships same day
            </span>
          </div>

          <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.15rem]">
            Wash like the pros.
            <br />
            Parts that{" "}
            <span className="relative inline-block">
              <span className="relative z-10">actually fit.</span>
              <svg
                className="absolute -bottom-1 left-0 z-0 w-full text-spray"
                viewBox="0 0 240 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 8.5C40 3.5 82 2.5 122 4.5c36 1.8 74 3.4 116 1"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-slate sm:text-[17px]">
            Pressure washers, pumps, nozzles and chemicals — the same gear our crew runs on island
            jobs. Sourced from US warehouses, delivered to your driveway in two days.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/shop" className={buttonClass("primary", "lg")}>
              Shop the catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/fitment" className={buttonClass("outline", "lg")}>
              <Wrench className="h-4 w-4" /> Find my part
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] font-medium text-slate">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-spray-deep" /> Free shipping over {money(shipping.freeThreshold)}
            </span>
            <span className="hidden h-3 w-px bg-ink/15 sm:block" />
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-spray-deep" /> No restocking fees
            </span>
            <span className="hidden h-3 w-px bg-ink/15 sm:block" />
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-spray-deep" /> Local pickup in Kapolei
            </span>
          </div>
        </div>

        {/* Product board */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[26px] border border-line bg-paper shadow-[0_36px_80px_-48px_rgba(11,26,34,0.55)]">
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3.5">
              <span className="rounded-full bg-ink px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-paper">
                Bestseller
              </span>
              <span className="rounded-full bg-paper/90 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink ring-1 ring-ink/10 backdrop-blur">
                #1 for driveways
              </span>
            </div>

            <div className="relative aspect-[4/3.35] bg-[#eef1f4]">
              <img
                src="/products/electric-washer.jpg"
                alt="Tidal 1800 electric pressure washer"
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
              {chips.map((c) => (
                <span
                  key={c.label}
                  className="absolute hidden rounded-full bg-ink/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.02em] text-paper backdrop-blur-sm sm:inline-flex"
                  style={{ top: c.top, left: c.left, right: c.right, bottom: c.bottom }}
                >
                  {c.label}
                </span>
              ))}
            </div>

            <div className="flex items-end justify-between gap-4 border-t border-line px-5 py-4">
              <div>
                <p className="label-eyebrow text-[9.5px] text-slate">Tidal Works</p>
                <p className="mt-1 font-display text-[17px] font-semibold tracking-[-0.02em] text-ink">
                  Tidal 1800 Electric
                </p>
                <p className="mt-0.5 text-[11.5px] text-slate">1,800 PSI · 1.2 GPM · bucket-feed ready</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate line-through">{money(27900)}</p>
                <p className="font-display text-xl font-semibold text-ink">{money(22900)}</p>
              </div>
            </div>
          </div>

          {/* Spec cards */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            {specs.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-line bg-paper px-3 py-3.5 text-center"
              >
                <s.icon className="mx-auto h-4 w-4 text-spray-deep" />
                <p className="mt-1.5 font-display text-[15px] font-semibold leading-none text-ink">{s.value}</p>
                <p className="mt-1 text-[10.5px] leading-tight text-slate">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
