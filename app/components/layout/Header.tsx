"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import { User as UserType } from "@/app/types";
import { useAuth } from "@/app/contexts/AuthContext";

interface HeaderProps {
  onStartVerification?: () => void;
  showStartButton?: boolean;
  user?: UserType | null;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onStartVerification,
  showStartButton = false,
  user,
  isAuthenticated = false,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

              {isAuthenticated && user && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>
    </div>
  );
};
