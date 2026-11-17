import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { productBySlug, type Product } from "@/data/catalog";
import { shipping, tax } from "@/lib/site";

const STORAGE_KEY = "pwo-cart-v2";
const MAX_QTY = 12;

export interface CartLine {
  slug: string;
  qty: number;
}

export interface CartLineDetailed extends CartLine {
  product: Product;
  lineTotal: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingRemaining: number;
  hasFreight: boolean;
}

interface CartApi {
  lines: CartLineDetailed[];
  totals: CartTotals;
  isOpen: boolean;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  qtyOf: (slug: string) => number;
}

const CartContext = createContext<CartApi | null>(null);

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is CartLine => {
        if (typeof l !== "object" || l === null) return false;
        const line = l as CartLine;
        return typeof line.slug === "string" && typeof line.qty === "number" && !!productBySlug(line.slug);
      })
      .map((l) => ({ slug: l.slug, qty: Math.max(1, Math.min(MAX_QTY, Math.round(l.qty))) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lineData, setLineData] = useState<CartLine[]>(readStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lineData));
    } catch {
      /* storage full or blocked — cart still works in memory */
    }
  }, [lineData]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const add = useCallback((slug: string, qty = 1) => {
    setLineData((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l,
        );
      }
      return [...prev, { slug, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setLineData((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLineData((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const clear = useCallback(() => setLineData([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const lines = useMemo<CartLineDetailed[]>(() => {
    return lineData.flatMap((line) => {
      const product = productBySlug(line.slug);
      if (!product) return [];
      return [{ ...line, product, lineTotal: product.price * line.qty }];
    });
  }, [lineData]);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
    const hasFreight = lines.some((l) => l.product.category === "machines");

    let ship = 0;
    if (subtotal > 0 && !hasFreight && subtotal < shipping.freeThreshold) {
      ship = shipping.flatRate;
    }
    // Chemicals are ground-only but still flat-rate; freight items are free.

    const taxCents = Math.round(subtotal * tax.rate);
    return {
      itemCount,
      subtotal,
      shipping: ship,
      tax: taxCents,
      total: subtotal + ship + taxCents,
      freeShippingRemaining: Math.max(0, shipping.freeThreshold - subtotal),
      hasFreight,
    };
  }, [lines]);

  const qtyOf = useCallback(
    (slug: string) => lineData.find((l) => l.slug === slug)?.qty ?? 0,
    [lineData],
  );

  const api = useMemo<CartApi>(
    () => ({ lines, totals, isOpen, add, remove, setQty, clear, openCart, closeCart, qtyOf }),
    [lines, totals, isOpen, add, remove, setQty, clear, openCart, closeCart, qtyOf],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
