import { cn } from "@/utils/cn";
import { Link } from "@/lib/router";
import { site } from "@/lib/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-ink text-paper",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        {/* pressure gauge arc */}
        <path
          d="M4.2 17.5a9 9 0 1 1 15.6 0"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path d="M12 17.2 16.4 10" stroke="#0a9fbb" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="17.4" r="2.1" fill="#0a9fbb" />
      </svg>
    </span>
  );
}

export function Logo({ className, tone = "ink" }: { className?: string; tone?: "ink" | "paper" }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label={`${site.name}${site.suffix} home`}>
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[15px] font-semibold tracking-[-0.03em] sm:text-[17px]",
            tone === "ink" ? "text-ink" : "text-paper",
          )}
        >
          PowerWashing<span className="text-spray">Oahu</span>
        </span>
        <span
          className={cn(
            "mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.22em] sm:block",
            tone === "ink" ? "text-slate" : "text-paper/50",
          )}
        >
          Supply &amp; Service
        </span>
      </span>
    </Link>
  );
}
