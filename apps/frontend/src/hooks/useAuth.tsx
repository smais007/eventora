/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/lib/axios";

interface User {
  name: string;
  email: string;
  photoURL: string;
}

interface AuthContextType {
  user: User | null;
  register: (...args: any[]) => Promise<void>;
  login: (...args: any[]) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profile = localStorage.getItem("profile");

    if (token && profile) {
      try {
        const parsedUser = JSON.parse(profile);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
      }
    }

    setIsLoading(false);
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    photoURL: string
  ) => {
    const res = await axios.post("/auth/register", {
      name,
      email,
      password,
      photoURL,
    });
    const token = res.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("profile", JSON.stringify({ name, email, photoURL }));
    setUser({ name, email, photoURL });
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("profile", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
