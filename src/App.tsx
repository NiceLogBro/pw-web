import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Rankings from "@/components/Rankings";
import Leaderboard from "@/components/Leaderboard";
import Scorecard from "@/components/Scorecard";
import HeadToHead from "@/components/HeadToHead";
import WhyToolGuys from "@/components/WhyToolGuys";
import ProjectResults from "@/components/ProjectResults";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import PropertyFinder from "@/components/PropertyFinder";
import Neighborhoods from "@/components/Neighborhoods";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import StructuredData from "@/components/StructuredData";

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-abyss text-foam">
        {/* Keyboard users land here first; the fixed header is 7 sections deep otherwise. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-spray focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-abyss"
        >
          Skip to content
        </a>
        <StructuredData />
        <Nav />
        <main id="main">
          <Hero />
          <Leaderboard />
          <Rankings />
          <Scorecard />
          <HeadToHead />
          <WhyToolGuys />
          <ProjectResults />
          <PropertyFinder />
          <Services />
          <Testimonials />
          <Neighborhoods />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
