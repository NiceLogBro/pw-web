import { Link } from "@/lib/router";
import { promises, site } from "@/lib/site";
import { Reveal, Stars } from "@/components/ui";
import { ArrowRight, Phone, Quote } from "lucide-react";
import { buttonClass } from "@/components/ui";

const reviews = [
  {
    quote:
      "Ordered the 20-inch surface cleaner Thursday, used it Saturday on a Mililani driveway. My concrete hasn't looked like that since we moved in.",
    name: "Marcus T.",
    where: "Mililani",
    product: "Orbit 20 Surface Cleaner",
  },
  {
    quote:
      "My washer died mid-job. They matched the pump from a photo of the sticker and it was here in two days. Cost me $109 instead of $400 for a new machine.",
    name: "Kalani R.",
    where: "Kailua",
    product: "Axial 3,000 Replacement Pump",
  },
  {
    quote:
      "First place I've found that stocks 4.0 tips in town. The soap injector actually draws — my old one from a mainland site never did.",
    name: "Dana K.",
    where: "Kapolei",
    product: "DownStream Soap Injector",
  },
];

export default function Promises() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Promise row */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p, i) => (
            <Reveal key={p.title} delay={i * 60} className="bg-paper">
              <div className="flex h-full flex-col justify-center p-5 sm:p-6">
                <p className="font-display text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                  {p.title}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate">{p.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-eyebrow text-spray-deep">From the island</p>
              <h2 className="mt-3 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]">
                Reviews from people with red dirt.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Stars rating={4.8} />
              <span className="text-[12px] text-slate">4.8 average · 2,100+ orders</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 80}>
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-bone p-5">
                  <Quote className="h-5 w-5 text-spray" />
                  <blockquote className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink/85">
                    “{r.quote}”
                  </blockquote>
                  <figcaption className="mt-4 border-t border-line pt-3.5">
                    <p className="text-[12.5px] font-semibold text-ink">
                      {r.name} <span className="font-normal text-slate">· {r.where}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate">Bought: {r.product}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Service cross-sell */}
        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-2xl bg-marine p-6 text-paper sm:p-9">
            <div className="pointer-events-none absolute inset-0 blueprint opacity-50" />
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-spray/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="label-eyebrow text-spray">Or skip the work</p>
                <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.02em] sm:text-3xl">
                  Our crew will wash it — you supply nothing.
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/65">
                  Same gear you can buy here, run by people who wash O’ahu driveways, lanais, roofs and
                  storefronts six days a week. Free quotes, water reclaimed where required.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
                <Link to="/service" className={buttonClass("spray", "lg")}>
                  Book a wash <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={site.phoneHref}
                  className={buttonClass("ghost", "lg", "border border-paper/25 text-paper hover:bg-paper/10")}
                >
                  <Phone className="h-4 w-4" /> {site.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
