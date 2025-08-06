"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  User,
  Beaker,
  Menu,
  Rss,
  Camera,
  HelpCircle,
  MessageSquare,
  Star,
  Info,
  Terminal,
} from "lucide-react";

// --- KONFIGURASI SEKSI ---
const sections = [
  { id: "home", tooltip: "Beranda", icon: <Home size={20} /> },
  { id: "terminal", tooltip: "Terminal", icon: <Terminal size={20} /> },
  { id: "personalized-hub", tooltip: "Hub Pribadi", icon: <Star size={20} /> },
  { id: "about", tooltip: "Tentang Kami", icon: <User size={20} /> },
  {
    id: "creation-station",
    tooltip: "Creation Station",
    icon: <Beaker size={20} />,
  },
  { id: "menu", tooltip: "Menu", icon: <Menu size={20} /> },
  { id: "faq", tooltip: "FAQ", icon: <HelpCircle size={20} /> },
  {
    id: "testimonials",
    tooltip: "Testimoni",
    icon: <MessageSquare size={20} />,
  },
  { id: "events", tooltip: "Events Hub", icon: <Rss size={20} /> },
  { id: "gallery", tooltip: "Galeri", icon: <Camera size={20} /> },
  { id: "contact", tooltip: "Kontak", icon: <Info size={20} /> },
];

export default function DotNav() {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSectionId = sections[0].id;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentSectionId = section.id;
        }
      }

      setActiveSection(currentSectionId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // [FIX] Tambahkan 'hidden lg:flex' untuk menyembunyikan di mobile
    <nav
      className={`hidden lg:flex fixed top-1/2 right-6 -translate-y-1/2 z-50 transition-transform duration-700 ease-out ${
        isLoaded ? "translate-x-0" : "translate-x-24"
      }`}
    >
      <ul className="flex flex-col items-center justify-center space-y-2 p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 shadow-lg">
        {sections.map(({ id, tooltip, icon }) => {
          const isActive = activeSection === id;
          return (
            <li key={id} className="relative group">
              <button
                onClick={() => handleScrollTo(id)}
                className={`relative flex items-center justify-center h-10 transition-all duration-300 ease-in-out rounded-full group ${
                  isActive
                    ? "w-32 bg-amber-500 text-white shadow-md"
                    : "w-10 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-black/50"
                }`}
                aria-label={`Go to ${tooltip} section`}
              >
                <div
                  className={`transition-transform duration-300 ${
                    isActive ? "-translate-x-10" : "translate-x-0"
                  }`}
                >
                  {icon}
                </div>
                <span
                  className={`absolute left-10 text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3"
                  }`}
                >
                  {tooltip}
                </span>
                {!isActive && (
                  <div className="absolute right-full mr-4 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    {tooltip}
                    <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
