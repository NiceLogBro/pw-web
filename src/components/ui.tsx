import { useEffect, useRef, useState, type ReactNode } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

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
      // rootMargin triggers slightly before the element crosses the viewport,
      // and the fallback below guarantees nothing stays hidden for long.
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    const failsafe = setTimeout(() => setInView(true), 5000);
    return () => {
      obs.disconnect();
      clearTimeout(failsafe);
    };
  }, [threshold]);

  return { ref, inView };
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.08);
  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", inView && "reveal-in", className)}
    >
      {children}
    </Tag>
  );
}

export function Stars({
  rating,
  className,
  size = "sm",
}: {
  rating: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "h-[18px] w-[18px]" : "h-3.5 w-3.5";
  const star = (key: number) => (
    <Star key={key} className={cn(dim, "shrink-0")} fill="currentColor" strokeWidth={0} />
  );
  return (
    <span className={cn("relative inline-flex align-middle", className)} aria-label={`${rating} out of 5`}>
      <span className="flex gap-0.5 text-black/15">{[0, 1, 2, 3, 4].map(star)}</span>
      <span
        className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-safety"
        style={{ width: `${(rating / 5) * 100}%` }}
      >
        {[0, 1, 2, 3, 4].map(star)}
      </span>
    </span>
  );
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n % 1 ? 2 : 0 });

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setVal(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  align = "left",
  tone = "light",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: "left" | "center";
  /** "light" = dark text on light sections, "dark" = light text on dark sections */
  tone?: "light" | "dark";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow && (
          <Eyebrow
            className={cn(
              tone === "dark" ? "text-spray" : "text-safety",
              align === "center" && "justify-center",
            )}
          >
            <span className={cn("h-px w-6", tone === "dark" ? "bg-spray" : "bg-safety")} aria-hidden />
            {eyebrow}
          </Eyebrow>
        )}
        <h2
          className={cn(
            "mt-3 font-display text-3xl font-extrabold leading-[1.05] sm:text-4xl lg:text-[2.9rem]",
            tone === "dark" ? "text-paper" : "text-ink",
          )}
        >
          {title}
        </h2>
        {desc && (
          <p
            className={cn(
              "mt-4 text-[15px] leading-relaxed sm:text-base",
              tone === "dark" ? "text-paper/60" : "text-ink/60",
            )}
          >
            {desc}
          </p>
        )}
      </Reveal>
      {action && <Reveal delay={120}>{action}</Reveal>}
    </div>
  );
}

type ButtonProps = {
  variant?: "primary" | "dark" | "outline" | "ghost";
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm",
        variant === "primary" &&
          "bg-safety text-white shadow-[0_8px_24px_-8px_rgba(255,106,31,0.8)] hover:bg-safety-deep hover:shadow-[0_12px_28px_-8px_rgba(255,106,31,0.9)] active:scale-[0.985]",
        variant === "dark" && "bg-ink text-paper hover:bg-graphite active:scale-[0.985]",
        variant === "outline" && "border border-ink/20 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/5",
        variant === "ghost" && "text-ink/70 hover:bg-ink/5 hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "safety" | "sale" | "wash" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em]",
        tone === "neutral" && "bg-ink/5 text-ink/60",
        tone === "safety" && "bg-safety/12 text-safety-deep",
        tone === "sale" && "bg-sale text-white",
        tone === "wash" && "bg-wash text-white",
        tone === "dark" && "bg-ink text-paper",
        className,
      )}
    >
      {children}
    </span>
  );
}
