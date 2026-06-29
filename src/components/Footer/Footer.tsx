"use client"

import React, { useContext } from 'react'
import Image from 'next/image'
import { ProviderOfImg } from '@/context/FooterImg'

function Footer() {
  const { CoverImg, setCoverImg } = useContext(ProviderOfImg)
  console.log("Footer CoverImg:", CoverImg)

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-12">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-100">

        {/* Left — Cover Image + Journal Info */}
        <div className="flex flex-col xs:flex-row gap-4 items-start">
          <div className="shrink-0">
            <Image height={100} width={100} alt='img' src={CoverImg} className="object-contain" />
          </div>
          <div className="space-y-1 text-[13px]">
            <h4 className="font-bold text-slate-800 text-[14px]">IP Indian Journal of Neurosciences</h4>
            <p><strong>ISSN (Online):</strong> 2581-916X</p>
            <p><strong>ISSN (Print):</strong> 2581-8236</p>
            <p><strong>CODEN:</strong> IIJNAQ</p>
            <p><strong>Publisher:</strong> <span className="text-[#025a9c] cursor-pointer hover:underline">IP Innovative Publication</span></p>
          </div>
        </div>

        {/* Right — Licensing */}
        <div className="text-[13px] text-justify leading-relaxed">
          <h4 className="font-bold text-slate-800 text-[14px] mb-1">Licensing & Access</h4>
          <p className="text-slate-600">
            This journal is licensed under: <br />
            <span className="text-[#025a9c] cursor-pointer hover:underline font-medium">Creative Commons Attribution-NonCommercial-ShareAlike</span>
          </p>
          <p className="text-black text-[12px] mt-1 max-w-full sm:max-w-sm">
            Allows others to distribute, remix, adapt, and build upon the work for non-commercial purposes, as long as they credit the creator and license their new creations under the same terms.
          </p>
          <div className="inline-flex gap-1 items-center bg-slate-100 p-1 border border-slate-200 text-[9px] rounded font-mono font-bold mt-2 text-slate-500">
            <Image alt='img' width={100} height={100} src={'/Footer_Img.png'} />
          </div>
        </div>

      </div>

      {/* Middle — Nav Links */}
      <div className="max-w-7xl mx-auto py-4 px-4 flex flex-wrap justify-center gap-x-4 gap-y-2 font-medium text-[#025a9c] border-b border-slate-100 text-[13px]">
        {['Home', 'About', 'Archive', 'Current Issue', 'Subscription', 'Legal Disclaimer'].map((fLink) => (
          <a key={fLink} href="#" className="hover:underline">{fLink}</a>
        ))}
      </div>

      {/* Bottom — Copyright */}
      <div className="max-w-7xl mx-auto py-6 px-4 text-center text-slate-500 text-[13px] space-y-1">
        <p className='text-black'>© 2026 <strong className='text-black'>IP Indian Journal of Neurosciences</strong></p>
        <p className='text-black'>
          Published by <strong className='text-black'>IP Innovative Publication Pvt. Ltd.</strong> (
          <a href="https://www.ipinnovative.com" target="_blank" rel="noreferrer" className="text-[#025a9c] hover:underline">
            www.ipinnovative.com
          </a>)
        </p>
      </div>

    </footer>
  )
}

export default Footer