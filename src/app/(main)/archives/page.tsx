import React from "react";
import { DbConnection } from "@/lib/Db";
import JournalArticle from "@/models/Article";
import ArchiveAccordion, {VolumeGroup} from "@/components/Archiveaccordion"; 

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getYear(dateLike: any): number | null {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  return isNaN(d.getTime()) ? null : d.getFullYear();
}

// Issue field in DB sometimes has free text like "Randoms Issue1" instead of
// just "1". We only want the NUMBER for display + URLs, never the text.
function extractIssueNumber(raw: any): string | null {
  if (raw === null || raw === undefined) return null;
  const match = String(raw).match(/\d+/);
  return match ? match[0] : null;
}

// Sorts volume/issue numbers like "2","10","12" correctly (not as plain strings)
function numericDesc(a: string, b: string) {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  if (!isNaN(na) && !isNaN(nb)) return nb - na;
  return String(b).localeCompare(String(a));
}

// ─── Group flat article list into Volume → Issues tree ───────────────────────
function groupArticles(articles: any[]): VolumeGroup[] {
  const volMap = new Map<
    string,
    { year: number | string; issuesMap: Map<string, { year: number | string; count: number }> }
  >();

  for (const a of articles) {
    const vol = (a.volume || "—").toString().trim();
    // Only the extracted number is used as the grouping key — never the raw text
    const issueKey = extractIssueNumber(a.issue) ?? "unspecified";
    const year = getYear(a.onlineDate) ?? getYear(a.createdAt) ?? "—";

    if (!volMap.has(vol)) {
      volMap.set(vol, { year, issuesMap: new Map() });
    }
    const volEntry = volMap.get(vol)!;
    if (typeof year === "number" && (typeof volEntry.year !== "number" || year > volEntry.year)) {
      volEntry.year = year;
    }

    if (!volEntry.issuesMap.has(issueKey)) {
      volEntry.issuesMap.set(issueKey, { year, count: 0 });
    }
    const issEntry = volEntry.issuesMap.get(issueKey)!;
    issEntry.count += 1;
    if (typeof year === "number" && (typeof issEntry.year !== "number" || year > issEntry.year)) {
      issEntry.year = year;
    }
  }

  return Array.from(volMap.entries())
    .map(([volume, v]) => ({
      volume,
      year: v.year,
      issues: Array.from(v.issuesMap.entries())
        .map(([issue, iss]) => ({ issue, year: iss.year, count: iss.count }))
        .sort((a, b) => numericDesc(a.issue, b.issue)),
    }))
    .sort((a, b) => numericDesc(a.volume, b.volume));
}

// ─── Server-side data fetch ───────────────────────────────────────────────────
async function getArchiveData(): Promise<VolumeGroup[]> {
  try {
    await DbConnection();
    const docs = await JournalArticle.find().lean();
    const articles = JSON.parse(JSON.stringify(docs));
    return groupArticles(articles);
  } catch (err) {
    console.error("Archive fetch error:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default async function ArchivePage() {
  const volumes = await getArchiveData();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Archive</h1>
      <ArchiveAccordion volumes={volumes} />
    </div>
  );
}