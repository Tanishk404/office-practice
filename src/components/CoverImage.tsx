// src/components/CoverImageSync.tsx
'use client';
import { useContext, useEffect } from 'react';
import { ProviderOfImg } from '@/context/FooterImg';

export default function CoverImageSync({ imageUrl }: { imageUrl: string }) {
  const { setCoverImg } = useContext(ProviderOfImg);

  useEffect(() => {
    if (imageUrl) {
      setCoverImg(imageUrl);
    }
  }, [imageUrl, setCoverImg]);

  return null; // This component is invisible; it only handles logic
}