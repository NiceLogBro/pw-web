import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";

export type CartLine = { id: string; qty: number };

const STORAGE_KEY = "bahama-blast.cart.v1";
const FREE_SHIP_AT = 59;

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  freeShipping: boolean;
  amountToFreeShip: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** `openDrawer: false` = quick add from the grid, which shows a toast instead. */
  add: (id: string, qty?: number, opts?: { openDrawer?: boolean }) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  lastAdded: string | null;
};

const Ctx = createContext<CartCtx | null>(null);

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => products.some((p) => p.id === l.id) && l.qty > 0).slice(0, 40);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => read());
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode — cart just won't persist */
    }
  }, [lines]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const add = useCallback((id: string, qty = 1, opts?: { openDrawer?: boolean }) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      }
      return [...prev, { id, qty: Math.min(99, qty) }];
    });
    setLastAdded(id);
    if (opts?.openDrawer !== false) setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const subtotal = lines.reduce((sum, l) => {
      const p = products.find((x) => x.id === l.id);
      return sum + (p ? p.price * l.qty : 0);
    }, 0);

    const savings = lines.reduce((sum, l) => {
      const p = products.find((x) => x.id === l.id);
      if (!p?.compareAt) return sum;
      return sum + (p.compareAt - p.price) * l.qty;
    }, 0);

    const count = lines.reduce((sum, l) => sum + l.qty, 0);

    return {
      lines,
      count,
      subtotal,
      savings,
      freeShipping: subtotal >= FREE_SHIP_AT,
      amountToFreeShip: Math.max(0, FREE_SHIP_AT - subtotal),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      lastAdded,
    };
  }, [lines, open, add, setQty, remove, clear, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { FREE_SHIP_AT };
