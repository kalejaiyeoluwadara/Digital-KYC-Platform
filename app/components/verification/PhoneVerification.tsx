"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, CheckCircle2, Smartphone, Signal } from "lucide-react";
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
import moment from "moment";

interface PhoneVerificationProps {
  onComplete: (phone: string, simAge: number) => void;
  initialPhone?: string;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  onComplete,
  initialPhone = "",
}) => {
  const [phone, setPhone] = useState(initialPhone);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"input" | "verify" | "sim-check">("input");
  const [isLoading, setIsLoading] = useState(false);
  const [simAge, setSimAge] = useState<number>(0);

  const handleSendCode = async () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("verify");
    toast.success("Verification code sent via SMS!");
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    // Simulate API call and SIM age check
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate SIM age (random between 3-24 months)
    const randomSimAge = Math.floor(Math.random() * 21) + 3;
    setSimAge(randomSimAge);
    setIsLoading(false);
    setStep("sim-check");
  };

  const handleComplete = () => {
    const points = simAge >= 6 ? 15 : 10;
    toast.success(`Phone verified! +${points} points`);
    onComplete(phone, simAge);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Phone & SIM Verification</CardTitle>
            <CardDescription>
              Verify your phone number and SIM age (+15 points)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {step === "input" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Input
              label="Phone Number"
              type="tel"
              placeholder="08137559976"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              leftIcon={<Phone className="w-5 h-5" />}
            />

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-2 items-start">
                <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium">Why we check SIM age?</p>
                  <p className="mt-1 text-blue-700">
                    SIM cards active for 6+ months add credibility to your
                    profile.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSendCode}
              isLoading={isLoading}
              className="w-full"
            >
              Send Verification Code
            </Button>
          </motion.div>
        )}

        {step === "verify" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                We sent a 6-digit code to:
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {phone}
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
                Change Number
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

        {step === "sim-check" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Signal className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">
                    SIM Verified!
                  </h4>
                  <p className="text-sm text-green-700">
                    Your SIM card has been validated
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-600">SIM Age</p>
                  <p className="text-lg font-bold text-gray-900">
                    {simAge} months
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="text-lg font-bold text-green-600">
                    {simAge >= 6 ? "Trusted" : "Active"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleComplete}
              className="w-full"
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
