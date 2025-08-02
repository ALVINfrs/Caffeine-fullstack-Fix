"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from "react-intersection-observer";

// --- DATA DUMMY UNTUK GALERI ---
// Anda bisa dengan mudah menambah atau mengubah gambar di sini
// Pastikan semua gambar ada di folder /public/img/gallery/
const galleryImages = [
  {
    id: 1,
    src: "/img/gallery/interior-1.jpg",
    alt: "Suasana kerja yang nyaman di Caffeine",
    category: "Interior",
  },
  {
    id: 2,
    src: "/img/gallery/food-1.jpg",
    alt: "Sajian Pizza Pepperoni hangat",
    category: "Makanan & Minuman",
  },
  {
    id: 3,
    src: "/img/gallery/event-1.jpg",
    alt: "Sesi meetup komunitas developer",
    category: "Event Komunitas",
  },
  {
    id: 4,
    src: "/img/gallery/interior-2.jpg",
    alt: "Sudut tenang untuk fokus ngoding",
    category: "Interior",
  },
  {
    id: 5,
    src: "/img/gallery/coffee-1.jpg",
    alt: "Latte art yang dibuat oleh barista kami",
    category: "Makanan & Minuman",
  },
  {
    id: 6,
    src: "/img/gallery/event-2.jpg",
    alt: "Peserta workshop interaktif",
    category: "Event Komunitas",
  },
  {
    id: 7,
    src: "/img/gallery/interior-3.jpg",
    alt: "Area komunal untuk kolaborasi tim",
    category: "Interior",
  },
  {
    id: 8,
    src: "/img/gallery/food-2.jpg",
    alt: "Dessert manis untuk menemani kerja",
    category: "Makanan & Minuman",
  },
];

const categories = [
  "Semua",
  "Interior",
  "Makanan & Minuman",
  "Event Komunitas",
];

// --- KOMPONEN UTAMA ---
export default function Gallery() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const filteredImages =
    activeFilter === "Semua"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex + 1) % filteredImages.length
    );
  };

  const goToPrevious = () => {
    setSelectedImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + filteredImages.length) % filteredImages.length
    );
  };

  return (
    <>
      <section
        ref={ref}
        id="gallery"
        className="py-20 sm:py-24 bg-white dark:bg-gray-900/50"
      >
        <div
          className={`container mx-auto px-4 transition-all duration-1000 ease-out ${
            inView ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <Camera className="w-8 h-8 text-amber-500" />
              Galeri{" "}
              <span className="text-amber-600 dark:text-amber-500">
                Caffeine
              </span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Lihat lebih dekat suasana, hidangan, dan momen spesial di basecamp
              kami.
            </p>
          </div>

          {/* Filter Kategori */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  activeFilter === category
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* [BARU] Masonry Grid Layout */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className="break-inside-avoid cursor-pointer group relative"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <p className="text-white text-center text-sm font-semibold p-2">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* [BARU] Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-5 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-5 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={32} />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full">
            <Image
              src={filteredImages[selectedImageIndex].src}
              alt={filteredImages[selectedImageIndex].alt}
              width={1200}
              height={800}
              className="w-full h-full object-contain"
            />
            <p className="text-center text-white mt-4 text-sm">
              {filteredImages[selectedImageIndex].alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
