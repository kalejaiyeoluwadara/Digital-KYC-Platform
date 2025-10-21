"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/Card";
import { TrustScore as TrustScoreComponent } from "./ui/TrustScore";
import { ShareWalletModal } from "./ui/ShareWalletModal";
import { UserData, TrustScore as TrustScoreType } from "@/app/types";
import { Mail, MapPin, Users, Share2 } from "lucide-react";
import { generateVerificationReport } from "@/app/lib/reportGenerator";
import { useWalletShare } from "@/app/hooks/useWalletShare";
import { AccountStatusCard } from "./dashboard/AccountStatusCard";
import { VerifiedInfoCard } from "./dashboard/VerifiedInfoCard";
import { TrustWalletCard } from "./dashboard/TrustWalletCard";
import { QuickActionsCard } from "./dashboard/QuickActionsCard";

interface DashboardProps {
  userData: UserData;
  trustScore: TrustScoreType;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userData,
  trustScore,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const { walletId, shareUrl } = useWalletShare(trustScore);

  const verificationItems = useMemo(
    () => [
      {
        icon: Mail,
        label: "Email",
        value: userData.email || "Not provided",
        verified: trustScore.breakdown.email > 0,
      },
      {
        icon: MapPin,
        label: "Address",
        value: userData.address || "Not provided",
        verified: trustScore.breakdown.address > 0,
      },
      {
        icon: Share2,
        label: "Social Profiles",
        value: `${
          Object.values(userData.socialProfiles || {}).filter(Boolean).length
        } connected`,
        verified: trustScore.breakdown.social > 0,
      },
      {
        icon: Users,
        label: "Referees",
        value: `${
          userData.referees?.filter((r) => r.verified).length || 0
        } verified`,
        verified: trustScore.breakdown.referee > 0,
      },
    ],
    [userData, trustScore]
  );

  const verifiedCount = useMemo(
    () => verificationItems.filter((item) => item.verified).length,
    [verificationItems]
  );

  const handleDownloadReport = () => {
    generateVerificationReport({ userData, trustScore, walletId });
  };

  const handleShareWallet = () => {
    setShowShareModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto md:px-20 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Digital KYC Platform
        </h1>
        <p className="text-gray-600">
          Your account is verified and ready to use
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AccountStatusCard />
          <VerifiedInfoCard items={verificationItems} />
          <TrustWalletCard
            trustScore={trustScore}
            verifiedCount={verifiedCount}
            onShare={handleShareWallet}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Trust Score Card */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Trust Score
              </h3>
              <TrustScoreComponent
                score={trustScore}
                showBreakdown={true}
                animated={true}
              />
            </div>
          </Card>

          <QuickActionsCard onDownloadReport={handleDownloadReport} />
        </div>
      </div>

      {/* Share Trust Wallet Modal */}
      <ShareWalletModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        trustScore={trustScore}
        walletId={walletId}
        shareUrl={shareUrl}
      />
    </div>
  );
};
