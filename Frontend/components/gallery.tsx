"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useInView } from "react-intersection-observer";

// --- DATA DUMMY (Tambahkan judul untuk gambar sorotan) ---
const galleryImages = [
  {
    id: 1,
    src: "/img/gallery/interior1.png",
    alt: "Suasana kerja yang nyaman di Caffeine",
    category: "Interior",
    isFeatured: true,
    title: "Suasana Nyaman & Produktif",
  },
  {
    id: 2,
    src: "/img/gallery/food-1.jpg",
    alt: "Sajian Pizza Pepperoni hangat",
    category: "Makanan & Minuman",
  },
  {
    id: 3,
    src: "/img/gallery/event-1.png",
    alt: "Sesi meetup komunitas developer",
    category: "Event Komunitas",
    isFeatured: true,
    title: "Kolaborasi Tanpa Batas",
  },
  {
    id: 4,
    src: "/img/gallery/interior2.png",
    alt: "Sudut tenang untuk fokus ngoding",
    category: "Interior",
  },
  {
    id: 5,
    src: "/img/gallery/food2.png",
    alt: "Latte art yang dibuat oleh barista kami",
    category: "Makanan & Minuman",
    isFeatured: true,
    title: "Seni dalam Secangkir Kopi",
  },
  {
    id: 6,
    src: "/img/gallery/event-2.png",
    alt: "Peserta workshop interaktif",
    category: "Event Komunitas",
  },
  {
    id: 7,
    src: "/img/gallery/interior3.png",
    alt: "Area komunal untuk kolaborasi tim",
    category: "Interior",
  },
  {
    id: 8,
    src: "/img/gallery/waffle.jpg",
    alt: "Dessert manis untuk menemani kerja",
    category: "Makanan & Minuman",
  },
  {
    id: 9,
    src: "/img/gallery/food5.png",
    alt: "Proses penyeduhan kopi V60",
    category: "Makanan & Minuman",
  },
  {
    id: 10,
    src: "/img/gallery/event-3.png",
    alt: "Networking session setelah acara",
    category: "Event Komunitas",
  },
  {
    id: 11,
    src: "/img/gallery/interior4.png",
    alt: "Rak buku dengan koleksi buku IT",
    category: "Interior",
  },
  {
    id: 12,
    src: "/img/gallery/food4.png",
    alt: "Menu andalan: Nasi Goreng Coder",
    category: "Makanan & Minuman",
    isFeatured: true,
    title: "Energi untuk Setiap Baris Kode",
  },
];

const categories = [
  "Semua",
  "Interior",
  "Makanan & Minuman",
  "Event Komunitas",
];
const IMAGES_PER_PAGE = 8;

// --- KOMPONEN UTAMA ---
export default function Gallery() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [visibleImagesCount, setVisibleImagesCount] = useState(IMAGES_PER_PAGE);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredImages = galleryImages.filter((img) => img.isFeatured);

  const filteredImages = useMemo(() => {
    return activeFilter === "Semua"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter);
  }, [activeFilter]);

  const visibleImages = filteredImages.slice(0, visibleImagesCount);

  // Auto-play untuk featured carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredImages.length);
    }, 5000); // Ganti gambar setiap 5 detik
    return () => clearInterval(timer);
  }, [featuredImages.length]);

  const openLightbox = (index: number) => {
    // Cari index asli dari gambar yang difilter
    const originalIndex = galleryImages.findIndex(
      (img) => img.id === visibleImages[index].id
    );
    setSelectedImageIndex(originalIndex);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  // Navigasi lightbox (menggunakan data asli)
  const goToNext = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToNext, goToPrevious]);

  useEffect(() => {
    setVisibleImagesCount(IMAGES_PER_PAGE);
  }, [activeFilter]);

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

          {/* [FIXED] Featured Carousel */}
          <div className="mb-16 relative w-full h-80 overflow-hidden rounded-2xl shadow-xl">
            {featuredImages.map((image, index) => (
              <div
                key={`featured-${image.id}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === featuredIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover animate-ken-burns"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div
                  className={`absolute bottom-8 left-8 text-white z-10 transition-all duration-700 ease-out ${
                    index === featuredIndex
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wider">
                    Sorotan Utama
                  </p>
                  <h3 className="text-2xl font-bold">{image.title}</h3>
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] h-1 bg-white/20 rounded-full z-10">
              <div
                className="h-full bg-white rounded-full"
                style={{
                  animation: `progress-bar ${
                    featuredImages.length * 5
                  }s linear infinite`,
                }}
              ></div>
            </div>
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

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {visibleImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg shadow-lg gallery-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={500}
                  height={500}
                  className="w-full h-auto transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <Eye
                    size={24}
                    className="text-white absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <p className="text-white text-sm font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {visibleImagesCount < filteredImages.length && (
            <div className="text-center mt-12">
              <button
                onClick={() =>
                  setVisibleImagesCount((prev) => prev + IMAGES_PER_PAGE)
                }
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-full text-white font-semibold transition-transform hover:scale-105 shadow-lg"
              >
                Muat Lebih Banyak
              </button>
            </div>
          )}
        </div>
      </section>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X size={24} />
          </button>
          <button
            onClick={goToPrevious}
            className="absolute left-5 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-5 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={32} />
          </button>

          <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center">
            <Image
              src={galleryImages[selectedImageIndex].src}
              alt={galleryImages[selectedImageIndex].alt}
              width={1600}
              height={900}
              className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center text-white mt-4 p-4 bg-black/20 rounded-b-lg">
              <p className="font-semibold">
                {galleryImages[selectedImageIndex].alt}
              </p>
              <p className="text-sm text-gray-300">
                {galleryImages[selectedImageIndex].category}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1) rotate(0deg);
          }
          100% {
            transform: scale(1.15) rotate(1deg);
          }
        }
        .animate-ken-burns {
          animation: ken-burns 10s ease-out infinite alternate;
        }
        @keyframes progress-bar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        @keyframes gallery-item-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .gallery-item {
          opacity: 0;
          animation: gallery-item-fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: gallery-item-fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
