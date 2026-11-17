import { ArrowUpRight, Clock } from "lucide-react";
import { Reveal, SectionHead } from "@/components/ui";

const guides = [
  {
    tag: "Fundamentals",
    minutes: 6,
    title: "The nozzle color code, without the guesswork",
    body: "Red is 0°, and it will scar composite decking. Here's the one-page rule for which tip goes on what — and why 25° is the safe default.",
    image: "/img/p-nozzle-tips.webp",
    href: "#pdp-nozzle-tips-5",
    featured: true,
  },
  {
    tag: "Surface prep",
    minutes: 9,
    title: "How to strip a driveway without zebra stripes",
    body: "Lap marks come from stopping. Overlap by a third, keep the deck moving, and never let a rotary cleaner sit still.",
    image: "/img/p-surface-cleaner-15.webp",
    href: "#pdp-rotary-15",
  },
  {
    tag: "Chemistry",
    minutes: 5,
    title: "Getting foam that actually dwells",
    body: "Most foam cannons are run too rich. Thin the mix, open the needle valve, and start at the bottom of the panel.",
    image: "/img/p-foam-cannon.webp",
    href: "#pdp-foam-cannon",
  },
  {
    tag: "Reach",
    minutes: 7,
    title: "Second-story siding from the lawn",
    body: "A telescoping wand is a lever. Lock it short, work overhead in passes, and let the harness carry the moment.",
    image: "/img/p-telescoping-wand.webp",
    href: "#pdp-telescoping-18",
  },
];

export default function Lab() {
  return (
    <section id="lab" className="bg-paper py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="The Lab"
          title={
            <>
              Short guides. <span className="text-ink/35">Written by people who wash things.</span>
            </>
          }
          desc="Ten minutes of reading saves a ruined deck, a stripped fitting, or a second trip to the store. Each guide links straight to the accessory it's about."
          action={
            <a
              href="#lab"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink underline-offset-4 hover:underline"
            >
              All guides <ArrowUpRight className="h-4 w-4" />
            </a>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {guides.map((g, i) => (
            <Reveal
              key={g.title}
              delay={i * 70}
              className={g.featured ? "md:col-span-2 lg:col-span-3" : "lg:col-span-3"}
            >
              <a
                href={g.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(14,17,19,0.4)]"
              >
                <div className="relative overflow-hidden bg-[#efede7]">
                  <img
                    src={g.image}
                    alt=""
                    loading="lazy"
                    className={
                      "w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] " +
                      (g.featured ? "h-52" : "h-44")
                    }
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink/70 backdrop-blur">
                    {g.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3
                    className={
                      "font-display font-extrabold leading-tight " +
                      (g.featured ? "text-[21px]" : "text-[15px]")
                    }
                  >
                    {g.title}
                  </h3>
                  <p
                    className={
                      "mt-1.5 leading-relaxed text-ink/55 " +
                      (g.featured ? "text-[13.5px]" : "text-[12.5px]")
                    }
                  >
                    {g.body}
                  </p>
                  <p className="mt-auto flex items-center gap-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/35">
                    <Clock className="h-3.5 w-3.5" /> {g.minutes} min read
                    <span className="ml-auto text-ink/30 transition-colors group-hover:text-safety">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
