import { useState } from "react";
import {
  CalendarCheck,
  Check,
  Clock,
  Droplets,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { site } from "@/lib/site";
import { buttonClass, Eyebrow, Reveal, SectionHead } from "@/components/ui";

const services = [
  {
    title: "Driveways & walkways",
    price: "from $189",
    unit: "single-car driveway",
    body: "Rotary surface cleaner, pre-treatment, oil and rust lifting, post-rinse. Typically 1.5–2 hours.",
    includes: ["Surface cleaner (no stripes)", "Oil / rust pre-treat", "Edge and gate detail"],
  },
  {
    title: "Lanais & patios",
    price: "from $149",
    unit: "up to 250 sq ft",
    body: "Tile, travertine, and concrete lanais. Low-pressure rinse on screens and railings.",
    includes: ["Low-pressure screens", "Mildew treatment", "Furniture moved + reset"],
  },
  {
    title: "House siding & eaves",
    price: "from $329",
    unit: "single-story home",
    body: "Soft wash on stucco, vinyl, and board-and-batten. Eaves and fascia detailed by hand.",
    includes: ["Soft wash (no damage)", "Plant pre-wet + rinse", "Eave hand detail"],
  },
  {
    title: "Roof soft wash",
    price: "from $549",
    unit: "typical island roof",
    body: "Dead algae and lichen treated without pressure. Safe for asphalt shingles and tile.",
    includes: ["No-pressure treatment", "Gutter flush", "6-month re-growth warranty"],
  },
  {
    title: "Commercial & HOA",
    price: "custom quote",
    unit: "per property",
    body: "Storefronts, parking structures, dumpster pads, and full-association walkways.",
    includes: ["Night scheduling", "Water reclaim available", "Certificate of insurance"],
  },
];

const steps = [
  { icon: Phone, title: "Tell us the address", body: "Text a photo and a few details. We quote within an hour during work hours." },
  { icon: CalendarCheck, title: "Pick a window", body: "Most jobs book 2–4 days out. Same-week rush slots are usually available." },
  { icon: Droplets, title: "We wash, you inspect", body: "We walk the property with you before we load up. Anything missed, we redo." },
];

const testimonials = [
  {
    quote: "Our Mililani driveway had rust stains from the irrigation for three years. Twenty minutes into the job I could see the original color.",
    name: "Marcus T.",
    where: "Mililani",
    stars: 5,
  },
  {
    quote: "They soft-washed the roof while we were at work, texted photos when finished, and cleaned up every bit of debris. No upsell.",
    name: "Leilani P.",
    where: "Kailua",
    stars: 5,
  },
  {
    quote: "We use them for two storefronts in Kapolei. Every month, same crew, never a reschedule.",
    name: "Dana K.",
    where: "Kapolei",
    stars: 5,
  },
];

export default function Service() {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState(services[0].title);

  return (
    <div className="bg-bone">
      {/* Hero */}
      <div className="relative overflow-hidden bg-marine text-paper">
        <div className="pointer-events-none absolute inset-0 blueprint grid-fade opacity-70" />
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-spray/20 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div>
              <Eyebrow className="text-spray">Full-service division</Eyebrow>
              <h1 className="mt-4 font-display text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-[3.4rem]">
                Or let our crew
                <br />
                do the washing.
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-paper/70">
                Same machines and chemicals we sell, run by a crew that has washed thousands of O’ahu
                driveways, lanais, roofs and storefronts. Insured, water-reclaim ready, and on time.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className={buttonClass("spray", "lg")}
                >
                  Get a free quote <CalendarCheck className="h-4 w-4" />
                </button>
                <a href={site.phoneHref} className={buttonClass("ghost", "lg", "border border-paper/25 text-paper hover:bg-paper/10")}>
                  <Phone className="h-4 w-4" /> {site.phone}
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-paper/65">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-spray" /> Licensed &amp; insured
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-spray" /> Island-wide
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-spray" /> {site.hours}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber" /> 4.9 · 380+ jobs
                </span>
              </div>
            </div>

            {/* Kit card */}
            <div className="rounded-2xl border border-paper/15 bg-paper/[0.05] p-5 backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-spray">What shows up</p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "4,200 PSI belt-drive washer",
                  "20 in rotary surface cleaner",
                  "Water reclamation when required",
                  "Our own chemicals — no “upcharge” bottles",
                  "Two truck team on every job",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] text-paper/80">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-spray" strokeWidth={3} />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-ink/30 px-3 py-2.5">
                <Truck className="h-4 w-4 shrink-0 text-spray" />
                <p className="text-[11px] leading-snug text-paper/70">
                  Buy any washer here and get <strong className="text-paper">10% off</strong> your first wash.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <SectionHead
          eyebrow="Services & pricing"
          title="Published pricing. No “call for a quote” games."
          desc="Starting prices for typical O’ahu properties. Final price depends on square footage, soil level and access — confirmed before we start."
        />

        <div className="mt-9 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {services.map((s) => (
            <div key={s.title} className="grid gap-4 p-5 sm:grid-cols-[1fr_1.3fr_auto] sm:items-center sm:gap-6 sm:p-6">
              <div>
                <p className="font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">{s.title}</p>
                <p className="mt-1 text-[11.5px] text-slate">{s.unit}</p>
              </div>
              <div>
                <p className="text-[13px] leading-relaxed text-slate">{s.body}</p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {s.includes.map((i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-ink/70">
                      <Check className="h-3 w-3 text-spray-deep" strokeWidth={3} /> {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className="font-display text-[17px] font-semibold text-ink">{s.price}</span>
                <button
                  type="button"
                  onClick={() => {
                    setService(s.title);
                    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink transition hover:bg-ink hover:text-paper"
                >
                  Book this
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Process */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-paper p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-spray-soft text-spray-deep">
                  <s.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-[14px] font-semibold text-ink">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Booking form */}
        <div id="book" className="mt-14 grid gap-6 rounded-3xl border border-line bg-paper p-5 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <div>
            <Eyebrow>Book a wash</Eyebrow>
            <h2 className="mt-3 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]">
              Get a quote in one business hour.
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-slate">
              Tell us the address and roughly what needs washing. We’ll confirm a price and a window by
              text — no sales visit needed for most residential jobs.
            </p>

            <div className="mt-6 space-y-2.5">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-xl bg-bone px-4 py-3">
                  <div className="flex gap-0.5 text-amber">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink/80">“{t.quote}”</p>
                  <p className="mt-1.5 text-[11px] font-semibold text-slate">
                    {t.name} · {t.where}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-2xl border border-line bg-bone p-5"
          >
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-6 w-6" strokeWidth={3.5} />
                </span>
                <p className="mt-4 font-display text-lg font-semibold text-ink">Request received</p>
                <p className="mt-1.5 max-w-xs text-[12.5px] leading-relaxed text-slate">
                  This is a demo form — on a live site it would text the crew and email you a quote.
                  Call {site.phone} to book for real.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-[12px] font-semibold text-spray-deep hover:underline"
                >
                  Submit another
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="svc-service" className="mb-1.5 block text-[11.5px] font-semibold text-ink">Service</label>
                  <select
                    id="svc-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="brand-select h-11 w-full rounded-xl border border-ink/15 bg-paper pl-3.5 text-[13px] text-ink outline-none focus:border-spray"
                  >
                    {services.map((s) => (
                      <option key={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField id="svc-name" label="Name" placeholder="Kalani Rivera" required />
                  <FormField id="svc-phone" label="Phone" placeholder="(808) 555-0142" type="tel" required />
                </div>
                <FormField id="svc-email" label="Email" placeholder="you@email.com" type="email" required />
                <FormField id="svc-address" label="Property address" placeholder="91-1200 Fort Barrette Rd, Kapolei" required />
                <div>
                  <label htmlFor="svc-notes" className="mb-1.5 block text-[11.5px] font-semibold text-ink">
                    What needs washing?
                  </label>
                  <textarea
                    id="svc-notes"
                    rows={3}
                    placeholder="Two-car driveway with oil stains, plus the back lanai."
                    className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-[13px] text-ink outline-none transition placeholder:text-slate/60 focus:border-spray"
                  />
                </div>
                <button type="submit" className={cn(buttonClass("primary", "lg"), "w-full")}>
                  Request a quote
                </button>
                <p className="text-center text-[10.5px] text-slate">
                  Demo form · we’ll never share your details.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  placeholder,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11.5px] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-ink/15 bg-paper px-3.5 text-[13px] text-ink outline-none transition placeholder:text-slate/60 focus:border-spray"
      />
    </div>
  );
}
