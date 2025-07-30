"use client";

import React from "react"; // Impor React tetap dibutuhkan untuk cloneElement
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingBag,
  CalendarPlus,
  Code,
  Database,
  Server,
  Wind,
} from "lucide-react";

// [FIX 1] Ganti tipe prop 'icon' menjadi lebih spesifik
const FloatingTechIcon = ({
  icon,
  top,
  left,
  size,
  delay,
}: {
  icon: React.ReactElement;
  top: string;
  left: string;
  size: number;
  delay: string;
}) => (
  <div
    className="absolute text-white/20 dark:text-white/10" // Dibuat sedikit lebih terlihat
    style={{ top, left, animation: `float 6s ease-in-out infinite ${delay}` }}
  ></div>
);

const TechScroller = () => {
  const techLogos = [
    "Node.js",
    "React",
    "Next.js",
    "Spring",
    "Laravel",
    "Django",
    "Go",
    "Tailwind",
    "Jest",
    "Docker",
    "Vercel",
    "GitHub",
  ];
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll">
        {techLogos.map((tech, index) => (
          <li
            key={index}
            className="text-gray-400 dark:text-gray-500 font-semibold"
          >
            {tech}
          </li>
        ))}
      </ul>
      <ul
        className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll"
        aria-hidden="true"
      >
        {techLogos.map((tech, index) => (
          <li
            key={index}
            className="text-gray-400 dark:text-gray-500 font-semibold"
          >
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function InteractiveHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleReservationClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Belum Login",
        description: "Silakan login untuk dapat membuat reservasi.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <section
        id="home"
        className="hero min-h-screen flex items-center justify-center py-20 relative overflow-hidden"
      >
        {/* [FIX 2] Buat gradient overlay menjadi transparan agar gambar terlihat */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 z-0"></div>

        {/* [FIX 3] Naikkan opacity gambar latar belakang */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-30 z-[-1]"
          style={{ backgroundImage: "url('/img/header-bg.png')" }}
        ></div>

        <FloatingTechIcon
          icon={<Code />}
          top="10%"
          left="5%"
          size={40}
          delay="0s"
        />
        <FloatingTechIcon
          icon={<Database />}
          top="20%"
          left="80%"
          size={32}
          delay="1s"
        />
        <FloatingTechIcon
          icon={<Server />}
          top="70%"
          left="15%"
          size={48}
          delay="2s"
        />
        <FloatingTechIcon
          icon={<Wind />}
          top="80%"
          left="90%"
          size={36}
          delay="3s"
        />
        <FloatingTechIcon
          icon={<Code />}
          top="40%"
          left="40%"
          size={28}
          delay="0.5s"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-2xl bg-white/50 dark:bg-black/30 shadow-2xl  border border-white/20 dark:border-black/20">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-opacity duration-500 text-gray-900 dark:text-white ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              Rasakan Energi{" "}
              <span className="caffeine-blink">&lt;Caffeine/&gt;</span>
            </h1>

            <p
              className={`text-base md:text-lg mb-8 transition-opacity duration-500 delay-300 text-gray-700 dark:text-gray-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              Kopi sekuat semangat ngoding, hidangan lokal & western, dan vibes
              pas buat debugging. Ngulik stack seperti Node.js, Express, React,
              Next.js, React Native, Spring, Laravel, Django, Go, ASP.NET? Semua
              bisa dikerjain di sini. Desain UI pakai Tailwind, testing pakai
              Jest, deploy ke Vercel atau Docker—semua sambil ngopi, nge-push ke
              GitHub, dan bikin project impian jadi kenyataan.
            </p>

            <div className="my-8">
              <TechScroller />
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="#menu"
                className={`inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-full text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <ShoppingBag size={20} />
                Lihat Menu
              </Link>
              <Link
                href={user ? "/reservation" : "#"}
                onClick={handleReservationClick}
                className={`inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-full text-gray-800 dark:text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto ${
                  isLoaded ? "opacity-100" : "opacity-0"
                } ${!user ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <CalendarPlus size={20} />
                Reservasi Tempat
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }

        @keyframes caffeineBlink {
          0%,
          100% {
            color: #d97706; /* amber-600 */
            text-shadow: 0 0 6px #d97706;
          }
          50% {
            color: #fbbf24; /* amber-400 cerah */
            text-shadow: 0 0 12px #fbbf24;
          }
        }
        .caffeine-blink {
          animation: caffeineBlink 3.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
