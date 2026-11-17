import { Link } from "@/lib/router";
import { buttonClass } from "@/components/ui";
import { Search, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-bone">
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <p className="font-display text-[5rem] font-semibold leading-none tracking-[-0.05em] text-ink/12">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
          That page washed away
        </h1>
        <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-slate">
          The link is broken or the product was retired. The catalog and the fitment finder are both
          one tap away.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Link to="/shop" className={buttonClass("primary", "md")}>
            <Search className="h-4 w-4" /> Browse products
          </Link>
          <Link to="/fitment" className={buttonClass("outline", "md")}>
            <Wrench className="h-4 w-4" /> Find my part
          </Link>
        </div>
      </div>
    </div>
  );
}
