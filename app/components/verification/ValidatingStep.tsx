"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ValidatingStep: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const validationSteps = [
    "Extracting photo EXIF data...",
    "Validating address in database...",
    "Cross-checking GPS coordinates...",
    "Analyzing location history patterns...",
    "Calculating trust score...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % validationSteps.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 py-8"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <motion.div
            className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <div className="text-center">
          <motion.h3
            className="font-semibold text-lg text-gray-900 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Verifying Your Address
          </motion.h3>

          <div className="space-y-2">
            {validationSteps.map((step, index) => (
              <motion.div
                key={step}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`w-2 h-2 rounded-full ${
                    index < currentStep
                      ? "bg-green-500"
                      : index === currentStep
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                  animate={
                    index === currentStep
                      ? {
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1,
                    repeat: index === currentStep ? Infinity : 0,
                  }}
                />
                <span
                  className={`text-sm ${
                    index < currentStep
                      ? "text-green-600"
                      : index === currentStep
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
