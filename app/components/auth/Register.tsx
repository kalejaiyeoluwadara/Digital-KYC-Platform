"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { useAuth } from "@/app/contexts/AuthContext";
import { RegisterData } from "@/app/types";

interface RegisterProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      return;
    }

    const success = await register(formData);
    if (success) {
      onSuccess();
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isPasswordValid = formData.password.length >= 6;
  const doPasswordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  return (
    <Card className="max-h-[90vh] overflow-y-auto">
      <CardHeader className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Get started with your digital identity verification
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4 pb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
              required
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            leftIcon={<Mail className="w-5 h-5" />}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password validation indicators */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isPasswordValid ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {isPasswordValid && (
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                )}
              </div>
              <span
                className={isPasswordValid ? "text-green-600" : "text-gray-500"}
              >
                At least 6 characters
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  doPasswordsMatch ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {doPasswordsMatch && (
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                )}
              </div>
              <span
                className={
                  doPasswordsMatch ? "text-green-600" : "text-gray-500"
                }
              >
                Passwords match
              </span>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            disabled={!isPasswordValid || !doPasswordsMatch}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-black font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.form>
      </CardContent>
    </Card>
  );
};
