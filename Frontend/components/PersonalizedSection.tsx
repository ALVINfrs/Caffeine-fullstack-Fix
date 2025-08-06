"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Coffee,
  Sparkles,
  Hand,
  Utensils,
  BrainCircuit,
  Sofa,
  Users2,
  Zap,
} from "lucide-react";

// --- DATA UNTUK KONTEN DINAMIS ---
const dailyPromos = [
  {
    day: 0,
    title: "Weekend Warrior",
    description:
      "Beli 2 Kopi Susu, Gratis 1 Croissant. Sempurna untuk ngoding di hari Minggu!",
    icon: <Coffee />,
  }, // Minggu
  {
    day: 1,
    title: "Monday Blues Buster",
    description:
      "Diskon 30% untuk semua varian Espresso. Awali minggu dengan semangat!",
    icon: <Zap />,
  }, // Senin
  {
    day: 2,
    title: "Teamwork Tuesday",
    description:
      "Pesan paket sharing (Pizza + 4 Minuman), dapatkan diskon 15%.",
    icon: <Users2 />,
  }, // Selasa
  {
    day: 3,
    title: "Wisdom Wednesday",
    description:
      "Gratis upgrade ke susu oat untuk setiap pembelian Latte. Baik untukmu, baik untuk kodemu.",
    icon: <Sparkles />,
  }, // Rabu
  {
    day: 4,
    title: "Thirsty Thursday",
    description: "Semua minuman non-kopi (Matcha, Coklat) diskon 20%.",
    icon: <Sofa />,
  }, // Kamis
  {
    day: 5,
    title: "Focus Friday",
    description:
      "Beli kopi apa saja, dapatkan extra shot espresso secara gratis. Push code sebelum weekend!",
    icon: <BrainCircuit />,
  }, // Jumat
  {
    day: 6,
    title: "Side-Project Saturday",
    description:
      "Diskon 10% untuk semua makanan berat. Ngoding butuh energi ekstra.",
    icon: <Utensils />,
  }, // Sabtu
];

const vibeRecommendations = {
  fokus: {
    icon: <BrainCircuit className="w-8 h-8" />,
    title: "Mode Fokus Aktif!",
    recommendation:
      "Kami rekomendasikan 'Deep Work Combo': Americano panas dan air mineral untuk hidrasi maksimal. Cari spot di 'Quiet Zone' kami.",
    cta: { text: "Lihat Quiet Zone", href: "#" },
  },
  santai: {
    icon: <Sofa className="w-8 h-8" />,
    title: "Waktunya Bersantai.",
    recommendation:
      "Nikmati secangkir Matcha Latte hangat dengan sepotong Red Velvet Cake di area sofa kami yang nyaman. Playlist Lo-fi sudah menanti.",
    cta: { text: "Lihat Menu Snacks", href: "#menu" },
  },
  kelompok: {
    icon: <Users2 className="w-8 h-8" />,
    title: "Kolaborasi Bareng Tim?",
    recommendation:
      "Pesan 'Paket Sprint' kami yang berisi Pizza untuk berbagi dan 4 Iced Lemon Tea. Meja besar di area komunal siap digunakan.",
    cta: { text: "Booking Meja Besar", href: "#booking" },
  },
};

// --- KOMPONEN UTAMA ---
export default function PersonalizedHubV2() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userVibe, setUserVibe] = useState<
    "fokus" | "santai" | "kelompok" | null
  >(null);

  // Pilih promo berdasarkan hari ini
  const currentPromo = useMemo(() => {
    const today = new Date().getDay();
    return dailyPromos.find((p) => p.day === today) || dailyPromos[0];
  }, []);

  // Efek untuk memeriksa data dari localStorage saat pertama kali load
  useEffect(() => {
    const storedName = localStorage.getItem("caffeineVisitorName");
    const storedVibe = localStorage.getItem("caffeineUserVibe") as
      | "fokus"
      | "santai"
      | "kelompok"
      | null;

    if (storedName) setUserName(storedName);
    if (storedVibe) setUserVibe(storedVibe);
  }, []);

  const handleVibeChange = (vibe: "fokus" | "santai" | "kelompok") => {
    setUserVibe(vibe);
    localStorage.setItem("caffeineUserVibe", vibe);
  };

  const activeRecommendation = userVibe ? vibeRecommendations[userVibe] : null;

  return (
    <section
      id="personalized-hub"
      className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-900/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Judul & Sapaan */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            {userName
              ? `Halo Lagi, ${userName}!`
              : "Selamat Datang di Caffeine!"}
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Pilih vibe Anda hari ini untuk rekomendasi terbaik dari kami.
          </p>
        </div>

        {/* [BARU] Tombol Pemilih Vibe */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-12">
          <button
            onClick={() => handleVibeChange("fokus")}
            className={`flex items-center gap-2 px-5 py-2 font-semibold rounded-full transition-all duration-200 border-2 ${
              userVibe === "fokus"
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-amber-500"
            }`}
          >
            <BrainCircuit size={18} /> Butuh Fokus
          </button>
          <button
            onClick={() => handleVibeChange("santai")}
            className={`flex items-center gap-2 px-5 py-2 font-semibold rounded-full transition-all duration-200 border-2 ${
              userVibe === "santai"
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-amber-500"
            }`}
          >
            <Sofa size={18} /> Lagi Santai
          </button>
          <button
            onClick={() => handleVibeChange("kelompok")}
            className={`flex items-center gap-2 px-5 py-2 font-semibold rounded-full transition-all duration-200 border-2 ${
              userVibe === "kelompok"
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-amber-500"
            }`}
          >
            <Users2 size={18} /> Kerja Kelompok
          </button>
        </div>

        {/* Kontainer Konten Adaptif */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* [ADAPTIF] Kolom Rekomendasi Berdasarkan Vibe */}
          <div className="lg:col-span-2 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center text-center">
            {activeRecommendation ? (
              <>
                <div className="text-amber-500 mb-4">
                  {activeRecommendation.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeRecommendation.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {activeRecommendation.recommendation}
                </p>
                <a
                  href={activeRecommendation.cta.href}
                  className="mt-auto px-6 py-2 font-bold bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                >
                  {activeRecommendation.cta.text}
                </a>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <Hand className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pilih Vibe Anda
                </h3>
                <p className="text-gray-500 max-w-xs">
                  Klik salah satu tombol di atas untuk mendapatkan rekomendasi
                  personal dari kami.
                </p>
              </div>
            )}
          </div>

          {/* [DINAMIS] Kolom Promosi Harian */}
          <div className="bg-amber-900/90 backdrop-blur-sm border border-white/10 text-white rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-2xl">
            <div className="bg-white/20 p-4 rounded-full mb-4 text-amber-300">
              {currentPromo.icon}
            </div>
            <p className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              {currentPromo.day === 0 || currentPromo.day === 6
                ? "Promo Akhir Pekan"
                : "Promo Hari Ini"}
            </p>
            <h3 className="text-2xl font-bold mb-2">{currentPromo.title}</h3>
            <p className="text-lg text-amber-100/80 mb-4 flex-grow">
              {currentPromo.description}
            </p>
            <a
              href="#menu"
              className="mt-auto w-full text-center px-6 py-3 font-bold bg-amber-400 text-amber-900 rounded-full hover:bg-amber-300 transition-colors"
            >
              Klaim Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
