import React from 'react';
import { ALL_ARTICLES, POPULAR_ARTICLES } from '@/models/Articles';
export default function SidebarArticle({ category, title, text, source }) {
  return (
    <div className="border-b border-slate-100 pb-4 last:border-none last:pb-0">
      <span className="bg-[#4caf50] text-white font-bold text-[9px] uppercase px-1.5 py-0.5 rounded-sm tracking-wider inline-block">
        {category}
      </span>
      <h4 className="text-[#025a9c] hover:underline font-bold text-[13.5px] mt-1.5 leading-tight cursor-pointer">
        {title}
      </h4>
      <p className="text-[12px] text-slate-500 mt-1 line-clamp-3 leading-relaxed text-justify">
        {text}
      </p>
      <div className="text-[11px] italic text-slate-400 mt-1">{source}</div>
    </div>
  );
}