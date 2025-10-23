"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { GPSLocation } from "./types";

interface LocationHistoryVerificationProps {
  address: string;
  gpsLocation: GPSLocation;
  isLoading: boolean;
  onAnalyze: () => void;
  onBack: () => void;
}

export const LocationHistoryVerification: React.FC<
  LocationHistoryVerificationProps
> = ({ address, gpsLocation, isLoading, onAnalyze, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const analysisSteps = [
    { text: "Scanning location patterns", color: "text-blue-600" },
    { text: "Analyzing movement data", color: "text-green-600" },
    { text: "Checking consistency", color: "text-purple-600" },
    { text: "Verification complete", color: "text-emerald-600" },
  ];

  useEffect(() => {
    if (isLoading) {
      setShowAnalysis(true);
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % analysisSteps.length);
      }, 800);
      return () => clearInterval(interval);
    } else {
      setShowAnalysis(false);
      setCurrentStep(0);
    }
  }, [isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <motion.div
        className="p-6 bg-blue-50 rounded-lg border border-blue-200 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div>
          <motion.h4
            className="font-semibold text-blue-900 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Google Location History Analysis
          </motion.h4>
          <motion.p
            className="text-sm text-blue-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            We'll analyze your Google location history to verify consistency
            with your provided address. This helps ensure you actually live at
            the address you've entered.
          </motion.p>
        </div>

        {/* Animated background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <motion.div
            className="w-full h-full bg-blue-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="p-4 bg-gray-50 rounded-lg relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p
          className="text-sm text-gray-600 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Address to verify:
        </motion.p>
        <motion.p
          className="text-sm font-semibold text-gray-900 mb-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {address}
        </motion.p>
        <motion.p
          className="text-xs text-gray-500 font-mono"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
        </motion.p>

        {/* Animated pulse effect */}
        <motion.div
          className="absolute inset-0 bg-blue-200 rounded-lg opacity-0"
          animate={{
            opacity: [0, 0.1, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.h5
          className="font-medium text-yellow-900 mb-3"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          What we'll check:
        </motion.h5>
        <ul className="text-sm text-yellow-700 space-y-2">
          {[
            "Frequency of visits to this address",
            "Recent location patterns",
            "Consistency with daily routines",
            "Detection of suspicious travel patterns",
          ].map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <motion.div
                className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button variant="outline" onClick={onBack} className="w-full">
            Back
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button onClick={onAnalyze} isLoading={isLoading} className="w-full">
            {isLoading ? "Analyzing..." : "Analyze Location History"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Animated Analysis Overlay */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full" />
              </motion.div>

              <motion.h3
                className="text-lg font-semibold text-gray-900 mb-2"
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {analysisSteps[currentStep].text}
              </motion.h3>

              <motion.div
                className="w-full bg-gray-200 rounded-full h-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${
                      ((currentStep + 1) / analysisSteps.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>

              <p className="text-sm text-gray-600">
                Please wait while we analyze your location data...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
