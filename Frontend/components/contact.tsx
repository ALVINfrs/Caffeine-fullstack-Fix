"use client";

import type React from "react";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Building,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInView } from "react-intersection-observer";

// [BARU] Komponen Kartu Info Kontak
const InfoCard = ({
  icon,
  title,
  content,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  href?: string;
}) => {
  const CardContent = () => (
    <>
      <div className="flex-shrink-0 bg-amber-100 dark:bg-gray-800 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{content}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
      >
        {CardContent()}
      </a>
    );
  }
  return <div className="flex items-center gap-4 p-4">{CardContent()}</div>;
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Saran & Kritik", // [BARU] State untuk subjek
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Form Kurang Lengkap",
        description: "Mohon isi nama, email, dan pesan Anda.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    // Logika fetch API tetap sama...
    // Simulasi pengiriman berhasil setelah 2 detik
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast({
      title: "Pesan Terkirim",
      description: "Terima kasih! Kami akan segera merespons Anda.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "Saran & Kritik",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="contact py-20 sm:py-24 bg-white dark:bg-black overflow-hidden"
    >
      <div
        className={`container mx-auto px-4 transition-opacity duration-1000 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Judul & Deskripsi */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Hubungi{" "}
            <span className="text-amber-600 dark:text-amber-500">Kami</span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Punya pertanyaan, saran, atau mau kolaborasi? Tim kami siap bantu.
            Let's ngoding & ngopi bareng!
          </p>
        </div>

        {/* [BARU] Layout Info Kontak & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Kolom Kiri: Info Kontak */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Informasi Kontak
            </h3>
            <div className="space-y-4">
              <InfoCard
                icon={
                  <MapPin
                    size={22}
                    className="text-amber-600 dark:text-amber-400"
                  />
                }
                title="Alamat Basecamp"
                content="Jl. Raya Koding No. 123, Depok, Jawa Barat"
              />
              <InfoCard
                icon={
                  <Mail
                    size={22}
                    className="text-amber-600 dark:text-amber-400"
                  />
                }
                title="Email Resmi"
                content="hello@caffeine.dev"
                href="mailto:hello@caffeine.dev"
              />
              <InfoCard
                icon={
                  <Phone
                    size={22}
                    className="text-amber-600 dark:text-amber-400"
                  />
                }
                title="Reservasi Grup"
                content="(+62) 812-3456-7890"
                href="tel:+6281234567890"
              />
              <InfoCard
                icon={
                  <Building
                    size={22}
                    className="text-amber-600 dark:text-amber-400"
                  />
                }
                title="Jam Operasional"
                content="Setiap Hari, 08:00 - 22:00 WIB"
              />
            </div>
          </div>

          {/* Kolom Kanan: Form Kontak Canggih */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl shadow-lg"
          >
            {/* [BARU] Input Subjek */}
            <div className="relative">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-300 dark:border-gray-700"
              >
                <option>Saran & Kritik</option>
                <option>Kolaborasi Event</option>
                <option>Reservasi Grup</option>
                <option>Lainnya</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>

            {/* [BARU] Input dengan Floating Label */}
            <div className="relative pt-4">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="peer w-full p-3 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 placeholder-transparent"
                placeholder="Nama Anda"
              />
              <label
                htmlFor="name"
                className="absolute left-3 -top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-6 peer-focus:-top-2 peer-focus:text-amber-500 peer-focus:text-sm"
              >
                Nama Anda
              </label>
              <User
                className="absolute right-3 top-6 text-gray-400 peer-focus:text-amber-500"
                size={18}
              />
            </div>

            <div className="relative pt-4">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full p-3 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 placeholder-transparent"
                placeholder="Email Anda"
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-6 peer-focus:-top-2 peer-focus:text-amber-500 peer-focus:text-sm"
              >
                Email Anda
              </label>
              <Mail
                className="absolute right-3 top-6 text-gray-400 peer-focus:text-amber-500"
                size={18}
              />
            </div>

            <div className="relative pt-4">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="peer w-full p-3 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 placeholder-transparent min-h-[100px]"
                placeholder="Pesan Anda"
              ></textarea>
              <label
                htmlFor="message"
                className="absolute left-3 -top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-6 peer-focus:-top-2 peer-focus:text-amber-500 peer-focus:text-sm"
              >
                Pesan Anda
              </label>
              <MessageSquare
                className="absolute right-3 top-6 text-gray-400 peer-focus:text-amber-500"
                size={18}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>

        {/* [BARU] Peta di Bagian Bawah */}
        <div className="mt-20">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.340078834226!2d106.8017948404589!3d-6.21976980210492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1505c6a5a31%3A0x1d1871695754924a!2sSCBD!5e0!3m2!1sen!2sid!4v1722336301289!5m2!1sen!2sid"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[400px] rounded-2xl shadow-2xl transition-all duration-500 filter grayscale hover:grayscale-0"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
