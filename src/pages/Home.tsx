import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedMachines from "@/components/home/FeaturedMachines";
import ProductShelf from "@/components/home/ProductShelf";
import FitmentSpotlight from "@/components/home/FitmentSpotlight";
import Promises from "@/components/home/Promises";

const marquee = [
  "Free shipping over $99",
  "2-day O’ahu delivery",
  "30-day fit guarantee",
  "Real parts help",
  "Local pickup in Kapolei",
  "Ground-only chemicals to Hawaii",
  "Contractor pricing available",
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Trust marquee */}
      <div className="border-y border-ink/10 bg-ink py-2.5">
        <div className="flex overflow-hidden">
          <div className="flex w-max animate-marquee items-center">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-8 whitespace-nowrap pr-8" aria-hidden={copy === 1}>
                {marquee.map((m) => (
                  <span
                    key={m}
                    className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/70"
                  >
                    {m}
                    <span className="h-1 w-1 rounded-full bg-spray" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategoryGrid />
      <FeaturedMachines />
      <ProductShelf />
      <FitmentSpotlight />
      <Promises />
    </>
  );
}
