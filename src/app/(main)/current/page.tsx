'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { MdDescription, MdPictureAsPdf } from "react-icons/md";

// ─── Types ────────────────────────────────────────────────────────────────────
interface IAuthor {
  firstName: string;
  lastName: string;
  orcid?: string;
  correspondingAuthor: 'Yes' | 'No';
}

interface IArticle {
  _id: string;
  journalTitle: string;
  volume: string;
  issue: string;
  doiId?: string;
  articleTitle: string;
  abstract: string;
  keywords?: string;
  authorsList: IAuthor[];
  articlePdfUrl: string;
  supplementaryPdfUrl?: string;
  page?: string;
  articleType?: string;
  accessType: 'Open' | 'Restricted';
  receivedDate?: string;
  acceptedDate?: string;
  onlineDate?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  displayOrder?: number;
}

// ✅ Populated articleId object — homepage model ke saath match karta hai
interface IPopularArticleId {
  _id: string;
  articleTitle: string;
  articleType?: string;
  abstract?: string;
  volume: string | number;
  issue: string | number;
  journalTitle?: string;
}

interface IMostPopular {
  _id: string;
  articleId: IPopularArticleId | null;
  customSummary?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatAuthors(authors: IAuthor[]) {
  return authors.map((a) => `${a.firstName} ${a.lastName}`).join(', ');
}

function stripHtml(html?: string) {
  if (!html) return '';
  return html
    .replace(/<\/?[^>]+(>|$)/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, maxLen = 150) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function IconDoc() {
  return (
    <MdDescription className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:underline" size={14} />
  );
}

function IconPdf() {
  return (
    <MdPictureAsPdf className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:underline" size={14} />
  );
}

// ─── Article Row ──────────────────────────────────────────────────────────────
function ArticleRow({ article }: { article: IArticle }) {
  const articleHref = `/archive/volume/${article.volume}/issue/${article.issue}/article/${article._id}`;

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <a
        href={articleHref}
        className="text-blue-500 font-semibold text-[14.5px] leading-snug hover:underline block mb-1"
      >
        {article.articleTitle}
      </a>
      <p className="text-[13px] text-[#444] mb-2">
        <span className="font-semibold text-[#333]">Author details: </span>
        {formatAuthors(article.authorsList)}
      </p>
      {article.articleType?.toLowerCase() && article.abstract && (
        <p className="text-[12.5px] text-[#555] leading-relaxed mb-2">
          {truncate(stripHtml(article.abstract), 220)}
        </p>
      )}
      <div className="flex items-center gap-4 mt-1">
        <a href={articleHref} className="inline-flex items-center text-blue-600 text-[12.5px] font-medium hover:underline gap-1">
          <IconDoc /> Abstract
        </a>
        <a
          href={`/api/pdf/${article.articlePdfUrl}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center text-blue-600 gap-1 text-[12.5px] font-medium hover:underline"
        >
          <IconPdf /> PDF
        </a>
      </div>
    </div>
  );
}

// ─── Most Popular Card — homepage jaisi exact style ───────────────────────────
function PopularCard({ item }: { item: IMostPopular }) {
  const real = item.articleId;
  if (!real) return null;

  const href = `/archive/volume/${real.volume}/issue/${real.issue}/article/${real._id}`;

  // customSummary prefer karo, warna abstract se truncate
  const summary = item.customSummary?.trim()
    ? truncate(item.customSummary, 150)
    : truncate(stripHtml(real.abstract || ''), 150);

  return (
    // ✅ Exact same structure jo homepage PopularCard use karta hai
    <div className="space-y-1.5">
      {real.articleType && (
        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-[#4caf50] text-white">
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
      {real.journalTitle && (
        <p className="text-[11px] text-slate-400 italic">{real.journalTitle}</p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CurrentIssuePage() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [mostPopular, setMostPopular] = useState<IMostPopular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesRes, homepageRes] = await Promise.all([
          fetch('/api/articles'),
          // ✅ populate=true se articleId real data ke saath aayega
          fetch('/api/homepage?populate=true'),
        ]);

        if (!articlesRes.ok) throw new Error('Failed to fetch articles');
        const articlesData = await articlesRes.json();

        // ✅ API already displayOrder se sorted bhejta hai — frontend mein sort ki zaroorat nahi
        setArticles(articlesData.user || []);

        if (homepageRes.ok) {
          const homepageData = await homepageRes.json();
          setMostPopular(homepageData?.data?.mostPopular || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ── Derive latest volume & issue ──
  const activeArticles = articles.filter((a) => a.status === 'Active');

  const latestVolume = activeArticles.reduce((max, a) =>
    parseInt(a.volume) > parseInt(max) ? a.volume : max, '0');

  const articlesInLatestVolume = activeArticles.filter((a) => a.volume === latestVolume);

  const latestIssue = articlesInLatestVolume.reduce((max, a) =>
    parseInt(a.issue) > parseInt(max) ? a.issue : max, '0');

  // ✅ API se already displayOrder sorted aa raha hai — yahan sirf filter + page sort
  const currentIssueArticles = articlesInLatestVolume
    .filter((a) => a.issue === latestIssue)
    .sort((a, b) => {
      // displayOrder pehle, phir page number fallback
      const oa = a.displayOrder ?? 9999;
      const ob = b.displayOrder ?? 9999;
      if (oa !== ob) return oa - ob;
      return (parseInt(a.page?.split('-')[0] || '0') - parseInt(b.page?.split('-')[0] || '0'));
    });

  // Group by articleType — insertion order preserve karo
  const grouped = currentIssueArticles.reduce<Record<string, IArticle[]>>((acc, article) => {
    const type = article.articleType || 'Articles';
    if (!acc[type]) acc[type] = [];
    acc[type].push(article);
    return acc;
  }, {});

  const onlineYear = currentIssueArticles[0]?.onlineDate
    ? new Date(currentIssueArticles[0].onlineDate).getFullYear()
    : new Date().getFullYear();

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#5cb85c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400">Loading current issue...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  // ── Empty ──
  if (currentIssueArticles.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">No articles published yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans antialiased">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT: Main content ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#f0f0f0] border border-gray-300 px-4 py-3 mb-4">
              <p className="text-[14px] font-bold text-[#333]">
                Volume {latestVolume}, Issue {latestIssue}, Year {onlineYear}, No of articles {currentIssueArticles.length}
              </p>
            </div>

            {Object.entries(grouped).map(([type, typeArticles]) => (
              <div key={type} className="mb-4">
                <div className="bg-[#f0f0f0] border border-gray-300 border-b-2 border-b-[#5cb85c] px-4 py-2">
                  <h2 className="text-[14px] font-bold text-[#333]">{type}</h2>
                </div>
                <div className="bg-white border border-t-0 border-gray-300 px-4">
                  {typeArticles.map((article) => (
                    <ArticleRow key={article._id} article={article} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── RIGHT: Most Popular — homepage jaisi exact style ── */}
          <div className="w-full lg:w-[300px] shrink-0">
            {/* ✅ Same card style as homepage right sidebar */}
            <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 border-l-4 border-[#4caf50] pl-2 mb-4">
                Most Popular
              </h3>
              {mostPopular.length > 0 ? (
                <div className="space-y-5">
                  {mostPopular.map((item) => (
                    <PopularCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No popular articles set yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}