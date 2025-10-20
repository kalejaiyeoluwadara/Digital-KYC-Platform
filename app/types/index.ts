// Core types for the KYC application

export interface TrustScore {
  total: number;
  breakdown: {
    email: number;
    phone: number;
    address: number;
    social: number;
    referee: number;
  };
}

export type TrustLevel = 'unverified' | 'medium' | 'trusted';

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
  phone?: string;
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

