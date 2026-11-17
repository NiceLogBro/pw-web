import type { ReactNode } from "react";
import { useRoute } from "@/lib/router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

export default function Layout({ children }: { children: ReactNode }) {
  const route = useRoute();
  const isCheckout = route.segments[0] === "checkout";

  return (
    <div className="flex min-h-screen flex-col">
      {!isCheckout && <Header />}
      <main key={route.path} className="flex-1">
        {children}
      </main>
      {!isCheckout && <Footer />}
      <CartDrawer />
    </div>
  );
}
