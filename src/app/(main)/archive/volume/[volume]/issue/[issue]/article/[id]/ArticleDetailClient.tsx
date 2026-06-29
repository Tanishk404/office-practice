"use client";

import Link from "next/link";

// ─── Types — REAL schema (matches /api/articles & CurrentIssuePage) ──
interface IAuthor {
  firstName: string;
  lastName: string;
  orcid?: string;
  correspondingAuthor: "Yes" | "No";
}

interface Article {
  _id: string;
  journalTitle: string;
  volume: string;
  issue: string;
  doiId?: string;
  articleTitle: string;
  abstract: string;
  keywords?: string;            // comma-separated string, not an array
  authorsList: IAuthor[];
  articlePdfUrl: string;
  supplementaryPdfUrl?: string;
  page?: string;                 // e.g. "12-18"
  subject?: string;
  referencesNo?: string;
  license?: string;
  articleType?: string;
  accessType: "Open" | "Restricted";
  receivedDate?: string;
  acceptedDate?: string;
  onlineDate?: string;
  status: "Active" | "Inactive";
  createdAt: string;
  views?: number;
  downloads?: number;
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ArticleDetailClient({ article }: { article: Article }) {
  const doiUrl = article.doiId ? `https://doi.org/${article.doiId}` : null;

  // const pdfUrl = `/api/pdf/${article.articlePdfUrl}`

  const pdfUrl = `/archive/volume/${article.volume}/issue/${article.issue}/article/${article._id}/pdf`;

  const onlineYear = article.onlineDate
    ? new Date(article.onlineDate).getFullYear()
    : article.createdAt
    ? new Date(article.createdAt).getFullYear()
    : "";

  // "keywords" DB me comma-separated string hai, isliye tags banane ke liye split karna padega
  const keywordList = article.keywords
    ? article.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      {/* <div className="bg-green-600 text-white py-6 px-8">
        <h1 className="text-2xl font-bold">{article.journalTitle || "IP Indian Journal of Neurosciences"}</h1>
        <p className="text-sm mt-1 opacity-90">
          Official Publication of Khyati Education and Research Foundation
        </p>
      </div> */}

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8">
        {/* Left Sidebar */}
        <aside className="w-48 shrink-0 space-y-6 text-sm">
          {article.views !== undefined && (
            <div>
              <p className="text-gray-500">Visibility</p>
              <p className="font-bold text-lg">{article.views} Views</p>
            </div>
          )}
          {article.downloads !== undefined && (
            <div>
              <p className="text-gray-500">Downloads</p>
              <p className="font-bold text-lg">{article.downloads} Downloads</p>
            </div>
          )}

          <button className="w-full border border-gray-400 rounded px-3 py-2 text-left hover:bg-gray-50">
            🔒 Permissions
          </button>

          <button className="w-full border border-gray-400 rounded px-3 py-2 text-left hover:bg-gray-50">
            ❝ Cite this article
          </button>

          <div>
            <p className="text-gray-500 text-xs mb-1">Citation</p>
            <div className="w-12 h-12 rounded-full border-4 border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
              0
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Article Type Badge */}
          {article.articleType && (
            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded mb-4 uppercase tracking-wide">
              {article.articleType}
            </span>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
            {article.articleTitle}
          </h2>

          {/* Authors */}
          {article.authorsList && article.authorsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700">Author Details:</span>
              {article.authorsList.map((author, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  {author.firstName} {author.lastName}
                </span>
              ))}
            </div>
          )}

          {/* Journal Citation Line */}
          <p className="text-sm text-gray-600 italic mb-2">
            <span className="font-semibold not-italic">{article.journalTitle}.</span>{" "}
            {article.volume}({article.issue})
            {article.page ? `:${article.page}` : ""}
            {onlineYear ? `, ${onlineYear}` : ""}.
            {doiUrl && (
              <>
                {" | "}
                <a href={doiUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline not-italic">
                  {doiUrl}
                </a>
              </>
            )}
          </p>

          {/* PDF Button */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-gray-800 text-gray-800 px-8 py-3 rounded hover:bg-gray-900 hover:text-white transition mb-6"
          >
            View PDF
          </a>

          {/* Abstract */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Abstract</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{stripHtml(article.abstract)}</p>
          </section>

          {/* Keywords */}
          {keywordList.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {keywordList.map((kw, i) => (
                  <span key={i} className="bg-green-50 text-green-800 border border-green-200 text-xs px-3 py-1 rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Back Link */}
          <div className="mt-10">
            <Link
              href={`/archive/volume/${article.volume}/issue/${article.issue}`}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to Issue {article.issue}
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}