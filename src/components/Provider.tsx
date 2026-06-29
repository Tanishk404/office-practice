"use client";
import FooterImg from "@/context/FooterImg";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <FooterImg>{children}</FooterImg>;
}