import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

function Artical() {
  return (
    <div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
        
     
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
            <div className="bg-[#e9ecef] border-b-2 border-[#4caf50] px-4 py-2 font-bold text-sm text-slate-800">
              Current Issue
            </div>
            <div className="p-4 flex flex-col sm:flex-row gap-6">

              <Image alt='book_img' className='rounded' src={'/Book_img.png'}
              width={150} height={20} />

              <div className="text-[13px] text-slate-700 space-y-1.5 leading-normal">
                <p><strong>ISSN (Print):</strong> 2581-8236</p>
                <p><strong>Online ISSN:</strong> 2581-916X</p>
                <p><strong>CODEN:</strong> IIJNAQ</p>
                <p className="text-justify text-slate-600 text-[15px] pt-1">
                  <strong>About: </strong>
                  
                  IP Indian Journal of Neurosciences (IJN) is an open access, peer-reviewed medical quarterly journal, published since 2015 under the auspices of the Khyati Education and Research Foundation (KERF), which aims to uplift researchers, scholars, academicians, and professionals in all academic and scienti <span className="text-[#025a9c] cursor-pointer hover:underline ">
                    <Link href={'/about'} >
                    more...
                  </Link> 
                  </span>
                </p>
                <div className="pt-2">
                  <a href="#" className="text-blue-600 hover:underline font-semibold text-xl"> Subscribe to eTOC Alerts</a>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-[#e9ecef] border-b-2 border-[#4caf50] px-4 py-2 font-bold text-sm text-slate-800 rounded-t">
            Current Issue Highlights
          </div>

          <section className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
            <div className='bg-[#e9ecef] border-b-2 border-[#4caf50] px-4 py-2 font-bold text-sm text-slate-800 rounded-t'>Editorial</div>
          </section>
            <div>
                <Link href='/' className='text-md hover:underline text-blue-500 font-bold' >Reforming medical education—Beyond the textbook and into the clinical trenches</Link>

                <p className='font-bold text-gray-700' >Author details: <span className='text-sm text-gray-500' > Rajarshi Chakraborty</span>
                <br></br>
<span className='italic text-gray-500 text-sm font-medium' >IP Indian Journal of Neurosciences. 12(1):1-2, 2026.</span>
</p>


<p className='font-bold' >DOI: <Link className='text-blue-500 text-sm' href={'/'}>https://doi.org/10.18231/j.ijn.15329.1775124437</Link></p>
            </div>

          <section className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
            <div className="bg-[#e9ecef] border-b border-slate-200 px-4 py-1.5 font-bold text-xs text-slate-700 uppercase tracking-wide">Review Article</div>
            
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-l-4 border-[#4caf50] pl-2 mb-4">Indexing</h3>
            <div className="py-2 px-1 text-center font-bold text-lg text-slate-400 border border-dashed border-slate-200 rounded bg-slate-50">
              <span className="text-blue-600">G</span><span className="text-red-500">o</span><span className="text-amber-500">o</span><span className="text-blue-600">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span> Scholar
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 border-l-4 border-[#4caf50] pl-2 mb-4">Most Popular</h3>
            <div className="space-y-5">
    
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Artical