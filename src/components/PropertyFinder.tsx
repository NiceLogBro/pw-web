import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Building2, MapPin, Search, Store } from "lucide-react";
import {
  PROPERTY_TYPES,
  filterListings,
  hasGeneratedListings,
  listings,
  mapUrlFor,
  type PropertyType,
} from "@/data/properties";
import { cn } from "@/utils/cn";
import OutboundLink from "@/components/OutboundLink";
import { Reveal, SectionHeader } from "@/components/ui";
import LoopLinkEmbed, { resolveLoopLinkUrl } from "@/components/LoopLinkEmbed";
import LoopLinkDiagnostics from "@/components/LoopLinkDiagnostics";

const PAGE_SIZE = 9;

const typeLabel = (id: PropertyType) =>
  PROPERTY_TYPES.find((entry) => entry.id === id)?.label ?? "Commercial";

export default function PropertyFinder() {
  const [query, setQuery] = useState("");
  // Resolved at runtime so ?looplink= and the <meta> tag work without a rebuild.
  const [loopLinkUrl, setLoopLinkUrl] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    const metaUrl = document.querySelector<HTMLMetaElement>('meta[name="looplink-url"]')?.content;
    const resolved = resolveLoopLinkUrl(
      window.location.href,
      metaUrl || undefined,
      import.meta.env.VITE_LOOPLINK_URL as string | undefined,
    );
    setLoopLinkUrl(resolved);
    setShowDiagnostics(new URL(window.location.href).searchParams.has("looplink"));
  }, []);
  const [type, setType] = useState<PropertyType | "all">("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const matches = useMemo(() => filterListings(listings, query, type), [query, type]);

  const reset = (next: () => void) => {
    next();
    setVisible(PAGE_SIZE);
  };

  return (
    <section id="properties" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Commercial properties"
          title={
            <>
              Washing crews for <span className="shimmer-text">commercial properties</span> on
              O&apos;ahu
            </>
          }
          desc="Parking structures, retail centers, office towers and industrial yards across the island. Search a property to see what a recurring wash contract looks like."
        />

        {/* Once a LoopLink host is configured, the licensed widget replaces the
            local OSM-backed finder (see LoopLinkEmbed). */}
        {loopLinkUrl ? (
          <Reveal className="mt-10">
            <LoopLinkEmbed />
          </Reveal>
        ) : (
          <>
            {/* Controls */}
            <Reveal className="mt-10">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="relative flex-1">
                    <span className="sr-only">Search commercial properties</span>
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => reset(() => setQuery(event.target.value))}
                      placeholder="Search a property, area or address…"
                      className="w-full rounded-full border border-white/10 bg-abyss/70 py-3 pl-11 pr-4 text-sm text-foam placeholder:text-white/35 focus:border-spray/60 focus:outline-none focus:ring-2 focus:ring-spray/20"
                    />
                  </label>
                  <label className="sm:w-56">
                    <span className="sr-only">Filter by property type</span>
                    <select
                      value={type}
                      onChange={(event) =>
                        reset(() => setType(event.target.value as PropertyType | "all"))
                      }
                      className="w-full rounded-full border border-white/10 bg-abyss/70 px-4 py-3 text-sm text-foam focus:border-spray/60 focus:outline-none focus:ring-2 focus:ring-spray/20"
                    >
                      <option value="all">All property types</option>
                      {PROPERTY_TYPES.map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <p aria-live="polite" className="mt-3 px-1 text-xs text-white/45">
                  {matches.length === 0
                    ? "No properties match that search."
                    : `${matches.length} propert${matches.length === 1 ? "y" : "ies"} shown`}
                  {!hasGeneratedListings &&
                    " · sample set, run `npm run properties` to load live OSM data"}
                </p>
              </div>
            </Reveal>

            {/* Results */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.slice(0, visible).map((item) => {
                const href = mapUrlFor(item);
                const Icon = item.type === "retail" ? Store : Building2;
                return (
                  <article
                    key={item.id}
                    className="flex h-full flex-col rounded-2xl border border-white/10 bg-deep/60 p-5 transition hover:border-spray/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-spray/15 text-spray ring-1 ring-spray/25">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                        {typeLabel(item.type)}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-base font-bold leading-snug text-foam">
                      {item.name}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-spray/80" />
                      {item.address ? `${item.address}, ${item.area}` : item.area}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-spray transition hover:text-foam"
                        >
                          View on map <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-white/30">Location on request</span>
                      )}
                      <OutboundLink
                        href="tel:+18089276202"
                        label={`property_quote_${item.area}`}
                        className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-foam ring-1 ring-white/10 transition hover:bg-white/10"
                      >
                        Get a quote
                      </OutboundLink>
                    </div>
                  </article>
                );
              })}
            </div>

            {matches.length > visible && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((count) => count + PAGE_SIZE)}
                  className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-foam transition hover:border-spray hover:text-spray"
                >
                  Show more properties
                </button>
              </div>
            )}

            <p className="mt-8 text-center text-xs leading-relaxed text-white/35">
              {hasGeneratedListings ? (
                <>
                  Property locations from{" "}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("underline underline-offset-2 hover:text-spray")}
                  >
                    OpenStreetMap
                  </a>{" "}
                  contributors (ODbL). Listings are not for sale/lease availability — they identify
                  properties a cleaning crew can service.
                </>
              ) : (
                <>
                  Sample dataset for layout. Run{" "}
                  <code className="text-white/50">npm run properties</code> to load real building
                  data from OpenStreetMap (ODbL).
                </>
              )}
            </p>
          </>
        )}

        {loopLinkUrl && showDiagnostics && <LoopLinkDiagnostics url={loopLinkUrl} />}
      </div>
    </section>
  );
}
