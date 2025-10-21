"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { TrustScore } from "./ui/TrustScore";
import { UserData, TrustScore as TrustScoreType } from "@/app/types";
import { Mail, MapPin, Users, Share2, CheckCircle2, Award } from "lucide-react";
import { Button } from "./ui/Button";
import moment from "moment";

interface DashboardProps {
  userData: UserData;
  trustScore: TrustScoreType;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userData,
  trustScore,
}) => {
  const verificationItems = [
    {
      icon: Mail,
      label: "Email",
      value: userData.email,
      verified: trustScore.breakdown.email > 0,
    },
    {
      icon: MapPin,
      label: "Address",
      value: userData.address,
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your verification is complete</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">
                    Account Verified
                  </h3>
                  <p className="text-sm text-green-700">
                    Completed on {moment().format("MMMM DD, YYYY")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verified Information */}
          <Card>
            <CardHeader>
              <CardTitle>Verified Information</CardTitle>
              <CardDescription>All your verified data points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        <Icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="font-medium text-gray-900">
                          {item.value}
                        </p>
                      </div>
                      {item.verified && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Digital Trust Wallet */}
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
                  Your Digital Trust Wallet contains all your verified
                  credentials. Share it with partner fintech apps for instant
                  onboarding without re-verification.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-black">
                      {trustScore.total}
                    </p>
                    <p className="text-xs text-gray-600">Trust Score</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-black">
                      {verificationItems.filter((i) => i.verified).length}
                    </p>
                    <p className="text-xs text-gray-600">Verifications</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Share Trust Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Trust Score Card */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Trust Score
              </h3>
              <TrustScore
                score={trustScore}
                showBreakdown={true}
                animated={true}
              />
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download Verification Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
