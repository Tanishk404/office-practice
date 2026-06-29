import React from "react";
import Link from "next/link";
import { DbConnection } from "@/lib/Db";
import JournalArticle from "@/models/Article";
import IssueArticleCard from "@/components/IssueArticleCard";
export const dynamic = "force-dynamic";
interface PageProps {
  params: Promise<{ volume: string; issue: string }>;
}

function extractIssueNumber(raw: any): string | null {
  if (raw === null || raw === undefined) return null;
  const match = String(raw).match(/\d+/);
  return match ? match[0] : null;
}

function getYear(dateLike: any): number | null {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  return isNaN(d.getTime()) ? null : d.getFullYear();
}

const TYPE_ORDER = [
  "EDITORIAL",
  "ORIGINAL RESEARCH ARTICLE",
  "REVIEW ARTICLE",
  "CASE REPORT",
  "SHORT COMMUNICATION",
];



function groupByType(articles: any[]) {
  const map: Record<string, any[]> = {};
  for (const a of articles) {
    const key = (a.articleType || "OTHER").toUpperCase();
    if (!map[key]) map[key] = [];
    map[key].push(a);
  }
  const sorted: [string, any[]][] = [];
  for (const t of TYPE_ORDER) {
    if (map[t]) {
      // ✅ Har type bucket ke andar displayOrder se sort karo
      sorted.push([t, map[t].sort((a, b) => a.displayOrder - b.displayOrder)]);
    }
  }
  for (const [t, arts] of Object.entries(map)) {
    if (!TYPE_ORDER.includes(t)) {
      // ✅ Yahan bhi
      sorted.push([t, arts.sort((a, b) => a.displayOrder - b.displayOrder)]);
    }
  }
  return sorted;
}




const barCls =
  "bg-[#e9ecef] border-b-2 border-[#4caf50] px-4 py-2 font-bold text-[15px] text-slate-800";

function titleCase(s: string) {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function IssuePage({ params }: PageProps) {
  const { volume, issue } = await params;
  const volumeDecoded = decodeURIComponent(volume);
  const issueDecoded = decodeURIComponent(issue);

  await DbConnection();

  const docs = await JournalArticle.find({ volume: volumeDecoded })
  .sort({ displayOrder: 1, createdAt: 1 })
  .lean();

  const allInVolume = JSON.parse(JSON.stringify(docs));

  const articles = allInVolume.filter((a: any) => {
    const num = extractIssueNumber(a.issue) ?? "unspecified";
    return num === issueDecoded;
  });

  const year =
    articles
      .map((a: any) => getYear(a.onlineDate) ?? getYear(a.createdAt))
      .find((y: number | null) => y !== null) ?? "—";

  const displayIssue = issueDecoded === "unspecified" ? "—" : issueDecoded;
  const groupedArticles = groupByType(articles);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link href="/archives" className="text-sm text-blue-600 hover:underline">
        ← Back to Archive
      </Link>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className={barCls}>
          Volume {volumeDecoded}, Issue {displayIssue}, Year {year}, No of
          articles {articles.length}
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No articles found for this issue.
          </div>
        ) : (
          groupedArticles.map(([type, arts]) => (
            <div key={type}>
              <div className={barCls}>{titleCase(type)}</div>
              <div className="divide-y divide-slate-100">
                {arts.map((a: any) => (
                  <IssueArticleCard
                    key={a._id}
                    article={{
                      ...a,
                      // ✅ FIX: DB ki messy issue/volume value ki jagah
                      // URL se aaye clean values pass karo taaki
                      // article URL sahi bane
                      volume: volumeDecoded,
                      issue: issueDecoded,
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}