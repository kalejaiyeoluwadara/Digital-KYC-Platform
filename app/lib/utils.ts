// Utility functions

import { TrustScore, TrustLevel } from "@/app/types";

export const calculateTrustLevel = (score: number): TrustLevel => {
  if (score >= 80) return "trusted";
  if (score >= 50) return "medium";
  return "unverified";
};

export const getTrustLevelColor = (level: TrustLevel): string => {
  switch (level) {
    case "trusted":
      return "#10B981"; // Green
    case "medium":
      return "#F59E0B"; // Orange
    case "unverified":
      return "#6B7280"; // Gray
  }
};

export const getTrustLevelLabel = (level: TrustLevel): string => {
  switch (level) {
    case "trusted":
      return "Trusted";
    case "medium":
      return "Medium Risk";
    case "unverified":
      return "Unverified";
  }
};

export const calculateTotalScore = (
  breakdown: TrustScore["breakdown"]
): number => {
  return Object.values(breakdown).reduce((sum, value) => sum + value, 0);
};

export const formatPhoneNumber = (phone: string): string => {
  // Format phone number for display
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
