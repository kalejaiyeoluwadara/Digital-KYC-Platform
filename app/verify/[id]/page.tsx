"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Card } from "../../components/ui/Card";
import { TrustScore } from "../../components/ui/TrustScore";
import { VerificationItem } from "../../components/ui/VerificationItem";
import {
  TrustLevel,
  TrustScore as TrustScoreType,
  UserData,
} from "../../types";
import { calculateTrustLevel } from "../../lib/utils";
import { LucideIcon, Mail, Home, Link, Users } from "lucide-react";
import { AuthProvider } from "../../contexts/AuthContext";

// Dummy data for demonstration
const dummyUserData: UserData = {
  email: "john.doe@example.com",
  address: "123 Main St, New York, NY 10001",
  location: {
    lat: 40.7128,
    lng: -74.006,
  },
  socialProfiles: {
    google: true,
    linkedin: true,
    twitter: false,
  },
  referees: [
    {
      id: "1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1-555-0123",
      verified: true,
    },
    {
      id: "2",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1-555-0456",
      verified: true,
    },
  ],
};

const dummyTrustScore: TrustScoreType = {
  total: 85,
  breakdown: {
    email: 20,
    address: 25,
    social: 20,
    referee: 20,
  },
};

const verificationSteps = [
  {
    id: "email",
    name: "Email Verification",
    description: "Verified email address",
    points: 20,
    completed: true,
    icon: Mail,
  },
  {
    id: "address",
    name: "Address Verification",
    description: "Physical address confirmed",
    points: 25,
    completed: true,
    icon: Home,
  },
  {
    id: "social",
    name: "Social Media Verification",
    description: "LinkedIn and Google profiles verified",
    points: 20,
    completed: true,
    icon: Link,
  },
  {
    id: "referee",
    name: "Referee Verification",
    description: "2 referees verified",
    points: 20,
    completed: true,
    icon: Users,
  },
];

function VerifyPageContent() {
  const params = useParams();
  const verificationId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({});
  const [trustScore, setTrustScore] = useState<TrustScoreType>({
    total: 0,
    breakdown: { email: 0, address: 0, social: 0, referee: 0 },
  });

  useEffect(() => {
    // Simulate API call to fetch verification data
    const fetchVerificationData = async () => {
      setIsLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, return dummy data
      setUserData(dummyUserData);
      setTrustScore(dummyTrustScore);
      setIsLoading(false);
    };

    fetchVerificationData();
  }, [verificationId]);

  const trustLevel = calculateTrustLevel(trustScore.total);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showStartButton={false} />
        <main className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading verification data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showStartButton={false} />

      <main className="min-h-[calc(100vh-200px)] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verification Results
            </h1>
            <p className="text-gray-600">
              Verification ID:{" "}
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {verificationId}
              </span>
            </p>
          </div>

          {/* Trust Score Card */}
          <Card className="mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Digital Trust Score
              </h2>
              <TrustScore
                score={trustScore}
                showBreakdown={true}
                animated={true}
              />
              <p className="text-gray-600 mt-4">
                This user has a {trustLevel} trust level based on verified
                information
              </p>
            </div>
          </Card>

          {/* Verification Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Verification Steps */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Verification Steps
              </h3>
              <div className="space-y-3">
                {verificationSteps.map((step, index) => (
                  <VerificationItem
                    key={step.id}
                    label={step.name}
                    value={step.description}
                    verified={step.completed}
                    icon={step.icon}
                    index={index}
                  />
                ))}
              </div>
            </Card>

            {/* User Information */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Verified Information
              </h3>
              <div className="space-y-4">
                {userData.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                )}
                {userData.address && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{userData.address}</p>
                  </div>
                )}
                {userData.socialProfiles && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Social Profiles
                    </p>
                    <div className="flex space-x-4 mt-1">
                      {userData.socialProfiles.google && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Google
                        </span>
                      )}
                      {userData.socialProfiles.linkedin && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          LinkedIn
                        </span>
                      )}
                      {userData.socialProfiles.twitter && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                          Twitter
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {userData.referees && userData.referees.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Referees
                    </p>
                    <p className="text-gray-900">
                      {userData.referees.filter((r) => r.verified).length}{" "}
                      verified referees
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Trust Level Explanation */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What This Means
            </h3>
            <div className="prose max-w-none">
              {trustLevel === "trusted" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-green-800 font-semibold mb-2">
                    High Trust Level
                  </h4>
                  <p className="text-green-700">
                    This user has completed multiple verification steps and
                    has a high trust score. They have verified their email,
                    address, social profiles, and have referees who can vouch
                    for them.
                  </p>
                </div>
              )}
              {trustLevel === "medium" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-yellow-800 font-semibold mb-2">
                    Medium Trust Level
                  </h4>
                  <p className="text-yellow-700">
                    This user has completed some verification steps but may
                    need additional verification to reach a higher trust level.
                  </p>
                </div>
              )}
              {trustLevel === "unverified" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-red-800 font-semibold mb-2">
                    Low Trust Level
                  </h4>
                  <p className="text-red-700">
                    This user has not completed sufficient verification steps.
                    Additional verification is recommended before proceeding.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <AuthProvider>
      <VerifyPageContent />
    </AuthProvider>
  );
}
