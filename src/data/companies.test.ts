import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  breakdown,
  categoryWins,
  companies,
  criteria,
  faqs,
  rankedCompanies,
  services,
  totalWeight,
  topPick,
  verdicts,
  weightedScore,
} from "@/data/companies";
import { photos } from "@/assets/photos";

/**
 * These guard the invariants the UI silently depends on. Every one of them
 * corresponds to a bug that shipped at least once: a hand-written rank that
 * disagreed with the computed score, prose claiming "5 of 6 categories" while
 * winning six, and a service referencing a photo that does not exist.
 */
describe("ranking data", () => {
  it("has unique ids and one scorecard column per company", () => {
    const ids = companies.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const row of breakdown) {
      expect(row.values).toHaveLength(companies.length);
      for (const value of row.values) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(10);
      }
    }
  });

  it("has weights that total exactly 100", () => {
    expect(totalWeight).toBe(100);
  });

  it("derives ranks from the weighted score, with no ties", () => {
    const expected = companies
      .map((_, idx) => ({ idx, score: weightedScore(idx) }))
      .sort((a, b) => b.score - a.score);

    expected.forEach((entry, position) => {
      expect(companies[entry.idx].rank).toBe(position + 1);
      expect(companies[entry.idx].score).toBe(Math.round(entry.score * 10) / 10);
    });

    const totals = companies.map((_, idx) => weightedScore(idx));
    expect(new Set(totals).size).toBe(totals.length);
  });

  it("keeps rankedCompanies sorted and topPick consistent", () => {
    const ranks = rankedCompanies.map((company) => company.rank);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(topPick).toBe(rankedCompanies[0]);
    expect(topPick.rank).toBe(1);
  });

  it("never claims more category wins than the scorecard contains", () => {
    for (const company of companies) {
      const wins = categoryWins(company.id);
      expect(wins).toBeGreaterThanOrEqual(0);
      expect(wins).toBeLessThanOrEqual(breakdown.length);
    }
    // Regression: this used to read "Wins 5 of 6" while the matrix showed 6 of 6.
    expect(verdicts.toolguys).toContain(`Wins ${categoryWins("toolguys")} of ${breakdown.length}`);
  });

  it("quotes the live score in every verdict", () => {
    for (const company of companies) {
      expect(verdicts[company.id]).toContain(`${company.score.toFixed(1)}/10`);
    }
  });

  it("keeps the criteria table's headline row in sync with the scorecard", () => {
    const row = criteria[0];
    for (const company of companies) {
      expect(row.cells[company.id].text).toContain(company.score.toFixed(1));
    }
  });

  it("never hardcodes scores in the FAQ source", () => {
    // Rendered copy must always agree with the table, so the numbers have to be
    // interpolated, not typed. Read the source to prove there are no literals.
    const source = readFileSync(new URL("./companies.ts", import.meta.url), "utf8");
    const faqBlock = source.slice(source.indexOf("export const faqs"));
    expect(faqBlock).not.toMatch(/\d\.\d\/10/);
    expect(faqBlock).toContain("companies[0].score.toFixed(1)");
  });
});

describe("content integrity", () => {
  it("gives every service a photo that actually exists", () => {
    // Service["img"] is a string union; this proves it stays a subset of `photos`.
    for (const service of services) {
      expect(photos).toHaveProperty(service.img);
      expect(service.alt.length).toBeGreaterThan(0);
    }
  });

  it("gives every company the fields the cards render", () => {
    for (const company of companies) {
      expect(company.name).toBeTruthy();
      expect(company.shortName).toBeTruthy();
      expect(company.website).toMatch(/^https:\/\//);
      expect(company.pros.length).toBeGreaterThan(0);
      expect(company.cons.length).toBeGreaterThan(0);
      expect(company.score).toBeGreaterThan(0);
    }
  });

  it("exposes a phone link wherever a phone number is published", () => {
    for (const company of companies) {
      if (company.phone) {
        expect(company.phoneHref).toMatch(/^tel:\+\d+$/);
      }
    }
  });

  it("has unique FAQ questions", () => {
    const questions = faqs.map((f) => f.q);
    expect(new Set(questions).size).toBe(questions.length);
  });
});

describe("photo manifest", () => {
  it("ships a srcSet with ascending widths and real dimensions", () => {
    for (const [name, photo] of Object.entries(photos)) {
      const widths = [...photo.srcSet.matchAll(/(\d+)w/g)].map((m) => Number(m[1]));
      expect(widths.length, name).toBeGreaterThan(0);
      expect(widths, name).toEqual([...widths].sort((a, b) => a - b));
      expect(photo.width, name).toBeLessThanOrEqual(Math.max(...widths));
      expect(photo.height, name).toBeGreaterThan(0);
      expect(photo.src, name).toContain(".webp");
    }
  });
});
