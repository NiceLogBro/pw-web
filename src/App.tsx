import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Trust from "@/components/Trust";
import StartHere from "@/components/StartHere";
import Catalog from "@/components/Catalog";
import FitGuide from "@/components/FitGuide";
import Compare from "@/components/Compare";
import Kits from "@/components/Kits";
import Lab from "@/components/Lab";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Support from "@/components/Support";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import CartDrawer, { AddedToast } from "@/components/CartDrawer";
import MobileCartBar from "@/components/MobileCartBar";
import { CartProvider } from "@/store/cart";

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-paper text-ink">
        <Header />
        <main>
          <Hero />
          <Trust />
          <StartHere />
          <Catalog />
          <FitGuide />
          <Compare />
          <Kits />
          <Lab />
          <Reviews />
          <Faq />
          <Support />
        </main>
        <Footer />
        <MobileCartBar />
        <CartDrawer />
        <ProductModal />
        <AddedToast />
      </div>
    </CartProvider>
  );
}
