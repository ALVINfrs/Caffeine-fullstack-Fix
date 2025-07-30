"use client";

import Link from "next/link";
import {
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function Footer() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Data untuk mempermudah mapping
  const socialLinks = [
    {
      href: "https://instagram.com/alvnfrs_/profilecard/?igsh=MTltYzM4cnlpdmQzbA",
      icon: <Instagram size={20} />,
    },
    { href: "https://X.com/Alvnfrs_?s=08", icon: <Twitter size={20} /> },
    {
      href: "https://www.linkedin.com/in/alvin-faris-89060a31b/",
      icon: <Linkedin size={20} />,
    },
    { href: "https://github.com/ALVINfrs", icon: <Github size={20} /> },
  ];

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "Tentang Kami" },
    { href: "#menu", label: "Menu" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Kontak" },
  ];

  return (
    <footer
      ref={ref}
      className="relative bg-gray-100 dark:bg-gray-900 pt-20 pb-8"
    >
      {/* [BARU] SVG Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[75px] fill-current text-white dark:text-black"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div
        className={`container mx-auto px-4 transition-opacity duration-700 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Kolom 1: Tentang Caffeine */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              &lt;Caffeine/&gt;
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Basecamp para developer. Tempat di mana ide-ide brilian lahir dari
              perpaduan kafein berkualitas dan koneksi internet secepat kilat.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Hubungi Kami */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Hubungi Kami
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-amber-500 mt-1 flex-shrink-0"
                />
                <span className="text-gray-600 dark:text-gray-400">
                  Jl. Raya Koding No. 123, Depok, Jawa Barat 16424
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-500 flex-shrink-0" />
                <a
                  href="mailto:hello@caffeine.dev"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  hello@caffeine.dev
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-500 flex-shrink-0" />
                <a
                  href="tel:+6281234567890"
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  (+62) 812-3456-7890
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Tetap Terhubung
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dapatkan info promo terbaru, jadwal event, dan update patch
              langsung ke inbox Anda.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="email@anda.com"
                className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-r-md transition-colors"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>

        {/* [DIUPGRADE] Bagian Bawah: Copyright & Socials */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Caffeine. Dibuat dengan{" "}
            <span className="text-amber-500">&lt;3</span> oleh{" "}
            <a href="#" className="font-semibold hover:underline">
              Alvin Faris
            </a>
            .
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transform hover:scale-110 transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
