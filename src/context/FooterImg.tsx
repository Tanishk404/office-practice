"use client"
import React, { createContext, useState } from 'react'


export const ProviderOfImg = createContext<any>(null)


function FooterImg({children}: {children: React.ReactNode}) {
    const [CoverImg, setCoverImg] = useState<any>('/Book_img.png')
  return (
    <ProviderOfImg.Provider value={{CoverImg, setCoverImg}}  >
        {children}
    </ProviderOfImg.Provider>
  )
}

export default FooterImg