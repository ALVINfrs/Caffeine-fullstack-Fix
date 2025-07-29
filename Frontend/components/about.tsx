"use client";

import Image from "next/image";
import {
  Coffee,
  Zap,
  Users,
  Award,
  Milestone,
  Code,
  Server,
  Database,
  Wind,
  TestTube2,
  GitFork,
  Pizza,
  Soup,
  BookOpen,
  Target,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

// --- SUB-KOMPONEN TETAP SAMA ---

function ValueCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="flex items-center mb-3">
        <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full mr-4">
          {icon}
        </div>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h4>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{children}</p>
    </div>
  );
}

function StatCounter({
  to,
  label,
  icon,
}: {
  to: number;
  label: string;
  icon: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = to;
      if (start === end) return;
      const duration = 2000;
      const incrementTime = Math.max(duration / end, 1);

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, to]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center text-center bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl transition-all duration-500 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="text-amber-500 mb-2">{icon}</div>
      <h3 className="text-4xl lg:text-5xl font-bold text-amber-600 dark:text-amber-400">
        {count}
        {label.includes("%") ? "" : "+"}
        {label.includes("%") && "%"}
      </h3>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
        {label.replace("% ", "")}
      </p>
    </div>
  );
}

function TechShowcase({
  technologies,
}: {
  technologies: { name: string; icon: React.ReactNode }[];
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <div
      ref={ref}
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 text-center"
    >
      {technologies.map((tech, index) => (
        <div
          key={tech.name}
          className={`flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow-md hover:bg-amber-50 dark:hover:bg-amber-900/50 transition-all duration-300 ease-out ${
            inView ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <div className="text-amber-600 dark:text-amber-400">{tech.icon}</div>
          <p className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            {tech.name}
          </p>
        </div>
      ))}
    </div>
  );
}

function FoodShowcase({ items }: { items: { name: string; image: string }[] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <div ref={ref} className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-gray-200 dark:scrollbar-thumb-amber-600 dark:scrollbar-track-gray-800">
        {items.map((food, index) => (
          <div
            key={food.name}
            className={`flex-shrink-0 w-48 h-64 rounded-xl overflow-hidden shadow-lg group relative transition-all duration-500 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Image
              src={food.image}
              alt={food.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <h4 className="absolute bottom-4 left-4 text-white font-bold text-lg">
              {food.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}

// [BARU] SUB-KOMPONEN UNTUK ANGGOTA TIM
function TeamMemberCard({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-500 ease-out ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="rounded-full object-cover shadow-lg"
          sizes="160px"
        />
      </div>
      <h4 className="font-bold text-lg text-gray-900 dark:text-white">
        {name}
      </h4>
      <p className="text-sm text-amber-600 dark:text-amber-400">{role}</p>
    </div>
  );
}

// --- KOMPONEN UTAMA (VERSI FINAL) ---
export default function AboutFinalBoss() {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: introImageRef, inView: introImageInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: introTextRef, inView: introTextInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: timelineRef, inView: timelineInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: storyRef, inView: storyInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const techStack = [
    { name: "Node.js", icon: <Code size={32} /> },
    { name: "React", icon: <Code size={32} /> },
    { name: "Next.js", icon: <Code size={32} /> },
    { name: "Spring", icon: <Server size={32} /> },
    { name: "Laravel", icon: <Server size={32} /> },
    { name: "Django", icon: <Server size={32} /> },
    { name: "Tailwind", icon: <Wind size={32} /> },
    { name: "Jest", icon: <TestTube2 size={32} /> },
    { name: "Vercel", icon: <Server size={32} /> },
    { name: "Docker", icon: <Server size={32} /> },
    { name: "GitHub", icon: <GitFork size={32} /> },
    { name: "Database", icon: <Database size={32} /> },
  ];
  const foodMenu = [
    { name: "Pizza", image: "/img/products/pepperoni-pizza.jpg" },
    { name: "Sate Ayam", image: "/img/products/sate-ayam.jpg" },
    { name: "Ayam Geprek", image: "/img/products/ayam-geprek.jpg" },
    { name: "Indomie Coder", image: "/img/products/indomie-soto.jpg" },
    { name: "Matcha Latte", image: "/img/products/matcha-latte.jpg" },
    { name: "Espresso", image: "/img/products/espresso.jpg" },
  ];
  const timelineEvents = [
    {
      year: "2022",
      event:
        "Ide 'Caffeine' lahir dari secangkir kopi dan bug yang tak kunjung selesai.",
    },
    {
      year: "2023",
      event:
        "Grand Opening. Pintu kami terbuka untuk semua developer, freelancer, dan pemimpi digital.",
    },
    {
      year: "2024",
      event:
        "Menjadi tuan rumah untuk meetup komunitas developer lokal pertama.",
    },
    {
      year: "2025",
      event:
        "Meluncurkan 'Code & Coffee', program mentorship bulanan untuk developer junior.",
    },
  ];
  const teamMembers = [
    {
      name: "Muhammad Alvin Fris",
      role: "Founder & Caffeine Team Lead",
      image: "/img/team/alvin.jpg", // Pastikan Anda punya foto ini
    },
    {
      name: "Ayu Lestari",
      role: "Head Barista & Community Manager",
      image: "/img/team/ayu.jpg",
    },
    {
      name: "Budi Santoso",
      role: "Lead Frontend Engineer",
      image: "/img/team/budi.jpg",
    },
    {
      name: "Siti Rahmawati",
      role: "Senior Backend Developer",
      image: "/img/team/siti.jpg",
    },
    {
      name: "Eka Prasetya",
      role: "UI/UX & Product Designer",
      image: "/img/team/eka.jpg",
    },
  ];

  return (
    <section
      id="about"
      className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-20 sm:space-y-28">
        {/* BAGIAN 1: INTRO UTAMA */}
        <div className="text-center">
          <h2
            ref={titleRef}
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-12 tracking-tighter transition-all duration-500 ease-out ${
              titleInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            <span className="text-amber-600 dark:text-amber-400">Basecamp</span>
            <span className="text-gray-900 dark:text-white">
              {" "}
              Para Developer.
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center text-left">
            <div
              ref={introImageRef}
              className={`relative h-80 sm:h-96 lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out ${
                introImageInView
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              <Image
                src="/img/background.png"
                alt="Suasana Caffeine"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div
              ref={introTextRef}
              className={`space-y-4 transition-all duration-500 ease-out delay-200 ${
                introTextInView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-5"
              }`}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Coffee className="w-8 h-8 text-amber-500 mr-3" />
                Kenapa Memilih Caffeine?
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Caffeine bukan sekadar tempat ngopi—ini adalah **basecamp para
                developer**. Suasana cozy, aroma kopi, playlist lo-fi, dan WiFi
                kencang cocok untuk maraton ngoding, debugging, atau sprint
                bareng tim.
              </p>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Di sini, setiap baris kode punya cerita. Yuk, wujudkan project
                impianmu—satu kopi, satu commit, satu inovasi.
              </p>
            </div>
          </div>
        </div>

        {/* [BARU] BAGIAN 2: CERITA KAMI */}
        <div
          ref={storyRef}
          className={`text-center transition-opacity duration-700 ease-out ${
            storyInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-amber-500 mr-3" />
            Cerita di Balik Kode
          </h3>
          <div className="max-w-4xl mx-auto text-left space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Kami memulai `Caffeine` dari sebuah masalah sederhana: sulitnya
              mencari tempat yang benar-benar 'mengerti' kebutuhan seorang
              developer. Kami butuh lebih dari sekadar kopi; kami butuh
              komunitas, koneksi yang stabil, dan suasana yang mendukung untuk
              fokus dan berkolaborasi.
            </p>
            <p>
              Maka, kami membangunnya. Sebuah ruang di mana `git push` sama
              pentingnya dengan seduhan espresso, di mana diskusi tentang
              arsitektur mikroservis terjadi sealami obrolan tentang cuaca.
            </p>
            <blockquote className="border-l-4 border-amber-500 pl-4 italic my-6">
              "Misi kami adalah menciptakan sebuah ekosistem di mana ide-ide
              digital bisa lahir, tumbuh, dan berkembang—didukung oleh kafein
              berkualitas dan komunitas yang solid."
            </blockquote>
          </div>
          <div className="mt-12">
            <h4 className="text-xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Orang-orang di Balik Layar
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={index} {...member} />
              ))}
            </div>
          </div>
        </div>

        {/* BAGIAN 3: TECH SHOWCASE */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-gray-900 dark:text-white">
            Stack Favorit? Kami Siap.
          </h3>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-10 -mt-6">
            Bikin API, desain UI, testing, sampai deploy. Semua stack nyaman
            dikerjain di sini sambil ngopi dan nge-push ke GitHub.
          </p>
          <TechShowcase technologies={techStack} />
        </div>

        {/* BAGIAN 4: FILOSOFI KAMI (VALUES) */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-gray-900 dark:text-white">
            DNA Kami
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <ValueCard
              icon={
                <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              }
              title="Kafein Pilihan"
            >
              Biji kopi premium untuk bahan bakar ide brilian. Karena bug tidak
              bisa kompromi dengan kopi sachet.
            </ValueCard>
            <ValueCard
              icon={
                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              }
              title="Koneksi Anti-Buffer"
            >
              WiFi fiber optik berkecepatan tinggi & colokan di setiap meja.
              Inspirasi tak bisa menunggu `npm install`.
            </ValueCard>
            <ValueCard
              icon={
                <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              }
              title="Kolaborasi & Komunitas"
            >
              Tempat bertemunya para developer, desainer, dan PM. Ciptakan
              koneksi, mulai proyek, dan tumbuh bersama.
            </ValueCard>
          </div>
        </div>

        {/* BAGIAN 5: STATISTIK */}
        <div className="bg-white dark:bg-gray-800/50 py-12 rounded-2xl shadow-inner">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {/* Animasi Kopi Diseduh dikembalikan */}
            <StatCounter
              to={8200}
              label="Kopi Diseduh"
              icon={<Coffee size={32} />}
            />
            <StatCounter
              to={150}
              label="Project Diluncurkan"
              icon={<Award size={32} />}
            />
            <StatCounter
              to={45}
              label="Meetup Diadakan"
              icon={<Users size={32} />}
            />
            <StatCounter
              to={99}
              label="% Uptime Koneksi"
              icon={<Zap size={32} />}
            />
          </div>
        </div>

        {/* BAGIAN 6: FOOD SHOWCASE */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-gray-900 dark:text-white">
            Amunisi Saat Debugging
          </h3>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-10 -mt-6">
            Kami juga punya non-coffee drinks, snack ringan, serta makanan berat
            favorit coder untuk menemani bug fixing!
          </p>
          <FoodShowcase items={foodMenu} />
        </div>

        {/* BAGIAN 7: LINIMASA */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-10 text-gray-900 dark:text-white">
            Perjalanan Kami
          </h3>
          <div ref={timelineRef} className="relative max-w-2xl mx-auto">
            <div
              className={`absolute left-1/2 top-0 h-full w-0.5 bg-gray-300 dark:bg-gray-700 transform -translate-x-1/2 transition-transform duration-1000 ease-out ${
                timelineInView ? "scale-y-100" : "scale-y-0"
              }`}
              style={{ transformOrigin: "top" }}
            ></div>
            {timelineEvents.map((item, index) => (
              <div
                key={index}
                className={`relative mb-8 transition-all duration-500 ease-out`}
                style={{
                  opacity: timelineInView ? 1 : 0,
                  transform: timelineInView
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div
                  className="flex items-center"
                  style={{
                    justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
                  }}
                >
                  <div className="w-[calc(50%-2rem)]">
                    <div
                      className={`p-4 rounded-lg shadow-md ${
                        index % 2 === 0
                          ? "mr-auto bg-white dark:bg-gray-800"
                          : "ml-auto bg-amber-50 dark:bg-amber-900/50"
                      }`}
                    >
                      <p className="font-bold text-amber-600 dark:text-amber-400">
                        {item.year}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {item.event}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div
                      className={`bg-amber-500 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-gray-50 dark:ring-gray-900 transition-all duration-500 ease-out ${
                        timelineInView ? "scale-100" : "scale-0"
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <Milestone className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
