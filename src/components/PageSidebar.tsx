"use client";

import React, { useState, useEffect } from "react";

interface Heading {
  id: string;
  text: string;
}

interface Props {
  headings: Heading[];
  mode?: "headings" | "persons";
}

export default function PageSidebar({ headings, mode = "headings" }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Sabse upar wala visible entry active hogi
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Smooth scroll
      const y = el.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setMobileOpen(false);
    }
  };

  const activeText = headings.find((h) => h.id === activeId)?.text ?? "Contents";

  const NavList = () => (
    <nav className="w-full" aria-label="Page sections">
      {headings.map(({ id, text }) => {
        const isActive = activeId === id;
        return (
          <div key={id} className="border-b border-slate-100 last:border-b-0">
            <button
              onClick={() => handleClick(id)}
              className={`w-full text-left py-[9px] px-3 text-[13px] leading-snug transition-colors duration-100 ${
                isActive
                  ? "border-l-[3px] border-blue-600 pl-[9px] bg-blue-50 text-blue-700 font-semibold"
                  : "text-[#1a73e8] hover:bg-slate-50 hover:text-blue-800"
              }`}
            >
              {text}
            </button>
          </div>
        );
      })}
    </nav>
  );

  if (headings.length === 0) return null;

  return (
    <>
      {/* ── Mobile: collapsible ── */}
      <div className="lg:hidden w-full border border-slate-200 rounded-sm mb-5">
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 text-[13.5px] font-semibold text-slate-700 border-b border-slate-200"
          aria-expanded={mobileOpen}
        >
          <span className="truncate pr-2">{mobileOpen ? "Contents" : activeText}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileOpen && <div className="bg-white"><NavList /></div>}
      </div>

      {/* ── Desktop: full list, no scroll on sidebar ── */}
      <div className="hidden lg:block w-full border border-slate-200 rounded-sm bg-white">
        <NavList />
      </div>
    </>
  );
}