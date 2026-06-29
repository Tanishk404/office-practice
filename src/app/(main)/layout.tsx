import React from "react";

import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";

import Floatingshare from "@/components/Share";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-grow">
        <Floatingshare />
        <Nav />
        {children}
      <Footer />
      </main>
    </>
  );
}