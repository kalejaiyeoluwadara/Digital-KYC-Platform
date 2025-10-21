"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";
import {
  calculateTrustLevel,
  getTrustLevelColor,
  getTrustLevelLabel,
} from "@/app/lib/utils";
import { TrustScore as TrustScoreType } from "@/app/types";

interface TrustScoreProps {
  score: TrustScoreType;
  showBreakdown?: boolean;
  animated?: boolean;
}

export const TrustScore: React.FC<TrustScoreProps> = ({
  score,
  showBreakdown = false,
  animated = true,
}) => {
  const total = score.total;
  const level = calculateTrustLevel(total);
  const color = getTrustLevelColor(level);
  const label = getTrustLevelLabel(level);

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (total / 100) * circumference;

  const breakdownItems = [
    { name: "Email Verification", value: score.breakdown.email, max: 10 },
    { name: "Liveness Check", value: score.breakdown.liveness, max: 20 },
    { name: "Address Verification", value: score.breakdown.address, max: 15 },
    { name: "Social Profile", value: score.breakdown.social, max: 20 },
    { name: "Referee Verification", value: score.breakdown.referee, max: 20 },
  ];

  return (
    <div className="w-full">
      {/* Main Score Display */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="70"
              stroke={color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: animated
                  ? strokeDashoffset
                  : strokeDashoffset,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Shield className="w-8 h-8 mb-2" style={{ color }} />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-5xl font-bold"
              style={{ color }}
            >
              {total}
            </motion.div>
            <div className="text-sm text-gray-600 mt-1">out of 100</div>
          </div>
        </div>

        {/* Trust Level Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 px-6 py-2 rounded-full font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {label}
        </motion.div>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Score Breakdown
          </h4>
          {breakdownItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {item.value === item.max && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.value}/{item.max}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / item.max) * 100}%` }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  className="h-full bg-black rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
