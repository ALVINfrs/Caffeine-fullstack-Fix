"use client";

import { useState, useMemo } from "react";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

// --- [UPDATE] DATA FAQ YANG LEBIH KOMPLEKS DAN DETAIL ---
const faqData = [
  // Kategori: Umum
  {
    id: "q1",
    question: "Jam berapa Caffeine buka dan tutup?",
    answer:
      "Kami buka setiap hari! Senin - Jumat dari jam 08:00 - 22:00. Sabtu & Minggu dari jam 09:00 - 23:00. Cocok untuk ngoding pagi maupun *late-night deployment*.",
    category: "Umum",
  },
  {
    id: "q7",
    question: "Metode pembayaran apa saja yang diterima?",
    answer:
      "Kami menerima hampir semua metode pembayaran modern: Tunai, Kartu Debit/Kredit (Visa, Mastercard), dan semua jenis QRIS (GoPay, OVO, Dana, ShopeePay, dll). Transaksi cepat, tanpa *latency*.",
    category: "Umum",
  },
  {
    id: "q8",
    question: "Lokasi tepatnya di mana dan apakah ada tempat parkir?",
    answer:
      "Kami berada di Jl. Raya Koding No. 123, Depok. Lokasi kami sangat mudah dijangkau oleh ojek online. Tersedia parkir motor yang cukup luas dan beberapa slot parkir mobil terbatas.",
    category: "Umum",
  },

  // Kategori: Fasilitas
  {
    id: "q2",
    question: "Seberapa kencang dan stabil koneksi WiFi di sini?",
    answer:
      'Sangat kencang dan stabil. Kami menggunakan koneksi fiber optik *dedicated* hingga 500 Mbps dengan *load balancing* dan beberapa *access point* untuk memastikan *uptime* 99% dan latensi rendah di semua area. Ucapkan selamat tinggal pada "npm install" yang lambat!',
    category: "Fasilitas",
  },
  {
    id: "q3",
    question: "Apakah setiap meja punya colokan listrik?",
    answer:
      "Tentu saja! Kami mengerti kebutuhan para developer. Hampir semua meja, baik *solo desk* maupun *communal table*, dilengkapi dengan stop kontak yang mudah dijangkau. Bawa laptop Anda, kami sediakan dayanya.",
    category: "Fasilitas",
  },
  {
    id: "q9",
    question: "Jenis tempat duduk apa saja yang tersedia?",
    answer:
      "Kami punya beragam zona: 'Quiet Zone' dengan *solo desk* untuk fokus maksimal, 'Communal Table' untuk kolaborasi, area sofa yang nyaman untuk bersantai, dan area *outdoor* untuk Anda yang butuh udara segar saat *debugging*.",
    category: "Fasilitas",
  },

  // Kategori: Booking & Reservasi
  {
    id: "q4",
    question: "Bagaimana cara booking tempat untuk kerja atau meeting?",
    answer:
      'Untuk individu, kami menganut sistem "first come, first served". Namun, untuk grup di atas 4 orang atau jika Anda butuh *meeting room*, kami sangat menyarankan untuk reservasi via WhatsApp minimal H-1 untuk memastikan ketersediaan tempat.',
    category: "Booking & Reservasi",
  },
  {
    id: "q10",
    question: "Apakah ada minimum order untuk reservasi grup?",
    answer:
      "Ya, untuk reservasi grup di atas 4 orang, kami memberlakukan minimum pemesanan sebesar Rp 50.000 per orang. Ini untuk memastikan semua slot yang dibooking dapat kami layani dengan maksimal.",
    category: "Booking & Reservasi",
  },

  // Kategori: Menu & Makanan
  {
    id: "q5",
    question: "Apakah ada menu vegetarian atau vegan?",
    answer:
      "Ada. Kami menyediakan beberapa pilihan makanan ringan vegetarian dan susu *plant-based* (oat dan kedelai) untuk semua minuman kopi dan non-kopi kami. Tanyakan pada barista kami untuk rekomendasi *stack* menu yang cocok.",
    category: "Menu & Makanan",
  },
  {
    id: "q11",
    question: "Apa minuman kopi andalan di Caffeine?",
    answer:
      "Signature kami adalah 'The Kernel Panic', sebuah es kopi susu dengan sirup karamel rahasia yang dijamin bisa 'me-reboot' semangat Anda. Untuk para purist, V60 dengan biji kopi Gayo kami sangat direkomendasikan.",
    category: "Menu & Makanan",
  },

  // Kategori: Event & Komunitas
  {
    id: "q6",
    question:
      "Bolehkah saya mengadakan acara komunitas atau meetup di Caffeine?",
    answer:
      "Sangat boleh! Kami senang menjadi tuan rumah untuk acara komunitas tech. Hubungi manajer kami untuk mendiskusikan paket khusus, kapasitas, dan ketersediaan area semi-privat kami. Mari kita bangun ekosistem bersama!",
    category: "Event & Komunitas",
  },
  {
    id: "q12",
    question: "Di mana saya bisa lihat jadwal event terbaru?",
    answer:
      "Semua jadwal event dan meetup terbaru kami umumkan di akun Instagram @CaffeineDevSpace dan di bagian 'Event' pada website ini. Pastikan Anda follow agar tidak ketinggalan *update*.",
    category: "Event & Komunitas",
  },
];

// --- [UPDATE] KATEGORI BARU ---
const categories = [
  "Semua",
  "Umum",
  "Fasilitas",
  "Booking & Reservasi",
  "Menu & Makanan",
  "Event & Komunitas",
];

// Komponen utama FAQ (Logika tetap sama, tidak perlu diubah)
export default function FAQComplex() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesCategory =
        activeCategory === "Semua" || faq.category === activeCategory;
      const matchesSearch =
        searchTerm === "" ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Judul */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-amber-500" />
            Ada Pertanyaan?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Temukan jawaban untuk pertanyaan yang paling sering diajukan di
            sini.
          </p>
        </div>

        {/* Fitur Filter & Search */}
        <div className="mb-10 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="search"
              placeholder="Ketik kata kunci... (misal: wifi, booking, event)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-amber-500 focus:outline-none transition-shadow"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Filter Kategori */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  activeCategory === category
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Daftar Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300"
              >
                {/* Tombol Pertanyaan */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex justify-between items-center text-left p-5 sm:p-6 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-6 h-6 text-amber-500 flex-shrink-0 ml-4 transform transition-transform duration-300 ${
                      openAccordion === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Konten Jawaban (Collapsible) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openAccordion === faq.id
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Tidak ada pertanyaan yang cocok dengan pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
