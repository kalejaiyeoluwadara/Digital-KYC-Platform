'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const features = [
    {
      icon: Zap,
      title: 'Fast Verification',
      description: 'Complete KYC in under 10 minutes'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Bank-grade encryption for your data'
    },
    {
      icon: CheckCircle2,
      title: 'Digital Trust Score',
      description: 'Build credibility with verified data'
    }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-2xl mb-6"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to TrustBank
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of digital banking with our instant KYC verification. 
            Build your Digital Trust Score and get started in minutes.
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
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* What to Expect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Email & Phone Verification',
              'Address & Location Check',
              'Social Profile Linking',
              'Referee Authentication',
              'Real-time Trust Score',
              'Instant Account Approval'
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <Button
            onClick={onStart}
            size="lg"
            className="px-12"
          >
            Start Verification
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Takes about 10 minutes • Completely secure
          </p>
        </motion.div>
      </div>
    </div>
  );
};

