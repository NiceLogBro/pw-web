import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { money } from "@/components/ui";

/** Sticky mobile bar — the single highest-value UI element on a phone. */
export default function MobileCartBar() {
  const { count, subtotal, setOpen, open } = useCart();
  if (count === 0 || open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-full bg-ink py-3 pl-4 pr-2 text-paper"
      >
        <span className="flex items-center gap-2 text-[13px] font-bold">
          <ShoppingBag className="h-4 w-4" />
          {count} {count === 1 ? "item" : "items"}
        </span>
        <span className="flex items-center gap-2 rounded-full bg-safety px-4 py-2 text-[13px] font-bold text-white">
          View cart · {money(subtotal)}
        </span>
      </button>
    </div>
  );
}
