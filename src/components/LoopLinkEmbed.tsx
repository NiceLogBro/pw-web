import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

/**
 * LoopLink (CoStar/LoopNet) property-search embed.
 *
 * LoopLink is not an API — there is no LoopNet/CoStar public API, and their terms
 * prohibit programmatic access. The only sanctioned integration is their hosted
 * search widget, which you get after signing up; it is provisioned on a host they
 * give you and displays YOUR company's listings.
 *
 * So this component is a thin, safe wrapper around that iframe. Until a host is
 * configured it renders nothing, and `PropertyFinder` shows the local dataset.
 *
 * Setup:
 *   1. Sign up for LoopLink (LoopNet → Solutions → LoopLink for brokers/owners).
 *   2. They provision a URL, e.g. https://yourfirm.looplink.com/SearchResults
 *   3. Put it in `.env.local`:
 *        VITE_LOOPLINK_URL=https://yourfirm.looplink.com/SearchResults
 *   4. LoopLinkEmbed replaces the local finder automatically (see PropertyFinder).
 *
 * Notes:
 * - The iframe is gated on scroll and reserves height, so it doesn't wreck CLS.
 * - No cookies are set by us; the vendor iframe is third-party content — disclose
 *   it in your privacy policy and gate it behind consent if you target EU/UK.
 * - If you add a CSP, allow the vendor host in `frame-src`.
 */

const LOOPLINK_URL = import.meta.env.VITE_LOOPLINK_URL as string | undefined;

export const hasLoopLink = Boolean(LOOPLINK_URL);

export default function LoopLinkEmbed() {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Don't pay third-party load cost until the section is near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!LOOPLINK_URL) return null;

  return (
    <div ref={containerRef} className="overflow-hidden rounded-3xl border border-white/10">
      {/* Reserved height prevents layout shift when the iframe paints. */}
      <div className="min-h-[820px] bg-abyss/60">
        {active ? (
          <iframe
            src={LOOPLINK_URL}
            title="Search available commercial properties"
            loading="lazy"
            className="h-[820px] w-full border-0"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex h-[820px] flex-col items-center justify-center gap-2 text-sm text-white/40">
            <span>Loading property search…</span>
            <a
              href={LOOPLINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-spray hover:text-foam"
            >
              Open in a new tab <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
