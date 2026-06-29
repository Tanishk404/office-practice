// app/page.tsx  ─── SERVER COMPONENT (Next.js App Router)
import React from "react";
import Image from "next/image";
import Link from "next/link";


import { MdDescription, MdPictureAsPdf } from "react-icons/md";
import { DbConnection } from "@/lib/Db";
import Homepage from "@/models/Homepage";
import JournalArticle from "@/models/Article";
import Nav from "@/components/Nav/Nav";

import CoverImageSync from "@/components/CoverImage";

// ─── Types (Homepage model — unchanged) ──────────────────────────────────────
interface IndexingEntry {
  _id: string;
  name: string;
  imageUrl: string;
}

// ─── Type update ──────────────────────────────────────────────────────────────
interface PopularArticle {
  _id: string;
  customSummary?: string;
  articleId: {
    _id: string;
    articleTitle: string;
    articleType?: string;
    abstract?: string;
    volume: string | number;
    issue: string | number;
    journalTitle?: string;
  } | null; // null tab agar referenced article delete ho gaya ho
}

interface HomepageData {
  _id: string;
  issn_print: string;
  issn_online: string;
  coden: string;
  aboutText: string;
  coverImageUrl: string;
  indexing: IndexingEntry[];
  mostPopular: PopularArticle[];
}

// ─── Types (real Article model — for "Current Issue Highlights") ────────────
interface IAuthor {
  firstName: string;
  lastName: string;
}

interface IArticle {
  _id: string;
  journalTitle?: string;
  volume: string | number;
  issue: string | number;
  doiId?: string;
  articleTitle: string;
  abstract?: string;
  authorsList?: IAuthor[];
  articlePdfUrl?: string;
  page?: string;
  articleType?: string;
  status: string;
  onlineDate?: string;
  createdAt?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripHtml(html?: string) {
  if (!html) return "";
  return html
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max = 220) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

function formatAuthors(authors: IAuthor[] = []) {
  return authors.map((a) => `${a.firstName} ${a.lastName}`.trim()).filter(Boolean).join(", ");
}

// ─── Data Fetch: Homepage doc (cover image, ISSN, indexing, most popular) ───
// ─── Data Fetch: Homepage doc (cover image, ISSN, indexing, most popular) ───
async function getHomepageData(): Promise<HomepageData | null> {
  try {
    await DbConnection();
    // ✅ FIX: mostPopular.articleId ko populate karna zaroori hai,
    // warna sirf raw ObjectId aata hai, real article data nahi
    const doc = await Homepage.findOne()
      .populate({
        path: "mostPopular.articleId",
        select: "articleTitle articleType abstract volume issue journalTitle",
      })
      .lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc)) as HomepageData;
  } catch (err) {
    console.error("Homepage fetch error:", err);
    return null;
  }
}

// ─── Data Fetch: real current-volume / current-issue articles ───────────────
async function getCurrentIssueArticles(): Promise<{
  articles: IArticle[];
  volume: string | number;
  issue: string | number;
}> {
  try {
    await DbConnection();
    const raw = await JournalArticle.find({ status: "Active" }).lean();
    const articles = JSON.parse(JSON.stringify(raw)) as IArticle[];

    if (articles.length === 0) return { articles: [], volume: "", issue: "" };

    // Latest volume = numerically highest volume among active articles
    const latestVolume = articles.reduce(
      (max, a) => (Number(a.volume) > Number(max) ? a.volume : max),
      articles[0].volume
    );

    const inVolume = articles.filter((a) => String(a.volume) === String(latestVolume));

    // Latest issue within that volume
    const latestIssue = inVolume.reduce(
      (max, a) => (Number(a.issue) > Number(max) ? a.issue : max),
      inVolume[0].issue
    );

    const currentIssueArticles = inVolume
      .filter((a) => String(a.issue) === String(latestIssue))
      .sort((a, b) => {
        const pa = parseInt(a.page?.split("-")[0] || "0", 10);
        const pb = parseInt(b.page?.split("-")[0] || "0", 10);
        return pa - pb;
      });

    return { articles: currentIssueArticles, volume: latestVolume, issue: latestIssue };
  } catch (err) {
    console.error("Current issue articles fetch error:", err);
    return { articles: [], volume: "", issue: "" };
  }
}

// ─── Group current-issue articles by articleType, in a fixed display order ─
const SECTION_ORDER = [
  "editorial",
  "review article",
  "original research article",
  "case report",
  "short communication",
];

