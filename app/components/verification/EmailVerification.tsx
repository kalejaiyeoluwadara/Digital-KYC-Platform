"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Send } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { toast } from "sonner";

interface EmailVerificationProps {
  onComplete: (email: string) => void;
  initialEmail?: string;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  onComplete,
  initialEmail = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("verify");
    toast.success("Verification code sent to your email!");
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast.success("Email verified successfully! +15 points");
    onComplete(email);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              Verify your email address to earn trust points
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {step === "input" ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
            />

            <Button
              onClick={handleSendCode}
              isLoading={isLoading}
              className="w-full"
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send Verification Code
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                We sent a 6-digit verification code to:
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {email}
              </p>
            </div>

            <Input
              label="Verification Code"
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              maxLength={6}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("input")}
                className="flex-1"
              >
                Change Email
              </Button>
              <Button
                onClick={handleVerify}
                isLoading={isLoading}
                className="flex-1"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Verify
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
