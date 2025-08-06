"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Server } from "lucide-react";

// --- DATA UNTUK TERMINAL ---
const menuData = {
  kopi: ["Espresso", "Americano", "Latte", "The Kernel Panic"],
  "non-kopi": ["Matcha Latte", "Hot Chocolate", "Debug Delight"],
  makanan: [
    "Nasi Goreng Coder",
    "Pizza '404 Not Found'",
    "Indomie 'Stack Overflow'",
  ],
};

const helpText = `
CaffeineOS [Version 1.0.0]
(c) 2025 Caffeine. All rights reserved.

Available commands:
  help      - Menampilkan bantuan ini.
  scan menu - Menampilkan kategori menu yang tersedia.
  show promo- Menampilkan promo spesial hari ini.
  ls        - Melihat isi "direktori".
  cat [file]- Membaca isi "file" (contoh: cat menu.json).
  contact   - Menampilkan informasi kontak.
  clear     - Membersihkan layar terminal.
  caffeine  - Tentang OS ini.
`;

const caffeineAscii = `
   ______      __        __  __              
  / ____/___ _/ /_____ _/ /_/ /   ____  _____
 / /   / __ \`/ __/ __ \`/ __/ /   / __ \\/ ___/
/ /___/ /_/ / /_/ /_/ / /_/ /___/ /_/ / /    
\\____/\\__,_/\\__/\\__,_/\\__/_____/\\____/_/     
                                           
`;

type LineType =
  | "input"
  | "output"
  | "success"
  | "error"
  | "highlight"
  | "system";

// --- KOMPONEN UTAMA ---
export default function TerminalShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [lines, setLines] = useState<{ text: string; type: LineType }[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // [FIXED] Logika Booting ditulis ulang agar aman dan bebas error
  useEffect(() => {
    if (inView && isBooting) {
      const bootSequence: { text: string; delay?: number; type?: LineType }[] =
        [
          { text: "Booting CaffeineOS v1.0...", delay: 100 },
          { text: "Checking system integrity... [OK]", delay: 300 },
          { text: "Loading core modules...", delay: 200 },
          {
            text: "Mounting virtual coffee pot... [SUCCESS]",
            delay: 400,
            type: "success",
          },
          { text: caffeineAscii, delay: 100, type: "system" },
          {
            text: "Welcome to Caffeine Terminal. Type 'help' for a list of commands.",
            delay: 100,
            type: "highlight",
          },
        ];

      let i = 0;
      const processNextLine = () => {
        if (i < bootSequence.length) {
          const currentLine = bootSequence[i];
          setLines((prev) => [
            ...prev,
            { text: currentLine.text, type: currentLine.type || "output" },
          ]);
          i++;
          setTimeout(processNextLine, currentLine.delay || 200);
        } else {
          setIsBooting(false);
        }
      };
      processNextLine();
    }
  }, [inView, isBooting]);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (!isBooting) {
      inputRef.current?.focus();
    }
  }, [isBooting]);

  const handleCommand = (command: string) => {
    const newLines = [
      ...lines,
      { text: `$ ${command}`, type: "input" as const },
    ];
    const [cmd, ...args] = command.trim().toLowerCase().split(" ");

    let output: { text: string; type: LineType }[] = [];

    switch (cmd) {
      case "help":
        output = helpText
          .split("\n")
          .map((line) => ({ text: line, type: "output" }));
        break;
      case "scan":
        if (args[0] === "menu") {
          output = [
            { text: "Scanning menu categories...", type: "output" },
            {
              text: `Found: ${Object.keys(menuData).join(", ")}`,
              type: "success",
            },
          ];
        } else {
          output = [
            {
              text: `Error: Unknown scan target '${args[0]}'. Use 'scan menu'.`,
              type: "error",
            },
          ];
        }
        break;
      case "show":
        if (args[0] === "promo") {
          output = [
            {
              text: 'PROMO: "Debug Delight" Red Velvet Latte - 20% OFF!',
              type: "highlight",
            },
          ];
        } else {
          output = [
            {
              text: `Error: Cannot show '${args[0]}'. Use 'show promo'.`,
              type: "error",
            },
          ];
        }
        break;
      case "ls":
        output = [
          { text: "menu.json  events.txt  contact.info", type: "output" },
        ];
        break;
      case "cat":
        if (args[0] === "menu.json") {
          output = [
            { text: JSON.stringify(menuData, null, 2), type: "output" },
          ];
        } else if (args[0]) {
          output = [
            { text: `Error: File not found: ${args[0]}`, type: "error" },
          ];
        } else {
          output = [{ text: `Usage: cat [filename]`, type: "error" }];
        }
        break;
      case "contact":
        output = [
          {
            text: "Email: hello@caffeine.dev | Phone: (+62) 812-3456-7890",
            type: "output",
          },
        ];
        break;
      case "caffeine":
        output = [
          {
            text: "CaffeineOS - The world's first coffee-powered operating system.",
            type: "highlight",
          },
        ];
        break;
      case "clear":
        setLines([]);
        return;
      default:
        if (command.trim() !== "") {
          output = [
            { text: `Error: command not found: ${command}`, type: "error" },
          ];
        }
    }
    setLines([...newLines, ...output]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const commandToProcess = input.trim();
      if (commandToProcess) {
        setHistory((prev) => [commandToProcess, ...prev]);
      }
      setHistoryIndex(-1);
      handleCommand(commandToProcess);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <section
      id="terminal"
      ref={ref}
      className="py-20 sm:py-24 bg-white dark:bg-black"
    >
      <div
        className={`container mx-auto px-4 transition-all duration-1000 ease-out ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border-2 border-gray-700">
            <div className="h-8 bg-gray-800 flex items-center px-3 gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="text-gray-400 text-xs ml-auto font-mono flex items-center gap-1">
                <Server size={12} /> CaffeineOS
              </div>
            </div>

            <div
              className="p-4 font-mono text-sm text-gray-200 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, index) => (
                <div key={index} className="flex">
                  {line.type === "input" && (
                    <span className="text-green-400 mr-2 flex-shrink-0">$</span>
                  )}
                  <p className="whitespace-pre-wrap flex-grow break-words">
                    <span
                      className={
                        line.type === "success"
                          ? "text-green-400"
                          : line.type === "error"
                          ? "text-red-400"
                          : line.type === "highlight"
                          ? "text-amber-400"
                          : line.type === "system"
                          ? "text-blue-400"
                          : ""
                      }
                    >
                      {line.text}
                    </span>
                  </p>
                </div>
              ))}
              {!isBooting && (
                <div className="flex">
                  <span className="text-green-400 mr-2">$</span>
                  <input
                    ref={inputRef}
                    id="terminal-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none text-gray-200 w-full font-mono text-sm"
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                  />
                </div>
              )}
              <div ref={endOfTerminalRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
