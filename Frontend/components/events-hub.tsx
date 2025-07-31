"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Calendar,
  Users,
  Mic,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

// --- DATA DUMMY UNTUK EVENT ---
// Nantinya, ini bisa Anda fetch dari backend
const eventsData = [
  {
    id: 1,
    title: "Meetup Komunitas Next.js Indonesia",
    date: "2025-08-15",
    time: "19:00 WIB",
    type: "Meetup",
    speaker: "Budi Santoso, Lead Frontend",
    image: "/img/events/meetup-nextjs.png", // Pastikan gambar ada di /public/img/events/
    description:
      "Diskusi mendalam tentang fitur-fitur terbaru di Next.js 15, App Router, dan Server Actions.",
  },
  {
    id: 2,
    title: "Workshop: Docker untuk Pemula",
    date: "2025-08-22",
    time: "14:00 WIB",
    type: "Workshop",
    speaker: "Siti Rahmawati, Backend Dev",
    image: "/img/events/docker.png",
    description:
      "Pelajari dasar-dasar kontainerisasi dengan Docker. Sesi praktik langsung untuk mendeploy aplikasi Node.js.",
  },
  {
    id: 3,
    title: "Figma & Coffee: Sesi Desain Interaktif",
    date: "2025-09-05",
    time: "16:00 WIB",
    type: "Komunitas",
    speaker: "Eka Prasetya, UI/UX Designer",
    image: "/img/events/figma.png",
    description:
      "Sesi sharing dan networking untuk para desainer. Bawa laptop dan mari kita desain komponen bersama!",
  },
  {
    id: 4,
    title: "Demo Day: Proyek Sampingan Keren",
    date: "2025-09-19",
    time: "19:30 WIB",
    type: "Showcase",
    speaker: "Komunitas Caffeine",
    image: "/img/events/demo.png",
    description:
      "Pamerkan proyek sampingan yang sedang Anda kerjakan! Kesempatan untuk mendapatkan masukan dan menemukan kolaborator.",
  },
];

// Komponen Kartu Event
const EventCard = ({ event, isActive }: { event: any; isActive: boolean }) => (
  <div
    className={`transition-transform duration-500 ease-out ${
      isActive ? "scale-100" : "scale-90"
    }`}
  >
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          {event.type}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
          <Calendar size={14} />{" "}
          {new Date(event.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex-grow">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Mic size={14} />
          <span>{event.speaker}</span>
        </div>
      </div>
    </div>
  </div>
);

// Komponen Utama
export default function EventsHub() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === eventsData.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, 5000); // Ganti slide setiap 5 detik
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <section
      ref={ref}
      id="events"
      className="py-20 sm:py-24 bg-gray-100 dark:bg-black"
    >
      <div
        className={`container mx-auto px-4 transition-all duration-1000 ease-out ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Community &{" "}
            <span className="text-amber-600 dark:text-amber-500">Events</span>{" "}
            Hub
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Selalu ada sesuatu yang menarik di Caffeine. Ikuti meetup, workshop,
            dan sesi networking kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Kolom Kiri: Slider Event */}
          <div className="relative h-[450px] md:h-[500px]">
            {eventsData.map((event, index) => (
              <div
                key={event.id}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: index === currentIndex ? 1 : 0 }}
              >
                <EventCard event={event} isActive={index === currentIndex} />
              </div>
            ))}
          </div>

          {/* Kolom Kanan: Konten & CTA */}
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Jadwal Acara Mendatang
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Geser untuk melihat acara lainnya atau klik untuk melihat detail
              lengkap dan melakukan RSVP.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              {eventsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-amber-500 scale-125"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Punya Ide untuk Acara?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Komunitas Anda ingin mengadakan meetup? Kami menyediakan tempat
                dan paket khusus untuk mendukung ekosistem developer.
              </p>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Kolaborasi Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
