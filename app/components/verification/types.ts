export interface PhotoEXIFData {
  latitude: number | null;
  longitude: number | null;
  timestamp: Date | null;
}

export interface LocationHistoryEntry {
  timestamp: Date;
  latitude: number;
  longitude: number;
  address: string;
  activity: string;
}

export interface LocationHistoryAnalysis {
  totalEntries: number;
  homeFrequency: number; // percentage of time spent at home address
  consistencyScore: number; // 0-100 score for location consistency
  recentActivity: LocationHistoryEntry[];
  suspiciousPatterns: string[];
  isConsistent: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  gpsMatch: boolean;
  photoEXIFMatch: boolean;
  addressValid: boolean;
  locationHistoryMatch: boolean;
  distance: number; // distance in km between GPS and address
  trustLevel: "high" | "medium" | "low";
  message: string;
  locationHistoryAnalysis?: LocationHistoryAnalysis;
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
}

export interface GPSLocation {
  lat: number;
  lng: number;
}

export type VerificationStep = 
  | "input" 
  | "gps" 
  | "photo" 
  | "location-history" 
  | "validating" 
  | "result";
