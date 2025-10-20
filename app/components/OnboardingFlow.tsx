"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EmailVerification } from "./verification/EmailVerification";
import { PhoneVerification } from "./verification/PhoneVerification";
import { AddressVerification } from "./verification/AddressVerification";
import { SocialVerification } from "./verification/SocialVerification";
import { RefereeVerification } from "./verification/RefereeVerification";
import { TrustScore } from "./ui/TrustScore";
import { Button } from "./ui/Button";
import { StepProgress } from "./ui/Progress";
import { Card } from "./ui/Card";
import { UserData, TrustScore as TrustScoreType } from "@/app/types";
import { Modal } from "./ui/Modal";

interface OnboardingFlowProps {
  onComplete: (userData: UserData, score: TrustScoreType) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [trustScore, setTrustScore] = useState<TrustScoreType>({
    total: 0,
    breakdown: {
      email: 0,
      phone: 0,
      address: 0,
      social: 0,
      referee: 0,
    },
  });

  const steps = [
    { name: "Email", component: EmailVerification },
    { name: "Phone", component: PhoneVerification },
    { name: "Address", component: AddressVerification },
    { name: "Social", component: SocialVerification },
    { name: "Referee", component: RefereeVerification },
  ];

  const handleEmailComplete = (email: string) => {
    setUserData({ ...userData, email });
    setTrustScore({
      ...trustScore,
      total: trustScore.total + 10,
      breakdown: { ...trustScore.breakdown, email: 10 },
    });
    setTimeout(() => setCurrentStep(1), 500);
  };

  const handlePhoneComplete = (phone: string, simAge: number) => {
    const points = simAge >= 6 ? 15 : 10;
    setUserData({ ...userData, phone });
    setTrustScore({
      ...trustScore,
      total: trustScore.total + points,
      breakdown: { ...trustScore.breakdown, phone: points },
    });
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handleAddressComplete = (
    address: string,
    location: { lat: number; lng: number }
  ) => {
    setUserData({ ...userData, address, location });
    setTrustScore({
      ...trustScore,
      total: trustScore.total + 15,
      breakdown: { ...trustScore.breakdown, address: 15 },
    });
    setTimeout(() => setCurrentStep(3), 500);
  };

  const handleSocialComplete = (profiles: {
    google: boolean;
    linkedin: boolean;
    twitter: boolean;
  }) => {
    const points =
      (profiles.google ? 10 : 0) +
      (profiles.linkedin ? 20 : 0) +
      (profiles.twitter ? 10 : 0);
    setUserData({ ...userData, socialProfiles: profiles });
    setTrustScore({
      ...trustScore,
      total: trustScore.total + points,
      breakdown: { ...trustScore.breakdown, social: points },
    });
    setTimeout(() => setCurrentStep(4), 500);
  };

  const handleRefereeComplete = (referees: any[]) => {
    const verifiedCount = referees.filter((r) => r.verified).length;
    const points = verifiedCount * 20;
    setUserData({ ...userData, referees });
    setTrustScore({
      ...trustScore,
      total: trustScore.total + points,
      breakdown: { ...trustScore.breakdown, referee: points },
    });
    setShowScoreModal(true);
  };

  const handleFinalComplete = () => {
    onComplete(userData, trustScore);
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <StepProgress currentStep={currentStep} totalSteps={steps.length} />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.name}{" "}
            Verification
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {CurrentStepComponent && (
                <CurrentStepComponent
                  onComplete={
                    (currentStep === 0
                      ? handleEmailComplete
                      : currentStep === 1
                      ? handlePhoneComplete
                      : currentStep === 2
                      ? handleAddressComplete
                      : currentStep === 3
                      ? handleSocialComplete
                      : handleRefereeComplete) as any
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {currentStep > 0 && currentStep < steps.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous Step
              </Button>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Trust Score */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        title="Verification Complete!"
        description="Congratulations on building your Digital Trust Score"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <TrustScore
              score={trustScore}
              showBreakdown={false}
              animated={true}
            />
          </div>

          <div className="p-6 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Your account is now ready for use</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Access all banking features instantly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  Your Trust Score can be used across partner platforms
                </span>
              </li>
            </ul>
          </div>

          <Button onClick={handleFinalComplete} className="w-full" size="lg">
            View Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
};