function groupArticlesByType(articles: IArticle[]) {
  const map: Record<string, IArticle[]> = {};
  for (const a of articles) {
    const key = (a.articleType || "Articles").trim();
    if (!map[key]) map[key] = [];
    map[key].push(a);
  }

  const sorted: [string, IArticle[]][] = [];
  for (const sec of SECTION_ORDER) {
    const matchKey = Object.keys(map).find((k) => k.toLowerCase() === sec);
    if (matchKey) sorted.push([matchKey, map[matchKey]]);
  }
  for (const [k, v] of Object.entries(map)) {
    if (!sorted.find(([sk]) => sk === k)) sorted.push([k, v]);
  }
  return sorted;
}

// ─────────────────────────────────────────────────────────────────────────────
export default async function Home() {
  const [data, currentIssue] = await Promise.all([
    getHomepageData(),
    getCurrentIssueArticles(),
  ]);

  // Fallback values if DB empty (Current Issue card — UNCHANGED)
  const issn_print = data?.issn_print || "—";
  const issn_online = data?.issn_online || "—";
  const coden = data?.coden || "—";
  const aboutText = data?.aboutText || "";
  // Cloudinary already returns a full https:// URL, so use it as-is.
  const coverImage = data?.coverImageUrl || "/Book_img.png";
  const indexing = data?.indexing ?? [];
  const mostPopular = data?.mostPopular ?? [];

  // Real current-issue articles, grouped by type
  const groupedCurrentIssue = groupArticlesByType(currentIssue.articles);

  return (
    <div className="min-h-screen bg-[#f8f9fa] antialiased relative">
      <CoverImageSync imageUrl={coverImage} />
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Current Issue Card — UNCHANGED */}
          <section className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
            <div className="bg-[#e9ecef] border-b-2 border-[#4caf50] px-4 py-2 font-bold text-sm text-slate-800">
              Current Issue
            </div>
            <div className="p-4 flex flex-col sm:flex-row gap-6">
              {/* Cover Image */}
              <div className="flex-shrink-0">
                <Image
                  alt="Journal Cover"
                  src={coverImage}
                  width={150}
                  height={200}
                  className="rounded shadow-sm object-cover"
                  unoptimized={coverImage.startsWith("http")}
                />
              </div>

              {/* Meta */}
              <div className="text-[13px] text-slate-700 space-y-1.5 leading-normal">
                <p><strong>ISSN (Print):</strong> {issn_print}</p>
                <p><strong>Online ISSN:</strong> {issn_online}</p>
                <p><strong>CODEN:</strong> {coden}</p>
                {aboutText && (
                  <p className="text-justify text-slate-600">
                    <strong>About:</strong>{" "}
                    {aboutText.length > 300 ? (
                      <>
                        {aboutText.slice(0, 300)}…{" "}
                        <Link href="/about" className="text-blue-500 font-bold text-[15px]">
                          more...
                        </Link>
                      </>
                    ) : (
                      aboutText
                    )}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Current Issue Highlights Header */}
          {groupedCurrentIssue.length > 0 && (
            <div className="bg-[#e9ecef] border-b-2 border-[#4caf50] px-4 py-2 font-bold text-sm text-slate-800 rounded-t">
              Current Issue Highlights
            </div>
          )}

          {/* Real articles, grouped by type */}
          {groupedCurrentIssue.map(([section, articles]) => (
            <section
              key={section}
              className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden"
            >
              <div className="bg-[#e9ecef] border-b border-slate-200 px-4 py-1.5 font-bold text-xs text-slate-700 uppercase tracking-wide">
                {section}
              </div>
              <div className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <CurrentIssueArticleCard key={art._id} article={art} />
                ))}
              </div>
            </section>
          ))}

          {/* Empty state if no current-issue articles yet */}
          {groupedCurrentIssue.length === 0 && (
            <div className="bg-white border border-dashed border-slate-200 rounded p-8 text-center text-slate-400 text-sm">
              No articles published yet in the current issue.
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR — UNCHANGED ── */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Indexing */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 border-l-4 border-[#4caf50] pl-2 mb-4">
              Indexing
            </h3>
            {indexing.length > 0 ? (
              <div className="space-y-3">
                {indexing.map((idx) => (
                  <div
                    key={idx._id}
                    className="py-2 px-3 border border-dashed border-slate-200 rounded bg-slate-50 flex items-center justify-center"
                  >
                    {idx.imageUrl ? (
                      <img src={idx.imageUrl} alt={idx.name} className="max-h-10 object-contain" />
                    ) : (
                      <span className="text-sm font-bold text-slate-600">{idx.name}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback: Google Scholar hardcoded */
              <div className="py-3 px-1 text-center font-bold text-lg text-slate-400 border border-dashed border-slate-200 rounded bg-slate-50">
                <span className="text-blue-600">G</span>
                <span className="text-red-500">o</span>
                <span className="text-amber-500">o</span>
                <span className="text-blue-600">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span> Scholar
              </div>
            )}
          </div>

          {/* Most Popular */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 border-l-4 border-[#4caf50] pl-2 mb-4">
              Most Popular
            </h3>
            {mostPopular.length > 0 ? (
              <div className="space-y-5">
                {mostPopular.map((art) => (
                  <PopularCard key={art._id} article={art} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No popular articles yet.</p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

// ─── Current Issue Article Card (real article data) ──────────────────────────
function CurrentIssueArticleCard({ article }: { article: IArticle }) {
  const articleHref = `/archive/volume/${article.volume}/issue/${article.issue}/article/${article._id}`;
  const pdfHref = `${articleHref}/pdf`;

  const authorNames = formatAuthors(article.authorsList);

  const doiUrl = article.doiId
    ? article.doiId.startsWith("http")
      ? article.doiId
      : `https://doi.org/${article.doiId}`
    : null;

  const year = article.onlineDate
    ? new Date(article.onlineDate).getFullYear()
    : article.createdAt
    ? new Date(article.createdAt).getFullYear()
    : "";

  const isEditorial = article.articleType?.toLowerCase() === "editorial";
  const excerpt = truncate(stripHtml(article.abstract || ""), 220);

  return (
    <div className="px-4 py-3 space-y-1">
      <Link
        href={articleHref}
        className="text-[14.5px] font-bold text-[#1e88e5] hover:underline leading-snug block"
      >
        {article.articleTitle}
      </Link>

      {authorNames && (
        <p className="text-[12.5px] text-slate-600">
          <span className="font-semibold text-slate-700">Author details:</span> {authorNames}
        </p>
      )}

      <p className="text-[12px] text-slate-500 italic">
        {article.journalTitle || "IP Indian Journal of Neurosciences"}. {article.volume}(
        {article.issue}){article.page ? `:${article.page}` : ""}
        {year ? `, ${year}` : ""}.
      </p>

      {doiUrl && (
        <p className="text-[12px] text-slate-500">
          <span className="font-semibold not-italic">DOI:</span>{" "}
          <a
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline not-italic"
          >
            {doiUrl}
          </a>
        </p>
      )}

      {excerpt && <p className="text-[12.5px] text-slate-600 leading-relaxed pt-1">{excerpt}</p>}

      <div className="flex items-center gap-4 pt-1.5">
        <Link
          href={articleHref}
          className="flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 hover:underline"
        >
          <MdDescription size={14} /> Abstract
        </Link>
        {article.articlePdfUrl && (
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 hover:underline"
          >
            <MdPictureAsPdf size={14} /> PDF
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Most Popular Sidebar Card — UNCHANGED ───────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  "ORIGINAL RESEARCH ARTICLE": "bg-[#4caf50] text-white",
  "REVIEW ARTICLE": "bg-[#1e88e5] text-white",
  "CASE REPORT": "bg-[#fb8c00] text-white",
  "SHORT COMMUNICATION": "bg-[#8e24aa] text-white",
  EDITORIAL: "bg-[#e53935] text-white",
};
const badgeColor = (_type: string) => "bg-[#4caf50] text-white"

// ─── Most Popular Sidebar Card — FIXED ───────────────────────────────────────
function PopularCard({ article }: { article: PopularArticle }) {
  const real = article.articleId;

  // ✅ FIX: agar referenced article delete ho gaya hai DB se, card hi skip karo
  if (!real) return null;

  // ✅ FIX: same pattern jo CurrentIssueArticleCard use karta hai — real volume/issue/_id
  const href = `/archive/volume/${real.volume}/issue/${real.issue}/article/${real._id}`;

  // ✅ FIX: customSummary agar admin ne diya hai, warna abstract se auto-truncate
  const summary = article.customSummary?.trim()
    ? article.customSummary
    : truncate(stripHtml(real.abstract || ""), 150);

  return (
    <div className="space-y-1.5">
      {real.articleType && (
        <span
          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${badgeColor(
            real.articleType
          )}`}
        >
          {real.articleType}
        </span>
      )}
      <Link
        href={href}
        className="text-[12px] font-bold text-[#1e88e5] hover:underline cursor-pointer leading-snug block"
      >
        {real.articleTitle}
      </Link>
      {summary && (
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{summary}</p>
      )}
      {real.journalTitle && <p className="text-[11px] text-slate-400 italic">{real.journalTitle}</p>}
    </div>
  );
}