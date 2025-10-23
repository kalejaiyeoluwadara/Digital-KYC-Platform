"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState, LoginCredentials, RegisterData } from "@/app/types";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("kyc_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            createdAt: new Date(userData.createdAt),
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("kyc_user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For testing: any valid email and password works
      if (
        credentials.email &&
        credentials.email.includes("@") &&
        credentials.password &&
        credentials.password.length >= 1
      ) {
        // Check if user exists in localStorage
        const storedUser = localStorage.getItem("kyc_user");
        let user: User;

        if (storedUser) {
          // Use existing user data
          const userData = JSON.parse(storedUser);
          user = {
            ...userData,
            createdAt: new Date(userData.createdAt),
            isAuthenticated: true,
          };
        } else {
          // Create a new user for testing
          user = {
            id: Date.now().toString(),
            email: credentials.email,
            firstName: "Test",
            lastName: "User",
            createdAt: new Date(),
            isAuthenticated: true,
          };
        }

        setUser(user);
        localStorage.setItem("kyc_user", JSON.stringify(user));
        toast.success("Login successful!");
        return true;
      }

      toast.error("Please enter a valid email and password");
      return false;
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }

      // Validate password strength
      if (data.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user already exists
      const existingUser = localStorage.getItem("kyc_user");
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        if (userData.email === data.email) {
          toast.error("Account with this email already exists");
          return false;
        }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date(),
        isAuthenticated: true,
      };

      setUser(newUser);
      localStorage.setItem("kyc_user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kyc_user");
    toast.success("Logged out successfully");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
