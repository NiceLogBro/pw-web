import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Link, shopHref } from "@/lib/router";
import { categories } from "@/data/catalog";
import { site } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", to: "/shop" },
      { label: "Pressure washers", to: shopHref({ category: "machines" }) },
      { label: "Pumps & valves", to: shopHref({ category: "pumps" }) },
      { label: "Nozzles & tips", to: shopHref({ category: "nozzles" }) },
      { label: "Hoses, guns & wands", to: shopHref({ category: "hoses-wands" }) },
      { label: "Chemicals & sealers", to: shopHref({ category: "chemicals" }) },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Wash service on O'ahu", to: "/service" },
      { label: "Book a wash", to: "/service#book" },
      { label: "Equipment repair", to: "/fitment" },
      { label: "Find my part", to: "/fitment" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & delivery", to: "/support" },
      { label: "Returns & fit guarantee", to: "/support#returns" },
      { label: "Warranty", to: "/support#warranty" },
      { label: "About us", to: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 blueprint grid-fade opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo tone="paper" />
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-paper/60">
              Pressure washers, parts, and chemicals shipped from regional warehouses — plus a real
              wash crew working the island every day. We sell what we use on jobs.
            </p>

            <div className="mt-6 space-y-2.5 text-[13px] text-paper/70">
              <a href={site.phoneHref} className="flex items-center gap-2.5 transition hover:text-spray">
                <Phone className="h-4 w-4 text-spray" /> {site.phone}
              </a>
              <a href={site.emailHref} className="flex items-center gap-2.5 transition hover:text-spray">
                <Mail className="h-4 w-4 text-spray" /> {site.email}
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-spray" /> {site.address}
              </p>
            </div>

            <p className="mt-5 text-[12px] text-paper/45">{site.hours} · {site.pickup}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="label-eyebrow text-paper/40">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-[13px] text-paper/70 transition-colors hover:text-spray"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Category strip */}
        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-paper/10 pt-8">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/35">
            Shop by category
          </span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={shopHref({ category: c.slug })}
              className="rounded-full border border-paper/15 px-3 py-1.5 text-[11.5px] font-medium text-paper/65 transition hover:border-spray/60 hover:text-spray"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-paper/12 bg-paper/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-display text-[15px] font-semibold text-paper">
              Parts drops, restocks, and island-only pricing
            </p>
            <p className="mt-1 text-[12.5px] text-paper/55">
              One email a month. No “cart abandoned” nonsense.
            </p>
          </div>
          <form
            className="flex w-full max-w-sm items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              form.reset();
              const note = form.querySelector("[data-note]");
              note?.removeAttribute("hidden");
            }}
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="you@email.com"
              className="h-11 w-full rounded-full border border-paper/20 bg-ink/40 px-4 text-[13px] text-paper outline-none placeholder:text-paper/35 focus:border-spray"
            />
            <button
              type="submit"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-spray text-white transition hover:bg-spray-deep"
              aria-label="Subscribe"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <p data-note hidden className="text-[11px] text-spray">
              You&apos;re on the list.
            </p>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-paper/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-[11.5px] text-paper/40">
            © {new Date().getFullYear()} {site.name}
            {site.suffix}. Independent dropship storefront · prices in USD.
          </p>
          <div className="flex items-center gap-4 text-[11.5px] text-paper/45">
            <Link to="/support#privacy" className="transition hover:text-spray">
              Privacy
            </Link>
            <Link to="/support#terms" className="transition hover:text-spray">
              Terms
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-spray"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
