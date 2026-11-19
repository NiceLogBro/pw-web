import { describe, expect, it } from "vitest";
import { isTrustedOrigin, readIframeHeight } from "@/utils/analytics";

/**
 * These two functions decide what an embedded third-party frame is allowed to do
 * to our page: resize it, and emit analytics. Getting the origin check wrong is a
 * real vulnerability, so it is tested rather than eyeballed.
 */

const EMBED = "https://acme.looplink.com/SearchResults?type=Office";

describe("isTrustedOrigin", () => {
  it("accepts the embedded origin", () => {
    expect(isTrustedOrigin("https://acme.looplink.com", EMBED)).toBe(true);
  });

  it("rejects other origins, including look-alikes", () => {
    expect(isTrustedOrigin("https://evil.com", EMBED)).toBe(false);
    // Suffix/prefix tricks and scheme/port changes must all fail.
    expect(isTrustedOrigin("https://acme.looplink.com.evil.com", EMBED)).toBe(false);
    expect(isTrustedOrigin("https://notacme.looplink.com", EMBED)).toBe(false);
    expect(isTrustedOrigin("http://acme.looplink.com", EMBED)).toBe(false);
    expect(isTrustedOrigin("https://acme.looplink.com:8443", EMBED)).toBe(false);
  });

  it("fails closed on a malformed embed URL", () => {
    expect(isTrustedOrigin("https://acme.looplink.com", "not a url")).toBe(false);
    expect(isTrustedOrigin("", "")).toBe(false);
  });
});

describe("readIframeHeight", () => {
  it("reads the documented PAGE_HEIGHT_CHANGE shape", () => {
    expect(readIframeHeight({ type: "PAGE_HEIGHT_CHANGE", height: 1200 })).toBe(1200);
  });

  it("accepts the common alternative shapes", () => {
    expect(readIframeHeight({ type: "height", value: 980 })).toBe(980);
    expect(readIframeHeight({ type: "resize", px: 1500 })).toBe(1500);
  });

  it("ignores unrelated or malformed messages", () => {
    expect(readIframeHeight({ type: "track", height: 900 })).toBeNull();
    expect(readIframeHeight({ type: "PAGE_HEIGHT_CHANGE" })).toBeNull();
    expect(readIframeHeight({ type: "PAGE_HEIGHT_CHANGE", height: "tall" })).toBeNull();
    expect(readIframeHeight(null)).toBeNull();
    expect(readIframeHeight("PAGE_HEIGHT_CHANGE")).toBeNull();
    expect(readIframeHeight(42)).toBeNull();
  });

  it("clamps absurd heights so a bad value cannot wreck the layout", () => {
    expect(readIframeHeight({ type: "PAGE_HEIGHT_CHANGE", height: 0 })).toBeNull();
    expect(readIframeHeight({ type: "PAGE_HEIGHT_CHANGE", height: 50 })).toBeNull();
    expect(readIframeHeight({ type: "PAGE_HEIGHT_CHANGE", height: 1_000_000 })).toBeNull();
    expect(readIframeHeight({ type: "PAGE_HEIGHT_CHANGE", height: -900 })).toBeNull();
  });

  it("rounds fractional heights up", () => {
    expect(readIframeHeight({ type: "PAGE_HEIGHT_CHANGE", height: 812.4 })).toBe(813);
  });
});
