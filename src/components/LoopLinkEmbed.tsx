import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { isTrustedOrigin, readIframeHeight, track, trackOutbound } from "@/utils/analytics";

/**
 * LoopLink (CoStar/LoopNet) property-search embed.
 *
 * WHAT THIS IS FOR
 * LoopLink is a hosted search widget, not an API — there is no LoopNet/CoStar
 * public API and their terms prohibit programmatic access. Once CoStar gives you
 * access they provision a host (usually https://<yourcompany>.looplink.com/...)
 * which displays YOUR company's listings.
 *
 * THE URL IS RESOLVED AT RUNTIME, NOT BUILD TIME
 * `VITE_LOOPLINK_URL` is inlined by Vite at build time, so testing a URL would
 * otherwise require a rebuild — and the URL only exists while a visitor is on the
 * page. Resolution order:
 *
 *   1. `?looplink=<url>` in the page URL — lets you paste a candidate URL and see
 *      it immediately, in dev or in production, with no rebuild.
 *   2. `<meta name="looplink-url" content="https://...">` in index.html — lets you
 *      change the host post-deploy, no rebuild. Pick this once CoStar confirms.
 *   3. `VITE_LOOPLINK_URL` from `.env.local` — build-time default.
 *
 * THE EMBED WILL PROBABLY BE BLOCKED AT FIRST (and that is expected)
 * LoopLink serves framing headers (X-Frame-Options / CSP frame-ancestors) and only
 * allows hosts registered in your account's website whitelist. An unregistered
 * origin renders an empty box with no error event, so this component runs a probe
 * after load and shows a setup notice instead of a silent blank rectangle.
 *
 * LISTENING TO THE WIDGET
 * The LoopLink install code is the iframe plus, on this class of product, a small
 * script that (a) posts its content height to the parent so the frame can be sized
 * without a double scrollbar, and (b) forwards interactions so they can be measured.
 * Both arrive as postMessage, and both are origin-checked here: only messages whose
 * origin matches the embedded URL are trusted, never "*".
 *
 * Note this is NOT an affiliate program. LoopNet/CoStar pays no commission and
 * issues no referral links; the only identifier they give you is the embed itself.
 * What is measurable — and what a broker/referral agreement would be settled on —
 * is lead attribution, which is why outbound clicks are tracked.
 *
 * Also note: an iframe is third-party content — it is not indexed as your page's
 * markup (so it adds nothing to SEO), and it is subject to your consent policy.
 * The frame is scroll-gated with reserved height so it does not cost CLS, and it
 * has `sandbox` set: LoopLink search needs scripts, forms, same-origin storage and
 * its own navigations, and nothing more.
 */

const META_SELECTOR = 'meta[name="looplink-url"]';
const FALLBACK_HEIGHT = 820;

/** Validates and normalises a candidate embed URL. Returns null if unusable. */
export function resolveLoopLinkUrl(pageUrl: string, metaUrl?: string, envUrl?: string) {
  const candidates = [new URL(pageUrl).searchParams.get("looplink"), metaUrl, envUrl].filter(
    (value): value is string => Boolean(value && value.trim()),
  );

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
      return url.toString();
    } catch {
      // Ignore malformed values and fall through to the next candidate.
    }
  }

  return null;
}

function readMetaUrl() {
  if (typeof document === "undefined") return undefined;
  return document.querySelector<HTMLMetaElement>(META_SELECTOR)?.content || undefined;
}

export default function LoopLinkEmbed() {
  const [url, setUrl] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState(FALLBACK_HEIGHT);
  const [blocked, setBlocked] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resolve the URL on the client so ?looplink= and the meta tag work without a rebuild.
  useEffect(() => {
    setUrl(
      resolveLoopLinkUrl(
        window.location.href,
        readMetaUrl(),
        import.meta.env.VITE_LOOPLINK_URL as string | undefined,
      ),
    );
  }, []);

  // Only mount the iframe once the section is near the viewport.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

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

  // A framed LoopLink page can usually still be probed same-origin-ish; if the
  // browser refused the frame, onload never fires and we time out. Either way the
  // visitor gets an explanation and a way through rather than a blank box.
  useEffect(() => {
    if (!active || !url) return;
    const timer = window.setTimeout(() => {
      const frame = frameRef.current;
      if (!frame) return;

      try {
        // Cross-origin reads throw — which means the frame did load.
        const doc = frame.contentDocument;
        if (doc && doc.body && doc.body.childElementCount === 0) setBlocked(true);
      } catch {
        // Loaded and cross-origin: this is the healthy path.
      }
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [active, url]);

  // Trust only the embedded origin. Height sync + interaction forwarding.
  useEffect(() => {
    if (!active || !url) return;

    const onMessage = (event: MessageEvent) => {
      if (!isTrustedOrigin(event.origin, url)) return;

      const nextHeight = readIframeHeight(event.data);
      if (nextHeight !== null) {
        setHeight(nextHeight);
        return;
      }

      // Forward anything else the widget reports (filters used, listing opened)
      // as a single event so the payload stays inspectable in GA4.
      const payload = event.data as { type?: string } | null;
      if (payload && typeof payload.type === "string") {
        track("looplink_event", { widget_event: payload.type });
      }
    };

    window.addEventListener("message", onMessage);
    track("looplink_view", { url });

    return () => window.removeEventListener("message", onMessage);
  }, [active, url]);

  if (!url) return null;

  return (
    <div ref={containerRef} className="overflow-hidden rounded-3xl border border-white/10">
      {/* min-height reserves room so the frame cannot cause layout shift. */}
      <div className="min-h-[820px] bg-abyss/60" style={{ minHeight: FALLBACK_HEIGHT }}>
        {active ? (
          <iframe
            ref={frameRef}
            src={url}
            title="Search available commercial properties"
            loading="lazy"
            height={height}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={(event) => {
              const frame = event.currentTarget;
              try {
                // Same-origin: measure the real document so we can size to it.
                const doc = frame.contentDocument;
                if (doc?.documentElement) {
                  const next = doc.documentElement.scrollHeight;
                  if (next > 400) setHeight(next);
                }
              } catch {
                // Cross-origin: keep the fallback height.
              }
            }}
            className="w-full border-0"
          />
        ) : (
          <div className="flex h-[820px] flex-col items-center justify-center gap-2 text-sm text-white/40">
            <span>Loading property search…</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-spray hover:text-foam"
            >
              Open in a new tab <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>

      {blocked && (
        <div className="border-t border-white/10 bg-gold/10 px-5 py-4 text-xs leading-relaxed text-white/70">
          <strong className="text-gold">This URL refused to be embedded.</strong> LoopLink only
          allows hosts registered in your account&apos;s website whitelist and sends{" "}
          <code className="text-white/50">X-Frame-Options</code>/
          <code className="text-white/50">CSP frame-ancestors</code>. Ask CoStar to allowlist this
          domain, or{" "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound(url, "looplink_blocked")}
            className="underline underline-offset-2 hover:text-spray"
          >
            open the search in a new tab
          </a>
          .
        </div>
      )}
    </div>
  );
}
