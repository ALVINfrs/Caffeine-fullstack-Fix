"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/status", {
        credentials: "include", // ⬅️ penting!
      });
      const data = await response.json();

      if (data.isAuthenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ⬅️ wajib
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      setUser(data.user);
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ⬅️ direkomendasikan juga
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Registration failed");
    }
  };

  const logout = async () => {
    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include", // ⬅️ wajib
    });

    const data = await response.json();

    if (data.success) {
      setUser(null);
    } else {
      throw new Error(data.error || "Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
