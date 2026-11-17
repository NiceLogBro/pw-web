import { ArrowUpRight, Check, Wrench, X } from "lucide-react";
import { Link } from "@/lib/router";
import { buttonClass, Eyebrow, Reveal } from "@/components/ui";

const steps = [
  {
    n: "01",
    title: "Pick your machine",
    body: "Tidal electric, Breaker gas, or “something else” — the finder knows the fittings on all of them.",
  },
  {
    n: "02",
    title: "We check the fit",
    body: "Pressure rating, pump type, and quick-connect size are compared before you add to cart.",
  },
  {
    n: "03",
    title: "Ships with the right adapter",
    body: "If you're one fitting away, we tell you which $9 part finishes the job.",
  },
];

const good = ["Rated at or above your machine's PSI", "Same quick-connect family", "Axial cam or triplex matched to your pump"];
const bad = ["“Universal” listings with no rating", "Threads mistaken for quick-connects", "20-inch cleaners on 1.2 GPM machines"];

export default function FitmentSpotlight() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-paper sm:py-20">
      <div className="pointer-events-none absolute inset-0 blueprint grid-fade opacity-80" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-spray/15 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Eyebrow className="text-spray">The part that matters</Eyebrow>
            <h2 className="mt-4 font-display text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-4xl lg:text-[2.6rem]">
              Half of all returns are the wrong fitting.
              <span className="block text-paper/45">We built a checker for that.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/65">
              Pool hose and pressure hose look the same on a phone screen. So do M22-14 and M22-15.
              Tell us your machine and the store tells you the truth before you pay for a return label.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/fitment" className={buttonClass("spray", "lg")}>
                <Wrench className="h-4 w-4" /> Check my machine
              </Link>
              <Link
                to="/support"
                className={buttonClass("ghost", "lg", "text-paper/85 hover:bg-paper/10 hover:text-paper")}
              >
                How returns work <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-3">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="flex gap-4 rounded-xl border border-paper/10 bg-paper/[0.035] p-4"
                >
                  <span className="font-display text-[13px] font-semibold tracking-widest text-spray">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-paper">{s.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-paper/55">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison panel */}
          <Reveal className="lg:pt-14">
            <div className="overflow-hidden rounded-2xl border border-paper/12 bg-paper/[0.04]">
              <div className="flex items-center justify-between border-b border-paper/10 px-5 py-3.5">
                <p className="font-display text-[13px] font-semibold text-paper">Fit check · Tidal 2600 Pro</p>
                <span className="rounded-full bg-spray/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-spray">
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 divide-x divide-paper/10">
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-spray">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} /> Matches
                  </p>
                  <ul className="mt-3 space-y-3">
                    {good.map((g) => (
                      <li key={g} className="text-[12px] leading-snug text-paper/70">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-paper/40">
                    <X className="h-3.5 w-3.5" strokeWidth={3} /> Avoided
                  </p>
                  <ul className="mt-3 space-y-3">
                    {bad.map((b) => (
                      <li key={b} className="text-[12px] leading-snug text-paper/40 line-through decoration-paper/25">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-paper/10 bg-ink/30 px-5 py-4">
                <p className="text-[11.5px] leading-relaxed text-paper/60">
                  <span className="font-semibold text-spray">Result:</span> Steel-Flex 50 ft hose and the
                  Orbit 20 surface cleaner both connect directly. TurboCore tips are rated 400 PSI below
                  your machine — we’ll show the 4,500 PSI version instead.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-paper/10 bg-paper/[0.035] px-4 py-3.5">
              <div className="flex -space-x-2">
                {["TJ", "MW", "KR"].map((i) => (
                  <span
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-marine text-[9px] font-bold text-paper/80"
                  >
                    {i}
                  </span>
                ))}
              </div>
              <p className="text-[11.5px] leading-snug text-paper/60">
                <span className="font-semibold text-paper">1,940 fit checks</span> run this month ·
                wrong-part rate down to 1.2%
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
