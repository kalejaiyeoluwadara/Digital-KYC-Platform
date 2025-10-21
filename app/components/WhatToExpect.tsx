"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Shield } from "lucide-react";

export const WhatToExpect: React.FC = () => {
  const expectations = [
    "Email Verification",
    "Address & Location Check",
    "Social Profile Linking",
    "Referee Authentication",
    "Real-time Trust Score",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="relative w-full rounded-3xl overflow-hidden mb-8 bg-white"
    >
      {/* Decorative Background Elements */}
      <div className="relative z-10 p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">
                Quick & Easy
              </span>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                What to <span className="">Expect</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                A streamlined verification journey designed to build your trust
                score in minutes.
              </p>
            </div>
          </motion.div>

          {/* Right Side - List */}
          <div className="space-y-3">
            {expectations.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.08 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50  hover:shadow-md hover:border-indigo-200 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-10 h-10 ">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-medium group-hover:text-gray-900 transition-colors">
                    {item}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
