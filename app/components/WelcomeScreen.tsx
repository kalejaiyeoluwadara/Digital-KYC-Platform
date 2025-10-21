"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";
import { WhatToExpect } from "./WhatToExpect";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const features = [
    {
      icon: Zap,
      title: "Fast Verification",
      description: "Complete KYC in under 10 minutes",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Bank-grade encryption for your data",
    },
    {
      icon: CheckCircle2,
      title: "Digital Trust Score",
      description: "Build credibility with verified data",
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full flex items-center justify-center flex-col">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center mt-8 w-20 h-20 bg-black rounded-2xl mb-6"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-5xl text-center font-bold text-gray-900 mb-4">
            Fater Verification, <br /> Seamless Onboarding
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Use your digital signals to verify who you are and where you
            live, hassle-free.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* What to Expect */}
        <WhatToExpect />
      </div>
    </div>
  );
};
