import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ArrowRight, Minus, Plus, Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { money, percentOff } from "@/lib/format";
import type { Product } from "@/data/catalog";

/* ── Scroll reveal ───────────────────────────────────────────────────── */

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", inView && "reveal-in", className)}
    >
      {children}
    </div>
  );
}

/* ── Type helpers ────────────────────────────────────────────────────── */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 label-eyebrow text-spray-deep", className)}>
      <span className="inline-block h-px w-6 bg-current opacity-60" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  align = "left",
  action,
  tone = "light",
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
      )}
    >
      <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <Eyebrow className={cn(align === "center" && "justify-center", tone === "dark" && "text-spray")}>
            {eyebrow}
          </Eyebrow>
        )}
        <h2
          className={cn(
            "mt-4 font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-4xl lg:text-[2.6rem]",
            tone === "dark" ? "text-paper" : "text-ink",
          )}
        >
          {title}
        </h2>
        {desc && (
          <p className={cn("mt-4 text-[15px] leading-relaxed sm:text-base", tone === "dark" ? "text-paper/65" : "text-slate")}>
            {desc}
          </p>
        )}
      </Reveal>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Buttons ─────────────────────────────────────────────────────────── */

type Variant = "primary" | "spray" | "outline" | "ghost" | "paper";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-marine shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_8px_24px_-12px_rgba(11,26,34,0.6)]",
  spray: "bg-spray text-white hover:bg-spray-deep shadow-[0_8px_24px_-12px_rgba(10,159,187,0.8)]",
  outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-ink/5",
  paper: "bg-paper text-ink hover:bg-white border border-line",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button type="button" className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function TextLink({
  children,
  className,
  withArrow = true,
}: {
  children: ReactNode;
  className?: string;
  withArrow?: boolean;
}) {
  return (
    <span
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-spray-deep",
        className,
      )}
    >
      {children}
      {withArrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </span>
  );
}

/* ── Product bits ────────────────────────────────────────────────────── */

export function Stars({ rating, count, className }: { rating: number; count?: number; className?: string }) {
  const star = (i: number) => (
    <Star
      key={i}
      className="h-3.5 w-3.5 shrink-0"
      fill={rating >= i + 0.5 ? "currentColor" : "none"}
      strokeWidth={1.75}
    />
  );
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-amber", className)}
      aria-label={`${rating} out of 5 stars${count ? `, ${count} reviews` : ""}`}
    >
      <span className="flex gap-0.5">{[0, 1, 2, 3, 4].map(star)}</span>
      <span className="text-xs font-semibold text-slate">
        {rating.toFixed(1)}
        {count !== undefined && <span className="font-normal"> ({count.toLocaleString()})</span>}
      </span>
    </span>
  );
}

export function Price({
  product,
  size = "md",
  className,
}: {
  product: Pick<Product, "price" | "compareAt">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const off = percentOff(product.price, product.compareAt);
  return (
    <span className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-display font-semibold tracking-[-0.02em] text-ink",
          size === "sm" && "text-base",
          size === "md" && "text-lg",
          size === "lg" && "text-3xl",
        )}
      >
        {money(product.price)}
      </span>
      {product.compareAt && (
        <s className={cn("text-slate/70", size === "lg" ? "text-base" : "text-xs")}>
          {money(product.compareAt)}
        </s>
      )}
      {off && (
        <span
          className={cn(
            "rounded-full bg-amber-soft px-2 py-0.5 font-bold uppercase tracking-wider text-rust",
            size === "lg" ? "text-[11px]" : "text-[10px]",
          )}
        >
          Save {off}%
        </span>
      )}
    </span>
  );
}

export function StockPill({ stock, className }: { stock: Product["stock"]; className?: string }) {
  const map = {
    "in-stock": { label: "In stock", dot: "bg-emerald-600", text: "text-emerald-800", bg: "bg-emerald-50" },
    "low-stock": { label: "Low stock", dot: "bg-amber-500", text: "text-amber-900", bg: "bg-amber-soft" },
    backorder: { label: "Backorder", dot: "bg-rust", text: "text-rust", bg: "bg-rust/10" },
  } as const;
  const s = map[stock];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        s.bg,
        s.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function Badge({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: "ink" | "spray" | "amber" | "paper";
  className?: string;
}) {
  const tones = {
    ink: "bg-ink text-paper",
    spray: "bg-spray text-white",
    amber: "bg-amber text-ink",
    paper: "bg-paper/95 text-ink ring-1 ring-ink/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function QtyStepper({
  value,
  onChange,
  max = 12,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const btn = cn(
    "flex items-center justify-center text-ink transition hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent",
    size === "md" ? "h-11 w-11" : "h-8 w-8",
  );
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-paper">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={`Decrease ${label.toLowerCase()}`}>
        <Minus className="h-4 w-4" />
      </button>
      <span className={cn("min-w-8 text-center font-semibold tabular-nums", size === "md" ? "text-sm" : "text-xs")}>
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
