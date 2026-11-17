import { Check, Minus, X } from "lucide-react";
import { SectionHead, Reveal } from "@/components/ui";

const rows = [
  {
    label: "Spec'd on the page",
    ours: "PSI, GPM, orifice and thread on every SKU",
    bigBox: "Often one number, sometimes wrong",
    marketplace: "Varies by seller — sometimes no data",
  },
  {
    label: "Brass, not plastic",
    ours: "Solid brass or nickel-plated fittings",
    bigBox: "Mixed; price-point plastic on value SKUs",
    marketplace: "Unstated until it cracks",
  },
  {
    label: "Fit help before you buy",
    ours: "Fit guide + a person who answers",
    bigBox: "In-store, if someone's free",
    marketplace: "A seller in another time zone",
  },
  {
    label: "Returns",
    ours: "30 days, no restocking fee",
    bigBox: "90 days with receipt",
    marketplace: "Seller-dependent, buyer pays freight",
  },
  {
    label: "Warranty claims",
    ours: "We ship the part",
    bigBox: "Manufacturer RMA, you pay shipping",
    marketplace: "Often no path at all",
  },
  {
    label: "Curated catalog",
    ours: "15 SKUs that work",
    bigBox: "Hundreds, including junk",
    marketplace: "Thousands, including counterfeits",
  },
];

const marks = {
  good: <Check className="h-4 w-4" strokeWidth={3} />,
  okay: <Minus className="h-4 w-4" strokeWidth={3} />,
  bad: <X className="h-4 w-4" strokeWidth={3} />,
};

const markFor = (i: number, col: "ours" | "bigBox" | "marketplace") => {
  // Honest, not uniform: we win on most rows, tie on a couple.
  if (col === "ours") return i === 3 ? marks.okay : marks.good;
  if (col === "bigBox") return i === 3 ? marks.good : i === 0 || i === 5 ? marks.okay : marks.bad;
  return i === 5 ? marks.bad : marks.okay;
};

export default function Compare() {
  return (
    <section id="why" className="bg-paper py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Why buy accessories here"
          title={
            <>
              The aisle at the hardware store is a{" "}
              <span className="text-ink/35">gamble with a receipt.</span>
            </>
          }
          desc="Pressure-washer accessories are the most returned category in outdoor power equipment. We stock fewer parts, spec them properly, and answer for them when they fail."
          align="center"
        />

        <Reveal className="mt-12 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink/10 bg-ink/[0.03]">
                  <th className="w-[22%] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">
                    &nbsp;
                  </th>
                  <th className="w-[28%] px-5 py-4">
                    <span className="flex items-center gap-2 font-display text-[14px] font-extrabold">
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-ink">
                        <span className="text-[11px] text-spray">B</span>
                      </span>
                      Bahama Blast
                    </span>
                  </th>
                  <th className="px-5 py-4 text-[13px] font-semibold text-ink/55">Big-box store</th>
                  <th className="px-5 py-4 text-[13px] font-semibold text-ink/55">
                    Marketplace seller
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.label} className="border-b border-ink/[0.06] last:border-0">
                    <th
                      scope="row"
                      className="px-5 py-4 align-top text-[12.5px] font-bold text-ink/70"
                    >
                      {r.label}
                    </th>
                    <td className="bg-safety/[0.035] px-5 py-4 align-top">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 rounded-full bg-lagoon/12 p-1 text-lagoon">
                          {markFor(i, "ours")}
                        </span>
                        <span className="text-[12.5px] font-medium leading-snug text-ink/80">
                          {r.ours}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 rounded-full bg-ink/5 p-1 text-ink/35">
                          {markFor(i, "bigBox")}
                        </span>
                        <span className="text-[12.5px] leading-snug text-ink/50">{r.bigBox}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 rounded-full bg-ink/5 p-1 text-ink/35">
                          {markFor(i, "marketplace")}
                        </span>
                        <span className="text-[12.5px] leading-snug text-ink/50">{r.marketplace}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px] text-ink/40">
          <span className="flex items-center gap-1.5">
            <span className="rounded-full bg-lagoon/12 p-1 text-lagoon">{marks.good}</span> Better
          </span>
          <span className="flex items-center gap-1.5">
            <span className="rounded-full bg-ink/5 p-1 text-ink/35">{marks.okay}</span> Comparable
          </span>
          <span className="flex items-center gap-1.5">
            <span className="rounded-full bg-ink/5 p-1 text-ink/35">{marks.bad}</span> Worse
          </span>
          <span className="text-ink/30">
            · Big-box return terms vary by store; check yours before relying on 90 days.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
