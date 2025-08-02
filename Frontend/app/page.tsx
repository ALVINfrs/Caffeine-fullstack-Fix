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
import EventsHub from "@/components/events-hub";
import Gallery from "@/components/gallery";
import CoffeeLab from "@/components/coffeelab";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PersonalizedSection />
      <About />
      <CoffeeLab />
      <Suspense fallback={<Loading />}>
        <Menu />
      </Suspense>
      <Faq />
      <TestimonialSliderNative />
      <EventsHub />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
