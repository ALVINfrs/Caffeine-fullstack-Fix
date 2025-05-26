"use client"

import Link from "next/link"
import { Instagram, Twitter, Linkedin, Github } from "lucide-react"
import { useInView } from "react-intersection-observer"

export default function Footer() {
  const [footerRef, footerInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <footer
      ref={footerRef}
      className={`py-8 dark:bg-gray-900 light:bg-amber-50 border-t dark:border-gray-800 light:border-amber-100 transition-opacity duration-500 ${
        footerInView ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="socials flex justify-center space-x-4 mb-6">
          <a
            href="https://instagram.com/alvnfrs_/profilecard/?igsh=MTltYzM4cnlpdmQzbA"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 dark:bg-gray-800 light:bg-white rounded-full hover:bg-amber-600 transition-colors shadow-sm hover:shadow-md"
          >
            <Instagram size={20} className="dark:text-white light:text-amber-800" />
          </a>
          <a
            href="https://X.com/Alvnfrs_?s=08"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 dark:bg-gray-800 light:bg-white rounded-full hover:bg-amber-600 transition-colors shadow-sm hover:shadow-md"
          >
            <Twitter size={20} className="dark:text-white light:text-amber-800" />
          </a>
          <a
            href="https://www.linkedin.com/in/alvin-faris-89060a31b/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 dark:bg-gray-800 light:bg-white rounded-full hover:bg-amber-600 transition-colors shadow-sm hover:shadow-md"
          >
            <Linkedin size={20} className="dark:text-white light:text-amber-800" />
          </a>
          <a
            href="https://github.com/ALVINfrs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 dark:bg-gray-800 light:bg-white rounded-full hover:bg-amber-600 transition-colors shadow-sm hover:shadow-md"
          >
            <Github size={20} className="dark:text-white light:text-amber-800" />
          </a>
        </div>

        <div className="links flex justify-center space-x-6 mb-6">
          <Link
            href="#home"
            className="text-sm dark:text-white light:text-amber-800 hover:text-amber-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="#about"
            className="text-sm dark:text-white light:text-amber-800 hover:text-amber-500 transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="#menu"
            className="text-sm dark:text-white light:text-amber-800 hover:text-amber-500 transition-colors"
          >
            Menu
          </Link>
          <Link
            href="#contact"
            className="text-sm dark:text-white light:text-amber-800 hover:text-amber-500 transition-colors"
          >
            Kontak
          </Link>
        </div>

        <div className="credit text-center text-sm dark:text-gray-400 light:text-amber-700">
          <p>
            Created by{" "}
            <a href="#" className="text-amber-500 dark:text-amber-500 light:text-amber-800 hover:underline">
              Alvnfrs
            </a>
            . |&copy;{new Date().getFullYear()}.
          </p>
        </div>
      </div>
    </footer>
  )
}
