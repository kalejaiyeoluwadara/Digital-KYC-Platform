"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "../ui/Button";

interface HeaderProps {
  onStartVerification?: () => void;
  showStartButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onStartVerification,
  showStartButton = false,
}) => {
  return (
    <div className="sticky top-0 z-40 py-4">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="w-[90%] lg:w-[70%] mx-auto border border-gray-200 bg-white/80 backdrop-blur-md rounded-full "
      >
        <div className="px-4 sm:px-6 lg:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="md:text-xl text-sm font-bold text-gray-900">
                  Digital KYC Platform
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {showStartButton && onStartVerification && (
                <Button
                  onClick={onStartVerification}
                  size="sm"
                  className="hidden md:px-6 px-4 py-4 md:py-4 !rounded-full sm:block text-xs md:text-base"
                >
                  Start Verification
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>
    </div>
  );
};
