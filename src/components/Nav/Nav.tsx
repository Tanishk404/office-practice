"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown } from 'react-icons/io';
import { MdOutlineArrowOutward } from 'react-icons/md';
import clsx from 'clsx';

interface SubItem {
  label: string;
  slug: string;
  isExternal?: boolean;
}

interface NavMenuItem {
  _id: string;
  title: string;
  type: "dropdown" | "single";
  slug?: string;
  isExternal?: boolean;
  items: SubItem[];
}

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<NavMenuItem[]>([]);

  useEffect(() => {
    fetch("/api/nav")
      .then((r) => r.json())
      .then((data) => { if (data.success) setMenuData(data.menus); })
      .catch(() => {});
  }, []);

  const closeAll = () => { setIsOpen(false); setActiveDropdown(null); };
  const toggleMenu = () => { setIsOpen((p) => !p); setActiveDropdown(null); };
  const toggleDropdown = (id: string) =>
    setActiveDropdown((cur) => (cur === id ? null : id));

  return (
    <div className="w-full font-sans shadow-sm select-none">

      {/* TOP HEADER */}
      <div className="bg-[#5cb85c] w-full px-4 py-4 flex flex-col lg:flex-row items-center justify-around gap-4 lg:gap-8">
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 text-white w-full lg:w-auto">
          <Image className="rounded-full border border-white/20 shadow-sm shrink-0" alt="KERF Logo"
            src="/kerf-logo5.jpg" width={60} height={60} priority />
          <div>
            <h1 className="text-lg sm:text-xl lg:text-[23px] font-bold tracking-tight leading-tight">
              IP Indian Journal of Neurosciences
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50/90 mt-0.5">
              Official Publication of Khyati Education and Research Foundation
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-center lg:justify-end">
          <div className="flex items-center w-full max-w-xs relative">
            <input className="p-2 bg-white text-[13px] text-black rounded border-0 focus:outline-none w-full h-9 pr-10"
              type="text" placeholder="Search..." />
            <button className="absolute right-0 h-9 px-3 text-slate-500 hover:text-black transition-colors flex items-center justify-center"
              aria-label="Submit Search" type="button">
              <FaSearch size={13} />
            </button>
          </div>
          <div className="bg-white p-1 rounded shrink-0 shadow-sm border border-slate-100 mx-auto sm:mx-0">
            <Image className="rounded-sm" alt="Innovative Publication" src="/ip-cp-logo.png"
              width={85} height={34} style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      {/* NAV ROW */}
      <div className="bg-[#212529] text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between lg:justify-start relative">

          {/* Hamburger */}
          <button type="button" aria-label="Toggle navigation" aria-expanded={isOpen}
            onPointerUp={(e) => { e.preventDefault(); toggleMenu(); }}
            className="lg:hidden my-2.5 p-3 border border-zinc-700 rounded text-zinc-300 hover:text-white transition-colors touch-manipulation cursor-pointer"
            style={{ WebkitTapHighlightColor: 'transparent' }}>
            {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          <div className={clsx(
            "absolute lg:relative top-full left-0 w-full lg:w-auto bg-[#212529] border-t border-zinc-800 lg:border-t-0 z-50 text-[13px]",
            isOpen ? "flex flex-col" : "hidden lg:flex lg:flex-row"
          )}>

            {/* Home — always first */}
            {/* <Link href="/" onClick={closeAll}
              className="px-3 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 lg:border-b-0 lg:border-r lg:border-zinc-800/60 font-medium whitespace-nowrap">
              Home
            </Link> */}

            {/* Dynamic menus from DB */}
            {menuData.map((menu) => {

              // ── SINGLE LINK (no dropdown) ──────────────────────────────
              if (menu.type === "single") {
                const href = menu.slug || "/";
                if (menu.isExternal) {
                  return (
                    <a key={menu._id} href={href} target="_blank" rel="noopener noreferrer"
                      onClick={closeAll}
                      className="px-3 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 lg:border-b-0 lg:border-r lg:border-zinc-800/60 whitespace-nowrap">
                      {menu.title}
                    </a>
                  );
                }
                return (
                  <Link key={menu._id} href={href} onClick={closeAll}
                    className="px-3 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 lg:border-b-0 lg:border-r lg:border-zinc-800/60 whitespace-nowrap">
                    {menu.title}
                  </Link>
                );
              }

              // ── DROPDOWN ───────────────────────────────────────────────
              return (
                <div key={menu._id} className="relative w-full lg:w-auto">
                  <button type="button"
                    onPointerUp={(e) => { e.preventDefault(); toggleDropdown(menu._id); }}
                    className="w-full px-3 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 lg:border-b-0 lg:border-r lg:border-zinc-800/60 flex items-center justify-between lg:justify-start gap-1 whitespace-nowrap touch-manipulation cursor-pointer"
                    style={{ WebkitTapHighlightColor: 'transparent' }}>
                    <span>{menu.title}</span>
                    <IoMdArrowDropdown size={16}
                      className={clsx("text-slate-400 transition-transform shrink-0", activeDropdown === menu._id && "rotate-180")} />
                  </button>

                  {activeDropdown === menu._id && (
                    <div className="bg-[#f8f9fa] text-slate-700 py-2 lg:absolute left-0 lg:top-full w-full lg:w-52 lg:rounded-xl lg:shadow-lg border border-gray-300 flex flex-col z-50 text-sm lg:mt-1">
                      {menu.items.map((sub, idx) =>
                        sub.isExternal ? (
                          <a key={idx} href={sub.slug} target="_blank" rel="noopener noreferrer"
                            onClick={closeAll}
                            className="px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors font-bold text-start text-gray-500 block">
                            {sub.label}
                          </a>
                        ) : (
                          <Link key={idx} href={sub.slug} onClick={closeAll}
                            className="px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors font-bold text-start text-gray-500 block">
                            {sub.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile Submit Button */}
            <Link href="https://www.mprp.in/journals/IJN" onClick={closeAll}
              className="lg:hidden mx-4 my-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-center rounded text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors">
              Submit Manuscript <MdOutlineArrowOutward size={14} />
            </Link>
          </div>

          {/* Desktop Submit Button */}
          <Link href="https://www.mprp.in/journals/IJN"
            className="hidden lg:flex items-center ml-auto px-4 py-[13px] bg-zinc-800 hover:bg-zinc-700 text-[13px] font-semibold gap-1 transition-colors text-white whitespace-nowrap shrink-0">
            Submit Manuscript <MdOutlineArrowOutward size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}