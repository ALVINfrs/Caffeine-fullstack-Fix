"use client";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import Menu from "@/components/menu";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { Suspense } from "react";
import Loading from "@/components/loading";
import Faq from "@/components/faq";
import PersonalizedSection from "@/components/PersonalizedSection";
import TestimonialSliderNative from "@/components/testimoni";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PersonalizedSection />
      <About />
      <Suspense fallback={<Loading />}>
        <Menu />
      </Suspense>
      <Faq />
      <TestimonialSliderNative />
      <Contact />
      <Footer />
    </main>
  );
}
