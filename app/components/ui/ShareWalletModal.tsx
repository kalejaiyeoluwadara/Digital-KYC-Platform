"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { TrustScore as TrustScoreType } from "@/app/types";
import { Award, Copy, Mail, QrCode, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ShareWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  trustScore: TrustScoreType;
  walletId: string;
  shareUrl: string;
}

export const ShareWalletModal: React.FC<ShareWalletModalProps> = ({
  isOpen,
  onClose,
  trustScore,
  walletId,
  shareUrl,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleCopyWalletId = () => {
    navigator.clipboard.writeText(walletId);
    toast.success("Wallet ID copied!");
  };

  const handleEmailShare = () => {
    const mailtoLink = `mailto:?subject=My Trust Wallet Verification&body=View my verified identity: ${shareUrl}`;
    window.location.href = mailtoLink;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Trust Wallet"
      description="Share your verified identity with third-party services"
      size="lg"
    >
      <div className="space-y-6">
        {/* Trust Score Summary */}
        <div className="bg-linear-to-br from-black to-gray-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-300">Your Trust Score</p>
              <h3 className="text-4xl font-bold">{trustScore.total}</h3>
            </div>
            <Award className="w-16 h-16 text-white/20" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{trustScore.breakdown.email}</p>
              <p className="text-xs text-gray-300">Email</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {trustScore.breakdown.address}
              </p>
              <p className="text-xs text-gray-300">Address</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {trustScore.breakdown.social}
              </p>
              <p className="text-xs text-gray-300">Social</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {trustScore.breakdown.referee}
              </p>
              <p className="text-xs text-gray-300">Referee</p>
            </div>
          </div>
        </div>

        {/* Wallet ID */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Wallet ID
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={walletId}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm"
            />
            <Button variant="outline" onClick={handleCopyWalletId}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Shareable Link */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Shareable Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">QR Code</p>
              <p className="text-xs text-gray-400 mt-1">Scan to verify</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            QR code generation coming soon
          </p>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Quick Share</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" onClick={handleEmailShare}>
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <ExternalLink className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm mb-1">
                How it works
              </h4>
              <p className="text-sm text-blue-800">
                Share this link with fintech services to instantly verify your
                identity. They can view your trust score and verified
                credentials without requiring you to complete their verification
                process again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
