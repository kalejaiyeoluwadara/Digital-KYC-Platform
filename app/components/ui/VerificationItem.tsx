"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, CheckCircle2 } from "lucide-react";

interface VerificationItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  verified: boolean;
  index?: number;
}

export const VerificationItem: React.FC<VerificationItemProps> = ({
  icon: Icon,
  label,
  value,
  verified,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
    >
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
        <Icon className="w-5 h-5 text-gray-700" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
      {verified && <CheckCircle2 className="w-5 h-5 text-green-500" />}
    </motion.div>
  );
};
