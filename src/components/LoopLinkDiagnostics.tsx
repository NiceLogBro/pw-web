import { useEffect, useState } from "react";

/**
 * Setup aid for the LoopLink embed. Appears ONLY when the page is loaded with
 * `?looplink=<url>`, so it never reaches normal visitors or the indexed page.
 *
 * Framing failures are opaque in the browser: the page renders an empty frame and
 * fires no error, and the console shows a generic "refused to connect". This panel
 * surfaces the concrete facts you need when talking to CoStar support:
 *
 *   - the exact URL being embedded
 *   - whether the frame painted
 *   - your origin (what they must add to the whitelist)
 *   - a copy-pasteable curl that reveals the response headers, which is where
 *     X-Frame-Options / CSP frame-ancestors actually show up
 */

interface FrameReport {
  status: "pending" | "painted" | "refused";
  detail: string;
}

export default function LoopLinkDiagnostics({ url }: { url: string }) {
  const [report, setReport] = useState<FrameReport>({ status: "pending", detail: "waiting…" });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const frame = document.querySelector<HTMLIFrameElement>("iframe[title^='Search available']");
      if (!frame) {
        setReport({ status: "refused", detail: "iframe was never mounted" });
        return;
      }
      try {
        const doc = frame.contentDocument;
        if (!doc || doc.body.childElementCount === 0) {
          setReport({
            status: "refused",
            detail:
              "frame is empty — almost always X-Frame-Options/CSP or a missing host allowlist",
          });
        } else {
          setReport({ status: "painted", detail: "frame has content" });
        }
      } catch {
        setReport({ status: "painted", detail: "cross-origin frame loaded (expected)" });
      }
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [url]);

  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const curl = `curl -sI -H 'Referer: ${origin}/' '${url}' | grep -iE 'x-frame-options|content-security-policy|location|http/'`;

  return (
    <div className="fixed bottom-4 right-4 z-[70] w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-gold/40 bg-abyss/95 p-4 font-mono text-[11px] leading-relaxed text-white/75 shadow-2xl backdrop-blur">
      <p className="mb-2 font-sans text-xs font-bold uppercase tracking-widest text-gold">
        LoopLink setup check
      </p>

      <dl className="space-y-1.5">
        <Row label="status">
          <span
            className={
              report.status === "painted"
                ? "text-spray"
                : report.status === "refused"
                  ? "text-gold"
                  : "text-white/50"
            }
          >
            {report.status}
          </span>{" "}
          — {report.detail}
        </Row>
        <Row label="url">
          <span className="break-all">{url}</span>
        </Row>
        <Row label="origin">
          <span className="break-all text-spray">{origin}</span>
          <span className="block text-white/40">
            ← give this to CoStar; it must be on the site allowlist
          </span>
        </Row>
      </dl>

      <p className="mt-3 font-sans text-[11px] text-white/45">
        Reveal the framing headers from your terminal:
      </p>
      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-white/5 p-2 text-[10px] text-white/70">
        {curl}
      </pre>
      <p className="mt-2 font-sans text-[11px] leading-relaxed text-white/40">
        <code>X-Frame-Options: DENY/SAMEORIGIN</code> or a <code>frame-ancestors</code> list without
        your origin = they must allowlist you. Remove <code>?looplink=</code> from the URL to hide
        this panel.
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-2">
      <dt className="text-white/35">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
