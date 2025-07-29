"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

// Data Testimoni (Sama seperti sebelumnya)
const testimonialsData = [
  {
    id: 1,
    quote:
      "Koneksi WiFi-nya beneran sekencang klaimnya! Ngerjain project frontend jadi lancar jaya. Kopi dan suasananya juga juara.",
    name: "Budi Santoso",
    role: "Frontend Developer",
    avatar: "/img/team/budi.jpg",
    stars: 5,
  },
  {
    id: 2,
    quote:
      "Sebagai freelancer UI/UX, saya butuh tempat yang inspiratif. Caffeine punya semua: playlist lo-fi, pencahayaan bagus, dan komunitas yang suportif.",
    name: "Eka Prasetya",
    role: "UI/UX Freelancer",
    avatar: "/img/team/eka.jpg",
    stars: 5,
  },
  {
    id: 3,
    quote:
      "Awalnya ragu, tapi 'Paket Sprint' untuk kerja kelompok benar-benar worth it. Meja besar, pizza enak, dan minuman yang bikin melek.",
    name: "Siti Rahmawati",
    role: "Backend Developer",
    avatar: "/img/team/siti.jpg",
    stars: 4,
  },
  {
    id: 4,
    quote:
      "Signature coffee 'The Kernel Panic' itu bukan gimmick, beneran nendang! Tempat terbaik di Depok untuk ngoding sambil menikmati kopi berkualitas.",
    name: "Ayu Lestari",
    role: "Head Barista",
    avatar: "/img/team/ayu.jpg",
    stars: 5,
  },
];

// Komponen Bintang untuk Rating
const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-1 text-amber-400">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={18} fill={i < count ? "currentColor" : "none"} />
    ))}
  </div>
);

// Komponen Utama Slider Testimoni (Versi Native)
export default function TestimonialSliderNative() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Fungsi untuk ke slide berikutnya
  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === testimonialsData.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  // Fungsi untuk ke slide sebelumnya
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? testimonialsData.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Fungsi untuk ke slide spesifik via dot
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  // Efek untuk autoplay
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => goToNext(), 4000); // Ganti slide setiap 4 detik

    return () => {
      resetTimeout();
    };
  }, [currentIndex, goToNext]);

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Apa Kata Para Developer
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Kisah-kisah sukses yang lahir dari secangkir kopi di Caffeine.
          </p>
        </div>

        <div className="relative max-w-xl mx-auto h-[420px]">
          {/* Container untuk semua slide */}
          <div className="w-full h-full rounded-2xl overflow-hidden">
            {testimonialsData.map((testimonial, slideIndex) => (
              <div
                key={testimonial.id}
                className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out"
                style={{ opacity: slideIndex === currentIndex ? 1 : 0 }}
              >
                <div className="h-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col">
                  <Quote className="w-10 h-10 text-amber-300 dark:text-amber-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <StarRating count={testimonial.stars} />
                    <div className="flex items-center mt-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Navigasi */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-800 dark:text-white hover:bg-gray-100 transition z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-800 dark:text-white hover:bg-gray-100 transition z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indikator Titik (Dots) */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonialsData.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                slideIndex === currentIndex
                  ? "bg-amber-500 scale-125"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
