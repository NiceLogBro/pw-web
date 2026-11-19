import { breakdown, companies, faqs, topPick } from "@/data/companies";

const PAGE_URL = "https://powerwashingoahu.com/";

/**
 * JSON-LD for the page's two genuinely structured things: the FAQ list and the
 * ranking itself. Built from the same `companies`/`faqs` data the UI renders, so
 * the markup can never disagree with what users see.
 */
export default function StructuredData() {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const ranking = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top 5 power washing companies on O'ahu (2026)",
    url: PAGE_URL,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: companies.length,
    itemListElement: [...companies]
      .sort((a, b) => a.rank - b.rank)
      .map((company) => ({
        "@type": "ListItem",
        position: company.rank,
        item: {
          "@type": "LocalBusiness",
          name: company.name,
          url: company.website,
          ...(company.phone && company.phoneHref
            ? { telephone: company.phone.replace(/[^\d+]/g, "") }
            : {}),
          areaServed: "O'ahu, Hawai'i",
          address: { "@type": "PostalAddress", addressRegion: "HI", addressCountry: "US" },
        },
      })),
  };

  const report = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The best power washing on O'ahu, ranked (2026)",
    url: PAGE_URL,
    isAccessibleForFree: true,
    about: `A weighted comparison across ${breakdown.length} criteria: ${breakdown
      .map((row) => row.label)
      .join(", ")}.`,
    mentions: topPick.name,
  };

  return (
    <>
      {[faqPage, ranking, report].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          // Content is generated from local, trusted data (no user input).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
