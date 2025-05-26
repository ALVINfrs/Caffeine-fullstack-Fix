"use client";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import Menu from "@/components/menu";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { Suspense } from "react";
import Loading from "@/components/loading";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Suspense fallback={<Loading />}>
        <Menu />
      </Suspense>
      <Contact />
      <Footer />
    </main>
  );
}
