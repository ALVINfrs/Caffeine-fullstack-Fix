"use client";
import Image from "next/image";
import { Coffee } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function About() {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [imageRef, imageInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      id="about"
      className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black transition-colors duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h2
          ref={titleRef}
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-8 sm:mb-12 tracking-tight transition-opacity duration-300 ease-out ${
            titleInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          } text-gray-900 dark:text-white`}
        >
          <span className="text-amber-600 dark:text-amber-400">Tentang </span>
          Kami
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div
            ref={imageRef}
            className={`relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out ${
              imageInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <Image
              src="/img/background.png"
              alt="Tentang Kami"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div
            ref={contentRef}
            className={`space-y-4 sm:space-y-6 transition-all duration-300 ease-out delay-100 ${
              contentInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <h3 className="text-xl sm:text-2xl font-semibold flex items-center text-gray-900 dark:text-white">
              <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 dark:text-amber-400 mr-2 sm:mr-3" />
              Kenapa Memilih{" "}
              <span className="text-amber-600 dark:text-amber-400">
                Caffeine
              </span>
            </h3>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  Caffeine
                </span>{" "}
                bukan sekadar tempat ngopi—ini adalah basecamp para developer.
                Suasana cozy, aroma kopi, playlist lo-fi, dan WiFi kencang cocok
                untuk maraton ngoding, debugging, atau sprint bareng tim.
              </p>

              <p>
                Mau ngulik{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Node.js
                </span>
                ,{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  React
                </span>
                ,{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Next.js
                </span>
                , atau backend dengan{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Spring
                </span>
                ,{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Laravel
                </span>
                ,{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Django
                </span>
                ? Semua stack nyaman dikerjain di sini.
              </p>

              <p>
                Bikin API, desain UI dengan{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Tailwind
                </span>
                , testing pakai{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Jest
                </span>
                , deploy ke{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Vercel
                </span>{" "}
                atau{" "}
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Docker
                </span>
                —semua bisa sambil ngopi dan nge-push ke GitHub.
              </p>

              <p>
                Kami juga punya <em>non-coffee drinks</em> seperti matcha dan
                coklat, <em>snack ringan</em> untuk nemenin bug fixing, serta{" "}
                <em>makanan berat</em> mulai dari pizza, nasi goreng, ayam
                geprek, hingga Indomie favorit coder!
              </p>

              <p className="font-medium">
                Di{" "}
                <span className="text-amber-600 dark:text-amber-400">
                  Caffeine
                </span>
                , setiap baris kode punya cerita. Yuk, wujudkan project
                impianmu—satu kopi, satu commit, satu inovasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
