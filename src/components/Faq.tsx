import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Reveal, SectionHead } from "@/components/ui";
import { cn } from "@/utils/cn";

const faqs = [
  {
    q: "Will these fit my pressure washer?",
    a: "Almost certainly. Every accessory here uses the standard 1/4″ quick-connect, and the Brass Quick-Connect Kit converts M22-14 and 3/8″ machines to that standard. The Fit Guide above checks whether your PSI and GPM can actually drive a given attachment — that matters more than threading.",
  },
  {
    q: "Where do the products ship from?",
    a: "Savannah, Georgia. Orders placed before 2pm ET go out the same business day. Standard shipping is 2–3 business days to the East and 3–5 to the West; shipping is free over $59.",
  },
  {
    q: "Who actually makes these?",
    a: "Bahama Blast is the house brand: the accessories are built to our spec by the same factories that produce parts for established pressure-washer brands, then QC'd and shipped from our warehouse. That's why the brass is brass and the specs on the page match the box.",
  },
  {
    q: "What's the return policy?",
    a: "30 days from delivery, in any condition, for any reason. No restocking fee. We cover return freight on orders over $59; under that, you're out about $8. Refunds land back on your card within 3 business days of the return scanning in.",
  },
  {
    q: "Do I need a gas machine for the surface cleaners?",
    a: "No — the Rotary 15 is rated from 2,000 PSI, which most 13-amp electric machines reach. It's slower at lower pressure but still saves you hours of wanding. The Concrete Kit's turbo nozzle wants at least 1,500 PSI; below that it just spins.",
  },
  {
    q: "Is the foam cannon safe on car paint?",
    a: "Safe as long as the soap is diluted and the cannon is not pointed closer than about a foot. Foam pre-soak is one of the safer ways to clean a car because it lifts dirt before anything touches the finish. Keep the red 0° tip away from vehicles entirely.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHead
              eyebrow="Questions"
              title={
                <>
                  The things people{" "}
                  <span className="text-ink/35">actually ask us.</span>
                </>
              }
              desc="Straight answers, no hedging. If yours isn't here, message us — a person replies."
            />
            <a
              href="#support"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-[13px] font-bold transition-colors hover:border-ink/35 hover:bg-ink/5"
            >
              Ask a human
            </a>
          </div>

          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 40}>
                  <div>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "text-[14.5px] font-bold leading-snug transition-colors",
                          isOpen ? "text-ink" : "text-ink/80",
                        )}
                      >
                        {f.q}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors",
                          isOpen ? "bg-ink text-paper" : "bg-ink/5 text-ink/50",
                        )}
                      >
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <p className="overflow-hidden pr-10 text-[13px] leading-relaxed text-ink/60">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
