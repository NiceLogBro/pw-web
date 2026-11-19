import { describe, expect, it } from "vitest";
import { resolveLoopLinkUrl } from "@/components/LoopLinkEmbed";

/**
 * The embed URL is resolved at runtime so it can be set without a rebuild. The
 * precedence matters: a pasted `?looplink=` must win over the deployed meta tag,
 * which must win over the build-time env var, so a stale value can always be
 * overridden from the address bar.
 */

const PAGE = "https://powerwashingoahu.com/";
const META = "https://acme.looplink.com/SearchResults";
const ENV = "https://env.looplink.com/SearchResults";

describe("resolveLoopLinkUrl", () => {
  it("prefers ?looplink= over the meta tag and env", () => {
    const page = `${PAGE}?looplink=${encodeURIComponent("https://bar.looplink.com/Search")}`;
    expect(resolveLoopLinkUrl(page, META, ENV)).toBe("https://bar.looplink.com/Search");
  });

  it("falls back to the meta tag, then the env var", () => {
    expect(resolveLoopLinkUrl(PAGE, META, ENV)).toBe(META);
    expect(resolveLoopLinkUrl(PAGE, undefined, ENV)).toBe(ENV);
    expect(resolveLoopLinkUrl(PAGE)).toBeNull();
  });

  it("ignores empty and whitespace-only values", () => {
    expect(resolveLoopLinkUrl(PAGE, "   ", undefined)).toBeNull();
    expect(resolveLoopLinkUrl(PAGE, "", "")).toBeNull();
  });

  it("rejects non-http(s) and malformed URLs instead of throwing", () => {
    expect(resolveLoopLinkUrl(`${PAGE}?looplink=javascript:alert(1)`, META)).toBe(META);
    expect(resolveLoopLinkUrl(`${PAGE}?looplink=what`, META)).toBe(META);
    expect(resolveLoopLinkUrl(PAGE, "not a url")).toBeNull();
  });

  it("keeps query strings and strips nothing the vendor needs", () => {
    const vendor = "https://acme.looplink.com/SearchResults?type=Office&sort=price";
    expect(resolveLoopLinkUrl(PAGE, vendor)).toBe(vendor);
  });

  it("survives a page URL that already has other params", () => {
    const page = `${PAGE}?utm_source=x&looplink=${encodeURIComponent("https://b.looplink.com/S")}`;
    expect(resolveLoopLinkUrl(page, META)).toBe("https://b.looplink.com/S");
  });
});
