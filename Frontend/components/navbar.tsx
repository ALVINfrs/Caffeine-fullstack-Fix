"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Search, ShoppingCart, User, MenuIcon, Sun, Moon } from "lucide-react";
import SearchForm from "./search-form";
import ShoppingCartPanel from "./shopping-cart-panel";
import UserPanel from "./user-panel";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { cart } = useCart();
  const { toast } = useToast();

  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navbarRef = useRef<HTMLElement>(null);

  // Handle theme mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll for fixed navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsNavbarFixed(true);
      } else {
        setIsNavbarFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsCartOpen(false);
        setIsUserPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setIsUserPanelOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsUserPanelOpen(false);
  };

  const toggleCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view your cart",
        variant: "destructive",
      });
      setIsUserPanelOpen(true);
      return;
    }

    setIsCartOpen(!isCartOpen);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserPanelOpen(false);
  };

  const toggleUserPanel = () => {
    setIsUserPanelOpen(!isUserPanelOpen);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsCartOpen(false);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      ref={navbarRef}
      className={`w-full py-4 px-4 md:px-8 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isNavbarFixed
          ? "shadow-lg dark:bg-black/90 dark:bg-opacity-80 backdrop-blur-md light:bg-white/95 light:bg-opacity-90"
          : "dark:bg-black/70 light:bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo with pulse animation on hover */}
        <Link
          href="/"
          className="text-2xl font-bold text-amber-600 hover:text-amber-500 transition-all duration-300 transform hover:scale-105"
        >
          <span className="relative">
            &lt;Caffeine/&gt;
            <span className="absolute inset-0 rounded-full bg-amber-600 opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
          </span>
        </Link>

        {/* Navigation Links with underline animation */}
        <div
          className={`navbar-nav absolute top-full left-0 w-full py-5 lg:block lg:static lg:bg-transparent lg:max-w-full lg:shadow-none lg:rounded-none lg:py-0 transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "block opacity-100 translate-y-0"
              : "hidden opacity-0 lg:opacity-100 lg:translate-y-0 translate-y-2"
          } lg:flex lg:items-center dark:bg-black/95 light:bg-white/95 backdrop-blur-md lg:backdrop-blur-none`}
        >
          {["home", "about", "menu", "contact"].map((item) => (
            <Link
              key={item}
              href={`#${item}`}
              className="group relative block text-base py-2 px-8 lg:px-4 mx-2 lg:mx-1 dark:text-white light:text-gray-800 hover:text-amber-500 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item === "home"
                ? "HOME"
                : item === "about"
                ? "Tentang Kami"
                : item === "menu"
                ? "Menu"
                : "Contact"}
              <span className="absolute left-1/2 bottom-0 h-0.5 bg-amber-500 w-0 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Icon Buttons with bounce animation */}
        <div className="navbar-extra flex items-center space-x-2 md:space-x-3 lg:space-x-4">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200/30 dark:hover:bg-gray-700/30 transition-all duration-300 hover:rotate-12"
              title="Toggle Dark/Light Mode"
            >
              {theme === "dark" ? (
                <Sun
                  size={20}
                  className="text-amber-400 hover:text-amber-300"
                />
              ) : (
                <Moon
                  size={20}
                  className="text-amber-600 hover:text-amber-500"
                />
              )}
            </button>
          )}

          <button
            onClick={toggleSearch}
            className="p-2 rounded-full hover:bg-gray-200/30 dark:hover:bg-gray-700/30 transition-all duration-300 hover:scale-110"
            title="Search"
          >
            <Search size={20} className="text-amber-600 dark:text-amber-400" />
          </button>

          <button
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-gray-200/30 dark:hover:bg-gray-700/30 transition-all duration-300 hover:scale-110 relative"
            title="Cart"
          >
            <ShoppingCart
              size={20}
              className="text-amber-600 dark:text-amber-400"
            />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={toggleUserPanel}
            className="p-2 rounded-full hover:bg-gray-200/30 dark:hover:bg-gray-700/30 transition-all duration-300 hover:scale-110"
            title="User"
          >
            <User size={20} className="text-amber-600 dark:text-amber-400" />
          </button>

          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-200/30 dark:hover:bg-gray-700/30 transition-all duration-300 lg:hidden"
            title="Menu"
          >
            <MenuIcon
              size={20}
              className={`text-amber-600 dark:text-amber-400 transition-transform duration-300 ${
                isMenuOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {/* Overlays */}
        <SearchForm isOpen={isSearchOpen} />
        <ShoppingCartPanel isOpen={isCartOpen} />
        <UserPanel
          isOpen={isUserPanelOpen}
          showRegisterForm={showRegisterForm}
          setShowRegisterForm={setShowRegisterForm}
        />
      </div>
    </nav>
  );
}
