import { useMemo } from "react";
import { TrustScore } from "@/app/types";

interface UseWalletShareResult {
  walletId: string;
  shareUrl: string;
}

export const useWalletShare = (
  trustScore: TrustScore
): UseWalletShareResult => {
  const walletId = useMemo(
    () => `TW-${trustScore.total}-${Date.now().toString(36).toUpperCase()}`,
    [trustScore.total]
  );

  const shareUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/verify/${walletId}`;
  }, [walletId]);

  return { walletId, shareUrl };
};
