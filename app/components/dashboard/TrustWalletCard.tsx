"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Award, Share2 } from "lucide-react";
import { TrustScore } from "@/app/types";

interface TrustWalletCardProps {
  trustScore: TrustScore;
  verifiedCount: number;
  onShare: () => void;
}

export const TrustWalletCard: React.FC<TrustWalletCardProps> = ({
  trustScore,
  verifiedCount,
  onShare,
}) => {
  return (
    <Card hoverable>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-black" />
          <div>
            <CardTitle>Digital Trust Wallet</CardTitle>
            <CardDescription>
              Use your verified identity across platforms
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Your Digital Trust Wallet contains all your verified credentials.
            Share it with partner fintech apps for instant onboarding without
            re-verification.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-black">
                {trustScore.total}
              </p>
              <p className="text-xs text-gray-600">Trust Score</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-black">{verifiedCount}</p>
              <p className="text-xs text-gray-600">Verifications</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Trust Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
