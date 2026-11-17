import { RotateCcw, ShieldCheck, Truck, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui";

const items = [
  {
    icon: Truck,
    title: "Free shipping over $59",
    body: "Orders before 2pm ET leave the same day from our Savannah warehouse. Most land in 2–3 days.",
  },
  {
    icon: RotateCcw,
    title: "30 days, no restocking fee",
    body: "Tried it, it doesn't fit, you don't like it? Send it back. We pay return freight over $59.",
  },
  {
    icon: ShieldCheck,
    title: "2-year warranty",
    body: "Every brass fitting, deck and wand we sell is covered against manufacturing defects for two years.",
  },
  {
    icon: Wrench,
    title: "We answer the phone",
    body: "A human who owns a pressure washer, not a bot. Ask before you buy which tip to put where.",
  },
];

export default function Trust() {
  return (
    <section className="border-b border-ink/10 bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8 lg:py-12">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 70} className="px-0 py-4 sm:px-4">
            <div className="flex gap-3.5">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-spray">
                <it.icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <div>
                <h3 className="text-[14px] font-bold leading-tight">{it.title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">{it.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
