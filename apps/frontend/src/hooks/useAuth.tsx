
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, photoURL?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('eventSphereUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('eventSphereUsers') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('eventSphereUser', JSON.stringify(userWithoutPassword));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, photoURL?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('eventSphereUsers') || '[]');
      
      if (users.find((u: any) => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        photoURL,
      };

      users.push(newUser);
      localStorage.setItem('eventSphereUsers', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('eventSphereUser', JSON.stringify(userWithoutPassword));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventSphereUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
