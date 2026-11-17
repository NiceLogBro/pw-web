import { useState } from "react";
import { ArrowRight, Check, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { Reveal } from "@/components/ui";

function FloatingField({
  id,
  label,
  value,
  onChange,
  type = "text",
  textarea,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder=" "
          className="peer w-full resize-none rounded-xl border border-white/15 bg-white/[0.04] px-3.5 pb-2.5 pt-7 text-[13.5px] text-paper outline-none transition-colors placeholder:text-transparent focus:border-spray/60"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          className="peer h-[54px] w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 pb-2 pt-7 text-[13.5px] text-paper outline-none transition-colors placeholder:text-transparent focus:border-spray/60"
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-4 text-[13px] text-paper/45 transition-[top,font-size,color] duration-150 peer-focus:top-1.5 peer-focus:text-[10.5px] peer-focus:font-semibold peer-focus:text-spray peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10.5px] peer-[:not(:placeholder-shown)]:font-semibold"
      >
        {label}
      </label>
    </div>
  );
}

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="support" className="relative overflow-hidden bg-ink py-16 text-paper sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(47,125,255,0.28),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,106,31,0.18),transparent_65%)]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
        <div>
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-spray">
              <span className="h-px w-6 bg-spray" aria-hidden />
              Support
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] sm:text-4xl lg:text-[2.9rem]">
              Not sure which tip goes where?
              <span className="block text-paper/40">Ask before you buy.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-paper/60">
              Tell us what machine you have and what you're trying to clean. We'll tell you what
              actually works — including when the answer is "you don't need anything."
            </p>
          </Reveal>

          <Reveal delay={90} className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Phone, label: "Call", value: "(912) 555-0148" },
              { icon: Mail, label: "Email", value: "help@bahamablast.co" },
              { icon: Clock, label: "Hours", value: "Mon–Fri, 8–6 ET" },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5"
              >
                <c.icon className="h-4 w-4 text-spray" />
                <p className="mt-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-paper/40">
                  {c.label}
                </p>
                <p className="mt-0.5 text-[12.5px] font-semibold">{c.value}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-6 flex items-start gap-2.5 text-[12px] text-paper/45">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              2124 Louisville Rd, Savannah, GA 31415 — warehouse pickup by appointment.
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="rounded-3xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur-sm sm:p-6">
            {sent ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-spray/15">
                  <Check className="h-7 w-7 text-spray" strokeWidth={3} />
                </div>
                <p className="mt-4 font-display text-xl font-extrabold">Message received</p>
                <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-paper/55">
                  A human — not a bot — will get back to you within one business day. Usually much
                  faster.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setMsg("");
                  }}
                  className="mt-5 text-[12.5px] font-semibold text-spray underline underline-offset-2"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                className="space-y-3.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-bold">Message the crew</p>
                  <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-spray/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-spray animate-pulse" /> Replies in ~2h
                  </span>
                </div>
                <FloatingField id="name" label="Your name" value={name} onChange={setName} />
                <FloatingField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <FloatingField
                  id="machine"
                  label="Machine + what you're cleaning"
                  value={msg}
                  onChange={setMsg}
                  textarea
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-safety py-3.5 text-[13.5px] font-bold text-white transition-colors hover:bg-safety-deep"
                >
                  <Send className="h-4 w-4" /> Send message
                </button>
                <p className="text-center text-[11px] text-paper/35">
                  Demo form — nothing is transmitted.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>

      {/* newsletter strip */}
      <div className="relative mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="font-display text-[17px] font-extrabold">One email a month. No coupon spam.</p>
              <p className="mt-1 text-[12.5px] text-paper/50">
                New accessories, honest guides, and the occasional clearance drop.
              </p>
            </div>
            <form
              className="flex w-full max-w-sm gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                (e.currentTarget.querySelector("input") as HTMLInputElement).value = "";
                (e.currentTarget.querySelector("button") as HTMLButtonElement).textContent = "Subscribed ✓";
              }}
            >
              <input
                required
                type="email"
                placeholder="you@email.com"
                className="h-11 flex-1 rounded-lg border border-white/15 bg-white/[0.06] px-3.5 text-[13px] text-paper outline-none placeholder:text-paper/35 focus:border-spray/60"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-paper px-4 text-[12.5px] font-bold text-ink transition-colors hover:bg-white"
              >
                Sign up <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
