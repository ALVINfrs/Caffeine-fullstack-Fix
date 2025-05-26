"use client";

import type React from "react";
import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  ShoppingBag,
  LogOut,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import OrderHistory from "./order-history";

interface UserPanelProps {
  isOpen: boolean;
  showRegisterForm: boolean;
  setShowRegisterForm: (show: boolean) => void;
}

export default function UserPanel({
  isOpen,
  showRegisterForm,
  setShowRegisterForm,
}: UserPanelProps) {
  const { user, login, register, logout } = useAuth();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showOrders, setShowOrders] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!",
      });
    } catch (error) {
      toast({
        title: "Login Gagal",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.phone
      );
      toast({
        title: "Registrasi Berhasil",
        description: "Akun Anda telah dibuat. Silakan login.",
      });
      setShowRegisterForm(false);
    } catch (error) {
      toast({
        title: "Registrasi Gagal",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari akun",
      });
    } catch (error) {
      toast({
        title: "Logout Gagal",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`user-panel absolute top-full right-0 w-full md:w-80 lg:w-96 
        bg-white/90 dark:bg-black/80 backdrop-blur-md p-6 rounded-xl shadow-lg 
        transition-all duration-300 transform border border-gray-200/50 dark:border-gray-700/50
        ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-[-10px] opacity-0 pointer-events-none"
        } max-h-[80vh] overflow-y-auto`}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        .ripple-effect::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.3s ease-out;
        }
        .button-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            background 0.2s ease;
        }
        .button-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0, 170, 91, 0.2);
        }
        .menu-hover {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .menu-hover:hover {
          transform: translateX(4px);
        }
        @media (prefers-color-scheme: light) {
          .menu-hover:hover {
            background: rgba(243, 244, 246, 0.8);
          }
        }
        @media (prefers-color-scheme: dark) {
          .menu-hover:hover {
            background: rgba(55, 65, 81, 0.5);
          }
        }
      `}</style>

      {user ? (
        <div className="user-panel-content logged-in animate-fadeIn">
          <h3 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-white">
            Selamat datang, <span id="user-name">{user.name}</span>
          </h3>
          <div className="user-menu space-y-2">
            <Link
              href="/profile"
              className="flex items-center space-x-3 p-3 rounded-md text-gray-800 dark:text-white text-base menu-hover"
            >
              <User size={16} className="text-gray-500 dark:text-gray-400" />
              <span>Profil</span>
            </Link>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-md text-gray-800 dark:text-white text-base menu-hover"
              onClick={(e) => {
                e.preventDefault();
                setShowOrders(!showOrders);
              }}
            >
              <ShoppingBag
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
              <span>Pesanan</span>
            </a>
            {showOrders && <OrderHistory />}
            <Link
              href="/reservation/history"
              className="flex items-center space-x-3 p-3 rounded-md text-gray-800 dark:text-white text-base menu-hover"
            >
              <Calendar
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
              <span>Riwayat Reservasi</span>
            </Link>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-md text-gray-800 dark:text-white text-base menu-hover"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <LogOut size={16} className="text-gray-500 dark:text-gray-400" />
              <span>Logout</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="user-panel-content logged-out">
          {showRegisterForm ? (
            <div className="register-form animate-fadeIn">
              <h3 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-white">
                Registrasi
              </h3>
              <form id="register-form" onSubmit={handleRegisterSubmit}>
                <div className="input-group mb-4 relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="register-name"
                    placeholder="Nama"
                    required
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00AA5B] transition-all duration-200"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                  />
                </div>
                <div className="input-group mb-4 relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    id="register-email"
                    placeholder="Email"
                    required
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00AA5B] transition-all duration-200"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="input-group mb-4 relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    id="register-password"
                    placeholder="Password"
                    required
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00AA5B] transition-all duration-200"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="input-group mb-5 relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="register-phone"
                    placeholder="No. Telepon"
                    required
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00AA5B] transition-all duration-200"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white text-base font-medium ripple-effect button-hover"
                >
                  Registrasi
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                Sudah punya akun?{" "}
                <a
                  href="#"
                  className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRegisterForm(false);
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          ) : (
            <div className="login-form animate-fadeIn">
              <h3 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-white">
                Login
              </h3>
              <form id="login-form" onSubmit={handleLoginSubmit}>
                <div className="input-group mb-4 relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    id="login-email"
                    placeholder="Email"
                    required
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00AA5B] transition-all duration-200"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />
                </div>
                <div className="input-group mb-5 relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Password"
                    required
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00AA5B] transition-all duration-200"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white text-base font-medium ripple-effect button-hover"
                >
                  Login
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                Belum punya akun?{" "}
                <a
                  href="#"
                  className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRegisterForm(true);
                  }}
                >
                  Daftar Sekarang
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
