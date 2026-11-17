import { useEffect } from "react";
import { useRoute, useRouteScroll } from "@/lib/router";
import { CartProvider } from "@/store/cart";
import { ToastProvider } from "@/store/toast";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductPage from "@/pages/ProductPage";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
import Fitment from "@/pages/Fitment";
import Service from "@/pages/Service";
import Support from "@/pages/Support";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

const titles: Record<string, string> = {
  shop: "Shop pressure washers, parts & chemicals",
  product: "Product",
  checkout: "Checkout",
  success: "Order confirmed",
  fitment: "Find my part",
  service: "O'ahu wash service",
  support: "Shipping, returns & support",
  about: "About us",
};

export default function App() {
  const route = useRoute();
  const section = route.segments[0] ?? "";

  useRouteScroll(route);

  useEffect(() => {
    const base = "PowerWashingOahu.com";
    const sub = titles[section];
    document.title = sub ? `${sub} — ${base}` : `${base} — Pressure Washers, Parts & Chemicals for O'ahu`;
  }, [section]);

  let page;
  switch (section) {
    case "shop":
      page = <Shop />;
      break;
    case "product":
      page = <ProductPage />;
      break;
    case "checkout":
      page = <Checkout />;
      break;
    case "success":
      page = <Success />;
      break;
    case "fitment":
      page = <Fitment />;
      break;
    case "service":
      page = <Service />;
      break;
    case "support":
      page = <Support />;
      break;
    case "about":
      page = <About />;
      break;
    case "":
      page = <Home />;
      break;
    default:
      page = <NotFound />;
  }

  return (
    <ToastProvider>
      <CartProvider>
        <Layout>{page}</Layout>
      </CartProvider>
    </ToastProvider>
  );
}
