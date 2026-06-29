"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

export interface IssueGroup {
  issue: string;
  year: number | string;
  count: number;
}

export interface VolumeGroup {
  volume: string;
  year: number | string;
  issues: IssueGroup[];
}

export default function ArchiveAccordion({ volumes }: { volumes: VolumeGroup[] }) {
  // Latest volume (first item — list arrives pre-sorted descending) is open by default,
  // matching the existing design where the current volume is expanded on load.
  const [openVolume, setOpenVolume] = useState<string | null>(volumes[0]?.volume ?? null);

  const toggle = (vol: string) =>
    setOpenVolume((prev) => (prev === vol ? null : vol));

  if (volumes.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg bg-white">
        No archive data yet. Articles will appear here once added.
      </div>
    );
  }



  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm divide-y divide-gray-100 overflow-hidden">
      {volumes.map((v) => {
        const isOpen = openVolume === v.volume;
     
        return (
          <div key={v.volume}>
            <button
              onClick={() => toggle(v.volume)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-gray-800 text-[15px]">
                Volume - {v.volume}, Year - {v.year}
              </span>
              {isOpen ? (
                <MdExpandLess className="text-gray-500" size={20} />
              ) : (
                <MdExpandMore className="text-gray-500" size={20} />
              )}
            </button>

            {isOpen && (
  
              <ul className="px-8 pb-4 space-y-2 list-disc">
                {v.issues.map((iss) => (
                  <li key={iss.issue} className="text-[15px]">
                    <Link
                      href={`/archive/volume/${encodeURIComponent(v.volume)}/issue/${encodeURIComponent(iss.issue)}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                    
                      Issue {iss.issue} - {iss.year}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}