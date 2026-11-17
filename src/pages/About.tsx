import { Check, Droplets, Hammer, MapPin, Store, Truck, Users } from "lucide-react";
import { Link } from "@/lib/router";
import { site } from "@/lib/site";
import { buttonClass, Eyebrow, Reveal, SectionHead } from "@/components/ui";

const stats = [
  { value: "2,100+", label: "orders shipped" },
  { value: "2-day", label: "O’ahu delivery" },
  { value: "3", label: "US warehouses" },
  { value: "1.2%", label: "wrong-part rate" },
];

const pillars = [
  {
    icon: Droplets,
    title: "We wash first, sell second",
    body: "Every product on this store has run on a real O’ahu job — driveways in Kapolei, roofs in Kailua, storefronts in town. If it fails, it doesn’t get listed.",
  },
  {
    icon: Hammer,
    title: "Parts, not disposables",
    body: "Most washers die from a $20 unloader or a frozen pump. We stock the rebuild kits so a machine that “quit” gets a second life instead of a landfill.",
  },
  {
    icon: MapPin,
    title: "Island logistics, solved",
    body: "Mainland retailers treat Hawaii like a customs border. We hold inventory in mainland warehouses that ship 2-day to the islands and keep heavy freight free.",
  },
  {
    icon: Users,
    title: "A human on the phone",
    body: "Text a photo of your model plate and a real washer tech replies — usually in minutes during work hours.",
  },
];

export default function About() {
  return (
    <div className="bg-bone">
      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-display text-[2rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-[2.8rem]">
            A supply counter run by people who wash for a living.
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-slate">
            {site.name}
            {site.suffix} started as the equipment closet for a two-truck wash crew in Kapolei. We kept
            buying the same parts twice because mainland stores either didn’t ship to the islands or
            sent the wrong fitting. So we started stocking shelves.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-bone px-4 py-3.5">
                <p className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">{s.value}</p>
                <p className="mt-0.5 text-[11px] text-slate">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-line bg-paper p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-spray-soft text-spray-deep">
                  <p.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-[15px] font-semibold tracking-[-0.01em] text-ink">{p.title}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* How dropshipping works for customers */}
        <div className="mt-12">
          <SectionHead
            eyebrow="How it works"
            title="Ordered here, shipped from our US partners."
            desc="We hold the fast movers ourselves in Kapolei. Everything else ships direct from the same regional warehouses that supply mainland dealers — which is why a hose reaches O’ahu in two days instead of ten."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Store, t: "You order", d: "Checkout reserves stock in the nearest warehouse automatically." },
              { icon: Truck, t: "We route it", d: "Ground freight for machines and chemicals, air for small parts." },
              { icon: Check, t: "You install it", d: "Tracking in your inbox, and a tech on the phone if it doesn’t fit." },
            ].map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-line bg-paper p-5">
                <span className="absolute right-4 top-4 font-display text-[11px] font-bold tracking-widest text-slate/40">
                  0{i + 1}
                </span>
                <s.icon className="h-4 w-4 text-spray-deep" />
                <p className="mt-2.5 text-[13.5px] font-semibold text-ink">{s.t}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-ink p-6 text-paper sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="label-eyebrow text-spray">Service division</p>
              <p className="mt-2 max-w-md font-display text-xl font-semibold leading-tight tracking-[-0.02em]">
                Our crew still runs six days a week across O’ahu.
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-paper/60">
                Published pricing, water reclamation where required, and no upsells at the door.
              </p>
            </div>
            <Link to="/service" className={buttonClass("spray", "lg", "shrink-0")}>
              See service pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
