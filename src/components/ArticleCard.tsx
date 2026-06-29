import React from 'react';
import Link from 'next/link';
import { MdDescription, MdPictureAsPdf } from "react-icons/md";

interface ArticleCardProps {
  id: string;
  title: string;
  authors: string;
  journalInfo: string;
  doi: string;
  abstract?: string;
  hasAbstract: boolean;
}

export default function ArticleCard({
  id,
  title,
  authors,
  journalInfo,
  doi,
  abstract,
  hasAbstract,
}: ArticleCardProps) {
  return (
    <div className="bg-white p-5 border-b border-slate-100 last:border-none hover:bg-slate-50/40 transition-colors font-sans">
      <Link 
        href={`/article/${id}`} 
        className="text-[#005699] hover:underline font-bold text-[16px] leading-snug block"
      >
        {title}
      </Link>
      
      <div className="mt-2 text-[13px] text-slate-700">
        <span className="font-bold text-slate-800">Author details: </span>{authors}
      </div>
      
      <div className="text-[13px] text-slate-500 mt-1">
        {journalInfo}
      </div>
      
      <div className="text-[13px] text-slate-700 mt-1">
        <span className="font-bold text-slate-800">DOI: </span>
        <Link 
          href={doi} 
          target="_blank" 
          rel="noreferrer" 
          className="text-[#005699] hover:underline break-all"
        >
          {doi}
        </Link>
      </div>
      
      {abstract && (
        <p className="text-[13px] text-slate-600 mt-2.5 leading-relaxed text-justify">
          {abstract}
        </p>
      )}
      
      <div className="flex items-center gap-4 mt-3 text-[13px] font-medium text-[#005699]">
        {hasAbstract && (
          <Link 
            href={`/article/${id}`} 
            className="flex items-center gap-1 hover:text-sky-900"
          >
            <MdDescription className="text-[12px]" /> Abstract
          </Link>
        )}
        <button className="flex items-center gap-1 hover:text-sky-900 transition-colors">
          <MdPictureAsPdf className="text-[12px]" /> PDF
        </button>
      </div>
    </div>
  );
}