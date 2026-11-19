/**
 * Minimal, dependency-free analytics bridge.
 *
 * The site ships no analytics library; this fires a GA4 event when one is present
 * and ALWAYS emits a DOM event, so any tag manager (GTM, Plausible, a Vercel
 * middleware beacon) can pick it up without touching call sites.
 *
 * This is the honest version of "affiliate tracking" for this site: LoopLink has
 * no affiliate program and pays no commission, so what is actually measurable is
 * *lead attribution* — which outbound destination a visitor clicked. That is the
 * number a broker/referral agreement would be settled on.
 */

export type AnalyticsEvent =
  "looplink_view" | "looplink_event" | "outbound_click" | "quote_click" | "property_search";

interface GtagWindow extends Window {
  gtag?: (command: "event", event: string, params?: Record<string, unknown>) => void;
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // GA4 if the property owner has installed it.
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag === "function") gtag("event", event, params);

  // Always emit a DOM event so any tag manager can subscribe.
  window.dispatchEvent(new CustomEvent("site:analytics", { detail: { event, params } }));
}

/** Fire when a visitor leaves for an external destination (lead attribution). */
export function trackOutbound(href: string, label: string) {
  let host = href;
  try {
    host = new URL(href).host;
  } catch {
    // Relative or non-URL href: keep the raw value.
  }
  track("outbound_click", { link_domain: host, link_label: label, link_url: href });
}

/**
 * Only trust messages from the host we actually embedded. Using `"*"` here would
 * let any framed or framing origin drive our UI height and analytics.
 */
export function isTrustedOrigin(eventOrigin: string, embedUrl: string) {
  try {
    return eventOrigin === new URL(embedUrl).origin;
  } catch {
    return false;
  }
}

/**
 * Vendor iframes announce their content height so the parent can size the frame
 * (otherwise you get the classic double scrollbar). Accepts the documented
 * `{ type: "PAGE_HEIGHT_CHANGE", height }` shape plus the common variants, and
 * clamps to something sane so a bad value cannot blow up the layout.
 */
export function readIframeHeight(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const payload = data as Record<string, unknown>;
  const type = payload.type;
  if (type !== "PAGE_HEIGHT_CHANGE" && type !== "height" && type !== "resize") return null;

  const raw = payload.height ?? payload.value ?? payload.px;
  const height = Number(raw);
  if (!Number.isFinite(height)) return null;
  if (height < 400 || height > 20000) return null;

  return Math.ceil(height);
}
