import { BadgeCheck, Quote } from "lucide-react";
import { Reveal, SectionHead, Stars } from "@/components/ui";

const reviews = [
  {
    name: "Marcus T.",
    where: "Gulfport, MS",
    rating: 5,
    title: "Turned my driveway from gray to white",
    body: "I'd been wanding the same driveway for two years and it never looked clean. Fifteen minutes with the Rotary 15 and my neighbor asked who I hired. Should have bought this before the second extension cord.",
    product: "The Rotary 15",
    verified: true,
  },
  {
    name: "Dana R.",
    where: "Chandler, AZ",
    rating: 5,
    title: "The foam cannon is the reason I bought it",
    body: "Brass top, no leaks, and the needle valve actually holds a setting. I foam my truck, wait four minutes, and the bug guts wipe off with a mitt instead of scrubbing.",
    product: "Soapworks 1L Foam Cannon",
    verified: true,
  },
  {
    name: "Luis O.",
    where: "Tampa, FL",
    rating: 4,
    title: "Great deck, needed the QC kit",
    body: "The 20-inch deck is a beast on my paver patio. My machine had an M22 fitting so I needed the adapter set — wish that was clearer up front, but the support chat answered in about two minutes.",
    product: "Monsoon 20 Pro + Brass QC Kit",
    verified: true,
  },
  {
    name: "Priya S.",
    where: "Raleigh, NC",
    rating: 5,
    title: "Second story without a ladder",
    body: "I was quoted $600 to soft wash the back of my house. The telescoping wand paid for itself in one Saturday. Heavy fully extended, but the harness makes it manageable.",
    product: "Skyreach 18 Telescoping Wand",
    verified: true,
  },
  {
    name: "Kevin B.",
    where: "Savannah, GA",
    rating: 5,
    title: "The underbody thing actually works",
    body: "Live a mile from the beach and my truck's frame was caked. Ten minutes under it with the water broom and it's back to metal. Cheap insurance.",
    product: "Underbody 16 Cleaner",
    verified: true,
  },
  {
    name: "Alicia M.",
    where: "Portland, OR",
    rating: 5,
    title: "Shipped same day, arrived in two",
    body: "Ordered the weekend kit on a Tuesday afternoon, had it Thursday. Everything was in the box, brass looked solid, and the tips were labeled — not just colored.",
    product: "The Weekend Kit",
    verified: true,
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="border-y border-ink/10 bg-white/60 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Reviews"
          title={
            <>
              9,400+ orders. <span className="text-ink/35">4.8 average.</span>
            </>
          }
          desc="Every review below is tied to an actual order in our system. We don't filter the four-stars out."
          action={
            <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3">
              <span className="font-display text-[34px] font-extrabold leading-none">4.8</span>
              <div>
                <Stars rating={4.8} size="md" />
                <p className="mt-0.5 text-[11px] text-ink/45">2,914 verified reviews</p>
              </div>
            </div>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 60}>
              <figure className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-5">
                <div className="flex items-start justify-between">
                  <Stars rating={r.rating} />
                  <Quote className="h-5 w-5 text-ink/10" />
                </div>
                <blockquote className="mt-2.5">
                  <p className="text-[13.5px] font-bold leading-snug">{r.title}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/60">{r.body}</p>
                </blockquote>
                <figcaption className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 text-[11.5px]">
                  <span className="font-bold">{r.name}</span>
                  <span className="text-ink/35">· {r.where}</span>
                  {r.verified && (
                    <span className="flex items-center gap-0.5 rounded-full bg-lagoon/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-lagoon">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                  <span className="w-full text-[10.5px] uppercase tracking-[0.08em] text-ink/35">
                    {r.product}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
