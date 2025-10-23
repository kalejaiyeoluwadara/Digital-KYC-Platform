// Core types for the KYC application

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface TrustScore {
  total: number;
  breakdown: {
    email: number;
    address: number;
    social: number;
    referee: number;
  };
}

export type TrustLevel = "unverified" | "medium" | "trusted";

export interface VerificationStep {
  id: string;
  name: string;
  description: string;
  points: number;
  completed: boolean;
  icon: string;
}

export interface UserData {
  email?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  socialProfiles?: {
    google?: boolean;
    linkedin?: boolean;
    twitter?: boolean;
  };
  referees?: RefereeData[];
}

export interface RefereeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  verificationCode?: string;
}
