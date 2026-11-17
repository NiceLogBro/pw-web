import { useState } from "react";
import { ChevronDown, Mail, MapPin, MessageSquare, Package, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/utils/cn";
import { site, shipping, tax } from "@/lib/site";
import { money } from "@/lib/format";
import { buttonClass, Eyebrow } from "@/components/ui";

const faqs = [
  {
    q: "How fast do orders reach O’ahu?",
    a: "Orders placed before 1pm HST ship the same business day. O’ahu addresses typically land in 2–3 business days; neighbor islands in 3–5. Free shipping kicks in at $99 — under that it’s a flat $9.95.",
  },
  {
    q: "Do you ship chemicals to Hawaii?",
    a: "Yes, but ground/ocean freight only, which adds about a day. Detergent bottles are double-bagged and boxed; if a bottle arrives leaking, send a photo and we replace it, no return needed.",
  },
  {
    q: "What if the part doesn’t fit?",
    a: "That’s the 30-day fit guarantee. Email us a photo of the fitting and the machine plate; we email a prepaid label and ship the correct part right away. No restocking fee, and you don’t need to wait for the return to arrive.",
  },
  {
    q: "Are these genuine OEM parts?",
    a: "Parts are genuine OEM or OEM-equivalent from the same factories that supply the brands. Every SKU page lists the manufacturer spec sheet. Nothing is a “universal” listing with a made-up rating.",
  },
  {
    q: "Do you install?",
    a: "In Kapolei and West O’ahu we install machines and pumps for $75. Outside that area, most jobs are a 20-minute wrench job — call us and we’ll walk you through it.",
  },
  {
    q: "Which payment methods work?",
    a: "Visa, Mastercard, Amex, Apple Pay and Google Pay through Stripe. Checks and purchase orders are available for HOA and commercial accounts over $500.",
  },
  {
    q: "Can I pick up locally?",
    a: `Yes — choose local pickup at checkout. Orders are usually ready in about four hours during business hours at our Kapolei location (${site.address}).`,
  },
];

const shippingRows = [
  ["Order subtotal", "Standard (2–3 days)", "Expedited (next day)"],
  ["Under $99", `${money(shipping.flatRate)}`, "$24.95"],
  ["$99 and up", "Free", "$24.95"],
  ["Machines & freight items", "Free ground freight", "Not available"],
  ["Local pickup (Kapolei)", "Free", "—"],
];

export default function Support() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-bone">
      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Eyebrow>Support</Eyebrow>
          <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.6rem]">
            Shipping, returns, and a human who answers.
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-slate">
            We ship from US warehouses, so island postage doesn’t add a week. If something’s wrong,
            we fix it before you finish your coffee.
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              { icon: Phone, label: "Call or text", value: site.phone, href: site.phoneHref },
              { icon: Mail, label: "Email", value: site.email, href: site.emailHref },
              { icon: MapPin, label: "Pickup", value: site.address, href: undefined },
            ].map((c) => {
              const Inner = (
                <>
                  <c.icon className="h-4 w-4 text-spray-deep" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate">{c.label}</p>
                    <p className="mt-0.5 text-[12px] font-semibold text-ink">{c.value}</p>
                  </div>
                </>
              );
              return c.href ? (
                <a key={c.label} href={c.href} className="flex items-center gap-3 rounded-xl border border-line bg-bone px-4 py-3 transition hover:border-ink/25">
                  {Inner}
                </a>
              ) : (
                <div key={c.label} className="flex items-center gap-3 rounded-xl border border-line bg-bone px-4 py-3">
                  {Inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Shipping table */}
        <section id="shipping">
          <h2 className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">Shipping rates</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-paper">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-line bg-bone/70 text-[10.5px] uppercase tracking-wider text-slate">
                  {shippingRows[0].map((h) => (
                    <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shippingRows.slice(1).map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} className={cn("px-4 py-2.5", i === 0 ? "font-medium text-ink" : "text-slate")}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {[
              { icon: Truck, t: "Free shipping", d: `On orders over ${money(shipping.freeThreshold)}` },
              { icon: Package, t: "Same-day dispatch", d: "Order before 1pm HST" },
              { icon: ShieldCheck, t: "Insured", d: "Every shipment, no extra cost" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
                <f.icon className="h-4 w-4 shrink-0 text-spray-deep" />
                <div>
                  <p className="text-[12px] font-semibold text-ink">{f.t}</p>
                  <p className="text-[10.5px] text-slate">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Returns */}
        <section id="returns" className="mt-14">
          <h2 className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">Returns & the fit guarantee</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-spray-soft text-spray-deep">
                <RotateCcw className="h-4 w-4" />
              </span>
              <p className="mt-3 font-display text-[14.5px] font-semibold text-ink">30-day fit guarantee</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate">
                If a part doesn’t fit, we send a prepaid return label and cross-ship the correct part.
                No restocking fee. Applies to every unopened, uninstalled part or machine.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-soft text-amber-900">
                <MessageSquare className="h-4 w-4" />
              </span>
              <p className="mt-3 font-display text-[14.5px] font-semibold text-ink">Damaged in transit</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate">
                Email a photo within 48 hours. We ship a replacement in the next truck and file the
                freight claim ourselves — you never deal with the carrier.
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-line bg-paper px-5 py-4">
            <p className="text-[12.5px] leading-relaxed text-slate">
              <strong className="text-ink">Not returnable:</strong> opened chemicals, cut-to-order hose,
              and any part that has been installed or run. {tax.label}: Hawaii orders include an
              estimated 4.712% general excise tax, calculated on the product total at checkout.
            </p>
          </div>
        </section>

        {/* Warranty */}
        <section id="warranty" className="mt-14">
          <h2 className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">Warranty</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-paper">
            {[
              ["Tidal electric machines", "3 years residential · 6 months commercial"],
              ["Breaker gas machines", "2 years commercial"],
              ["Pumps", "1 year against manufacturing defect"],
              ["Parts & accessories", "90 days"],
              ["Service labor", "14 days on workmanship"],
            ].map(([item, term], i) => (
              <div
                key={item}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[12.5px]",
                  i % 2 === 0 && "bg-bone/60",
                )}
              >
                <span className="font-medium text-ink">{item}</span>
                <span className="text-slate">{term}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate">
            Warranty service is handled by our US service partners, not shipped overseas. Call us first —
            most failures are a $20 part we can send next day.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-14">
          <h2 className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">Questions we actually get</h2>
          <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                >
                  <span className="text-[13px] font-semibold text-ink">{f.q}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate transition-transform", open === i && "rotate-180")} />
                </button>
                <div className={cn("grid transition-all duration-300", open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-[12.5px] leading-relaxed text-slate">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal anchors */}
        <section id="privacy" className="mt-14 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="font-display text-[13.5px] font-semibold text-ink">Privacy</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-slate">
              We store your order details to fulfill it and send tracking. We don’t sell contact data,
              and card details go directly to Stripe — never to this site.
            </p>
          </div>
          <div id="terms" className="rounded-2xl border border-line bg-paper p-5">
            <p className="font-display text-[13.5px] font-semibold text-ink">Terms</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-slate">
              Prices in USD and subject to change. Specifications come from manufacturers and are
              verified where possible. This storefront is a demonstration catalog — connect Stripe to
              take live orders.
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-5 text-paper sm:flex-row">
          <div>
            <p className="font-display text-[14.5px] font-semibold">Didn’t find your answer?</p>
            <p className="mt-0.5 text-[12px] text-paper/60">
              Text a photo of the part to {site.phone} — we usually reply in minutes.
            </p>
          </div>
          <a href={site.phoneHref} className={buttonClass("spray", "md", "shrink-0")}>
            <Phone className="h-4 w-4" /> Call now
          </a>
        </div>
      </div>
    </div>
  );
}
