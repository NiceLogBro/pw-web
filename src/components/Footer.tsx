import { Droplets, Mail, MapPin, Phone } from "lucide-react";
import { categories } from "@/data/products";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All accessories", href: "#catalog" },
      { label: "Surface cleaners", href: "#catalog" },
      { label: "Nozzles & tips", href: "#catalog" },
      { label: "Wands & reach", href: "#catalog" },
      { label: "Kits & bundles", href: "#kits" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Fit guide", href: "#fit" },
      { label: "The Lab — guides", href: "#lab" },
      { label: "Reviews", href: "#reviews" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact us", href: "#support" },
      { label: "Shipping", href: "#faq" },
      { label: "Returns & warranty", href: "#faq" },
      { label: "Order tracking", href: "#support" },
      { label: "Wholesale / crews", href: "#support" },
    ],
  },
];

const payments = ["Visa", "Mastercard", "Amex", "Discover", "Shop Pay", "PayPal"];

export default function Footer() {
  return (
    <footer className="bg-graphite text-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-white/10">
                <Droplets className="h-[19px] w-[19px] text-spray" strokeWidth={2.4} />
              </span>
              <span className="font-display text-[19px] font-extrabold leading-none tracking-tight">
                Bahama<span className="text-safety">Blast</span>
              </span>
            </a>
            <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-paper/50">
              Pressure-washer accessories built to be the last ones you buy. Spec'd honestly, shipped
              from Georgia, answered for by humans.
            </p>

            <ul className="mt-5 space-y-1.5 text-[12.5px] text-paper/55">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-paper/30" /> Savannah, GA
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-paper/30" /> (912) 555-0148
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-paper/30" /> help@bahamablast.co
              </li>
            </ul>

            <div className="mt-5 flex gap-2">
              {["IG", "YT", "TT"].map((s) => (
                <a
                  key={s}
                  href="#top"
                  aria-label={s}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/12 text-[10.5px] font-bold text-paper/60 transition-colors hover:border-paper/40 hover:text-paper"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-paper/35">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[12.5px] text-paper/60 transition-colors hover:text-paper"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-paper/35">
            © {new Date().getFullYear()} Bahama Blast Supply Co. A demo storefront — products,
            reviews and orders are illustrative.
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded border border-white/12 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-wide text-paper/45"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[10.5px] text-paper/30">
          <a href="#faq" className="hover:text-paper/60">Privacy</a>
          <a href="#faq" className="hover:text-paper/60">Terms</a>
          <a href="#faq" className="hover:text-paper/60">Accessibility</a>
          <a href="#faq" className="hover:text-paper/60">Do not sell my info</a>
          <span>
            Categories: {categories.map((c) => c.name.toLowerCase()).join(" · ")}
          </span>
        </div>
      </div>
    </footer>
  );
}
