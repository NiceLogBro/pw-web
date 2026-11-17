import { useCallback, useEffect, useMemo, useState, type AnchorHTMLAttributes } from "react";

/**
 * Tiny hash router.
 *
 * Hash routing keeps deep links working on any static host (and inside the
 * single-file preview build) with zero server configuration.
 */

export interface Route {
  path: string; // e.g. "/product/steel-flex-hose"
  segments: string[]; // e.g. ["product", "steel-flex-hose"]
  query: URLSearchParams;
  /** In-page anchor, e.g. "<fragment>" in #/support#returns */
  fragment: string;
}

function parse(hash: string): Route {
  const raw = hash.replace(/^#/, "") || "/";
  // "#/support#returns" → path "#/support", fragment "returns"
  const [pathAndQuery, fragment = ""] = raw.split("#");
  const [pathname, search = ""] = pathAndQuery.split("?");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return {
    path,
    segments: path.split("/").filter(Boolean),
    query: new URLSearchParams(search),
    fragment,
  };
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return useMemo(() => parse(hash), [hash]);
}

export function navigate(to: string, opts: { replace?: boolean; keepScroll?: boolean } = {}) {
  const target = to.startsWith("#") ? to.slice(1) : to;
  const next = `#${target.startsWith("/") ? target : `/${target}`}`;
  if (window.location.hash === next) {
    if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    return;
  }
  if (opts.replace) {
    window.history.replaceState(null, "", next);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = next;
  }
}

/** Scroll to the top of a new page, or to a fragment when one is present. */
export function useRouteScroll(route: Route) {
  useEffect(() => {
    if (route.fragment) {
      const el = document.getElementById(route.fragment);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [route.path, route.fragment]);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  keepScroll?: boolean;
};

export function Link({ to, keepScroll, onClick, ...rest }: LinkProps) {
  const handle = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to, { keepScroll });
    },
    [to, keepScroll, onClick],
  );

  return <a href={`#${to}`} onClick={handle} {...rest} />;
}

/** Build a shop URL with filters applied. */
export function shopHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) search.set(k, v);
  }
  const qs = search.toString();
  return `/shop${qs ? `?${qs}` : ""}`;
}
