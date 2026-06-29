"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { MdDescription, MdPictureAsPdf } from "react-icons/md";

interface Author {
  firstName: string;
  lastName: string;
}

interface Article {
  _id: string;
  articleTitle: string;
  authorsList?: Author[];
  articleType?: string;
  doiId?: string;
  abstract?: string;
  articlePdfUrl?: string;
  volume: number;   // ← naya field
  issue: number;    // ← naya field
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(text: string, max = 280): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export default function IssueArticleCard({ article }: { article: Article }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // ─── Article detail page URL ───────────────────────────────────────────────
  // const articleUrl = `/archive/volume/${article.volume}/issue/${article.issue}/article/${article._id}`;

  const articleUrl = `/archive/volume/${article.volume}/issue/${article.issue}/article/${article._id}`;

  console.log('Pdf url: ', article.articlePdfUrl)

  const authorNames =
    article.authorsList
      ?.map((au) => `${au.firstName} ${au.lastName}`.trim())
      .filter(Boolean)
      .join(", ") || "";

  const abstractHtml = article.abstract || "";
  const excerpt = truncate(stripHtml(abstractHtml));

  const doiUrl = article.doiId
    ? article.doiId.startsWith("http")
      ? article.doiId
      : `https://doi.org/${article.doiId}`
    : null;

  return (
    <div className="px-4 py-4 space-y-1.5">

      {/* ── Title → article detail page ────────────────────────────────────── */}
      <h3
        onClick={() => router.push(articleUrl)}
        className="text-[16px] font-bold text-[#1e88e5] hover:underline cursor-pointer leading-snug"
      >
        {article.articleTitle}
      </h3>

      {authorNames && (
        <p className="text-[13px] text-slate-700">
          <span className="font-semibold">Author details:</span> {authorNames}
        </p>
      )}

      {article.articleType && (
        <p className="text-[13px] text-slate-700">
          <span className="font-semibold">Article type:</span> {article.articleType}
        </p>
      )}

      {doiUrl && (
        <p className="text-[13px] text-slate-700">
          <span className="font-semibold">DOI:</span>{" "}
          <a
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {doiUrl}
          </a>
        </p>
      )}

      {/* ── Excerpt (collapsed preview) ─────────────────────────────────────── */}
      {!expanded
        ? excerpt && (
            <p className="text-[13px] text-slate-600 mt-1">{excerpt}</p>
          )
        : (
          <div
            className="text-[13px] text-slate-700 mt-1 prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: abstractHtml }}
          />
        )}

      {/* ── Action buttons ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-2">

        {/* Abstract button → article detail page #abstract section pe scroll */}
        <button
          onClick={() => router.push(`${articleUrl}#abstract`)}
          className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:underline"
        >
          <MdDescription size={15} /> Abstract
        </button>

        {/* Toggle: inline preview bhi rakhna ho toh yeh button */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-[13px] font-semibold text-slate-500 hover:underline"
        >
          {expanded ? "Hide preview" : "Quick preview"}
        </button>

        {article.articlePdfUrl && (
    
          <a
            href={`${articleUrl}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:underline"
          >
            <MdPictureAsPdf size={15} /> PDF
          </a>
        )}
      </div>
    </div>
  );
}