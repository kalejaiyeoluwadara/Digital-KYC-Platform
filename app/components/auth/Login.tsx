"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
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
import { LoginCredentials } from "@/app/types";

interface LoginProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      return;
    }

    const success = await login(credentials);
    if (success) {
      onSuccess();
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue your verification process
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4 pb-6"
        >
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={credentials.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            leftIcon={<Mail className="w-5 h-5" />}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={credentials.password}
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
                <EyeOff className="w-5 mt-6 h-5" />
              ) : (
                <Eye className="w-5 mt-6 h-5" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-black font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </motion.form>
      </CardContent>
    </Card>
  );
};
