"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Trash2, CheckCircle2, Send } from "lucide-react";
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
import { RefereeData } from "@/app/types";

interface RefereeVerificationProps {
  onComplete: (referees: RefereeData[]) => void;
}

export const RefereeVerification: React.FC<RefereeVerificationProps> = ({
  onComplete,
}) => {
  const [referees, setReferees] = useState<RefereeData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReferee, setNewReferee] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddReferee = () => {
    if (!newReferee.name || !newReferee.email || !newReferee.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    const referee: RefereeData = {
      id: Date.now().toString(),
      name: newReferee.name,
      email: newReferee.email,
      phone: newReferee.phone,
      verified: false,
      verificationCode: Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase(),
    };

    setReferees([...referees, referee]);
    setNewReferee({ name: "", email: "", phone: "" });
    setShowAddForm(false);
    toast.success("Referee added successfully!");
  };

  const handleRemoveReferee = (id: string) => {
    setReferees(referees.filter((r) => r.id !== id));
    toast.info("Referee removed");
  };

  const handleSendVerification = async (id: string) => {
    setIsLoading(true);

    // Simulate sending verification request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setReferees(
      referees.map((r) => (r.id === id ? { ...r, verified: true } : r))
    );
    setIsLoading(false);
    toast.success("Verification request sent!");
  };

  const handleComplete = () => {
    const verifiedCount = referees.filter((r) => r.verified).length;
    const points = verifiedCount * 20;

    toast.success(`${verifiedCount} referee(s) verified! +${points} points`);
    onComplete(referees);
  };

  const verifiedCount = referees.filter((r) => r.verified).length;
  const totalPoints = verifiedCount * 20;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle>Referee Authentication</CardTitle>
            <CardDescription>
              Add up to 2 referees to verify your identity (+20 points each, max
              +40 points)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Points Display */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Verified Referees: {verifiedCount} / 2
              </span>
              <span className="text-2xl font-bold text-black">
                {totalPoints} / 40
              </span>
            </div>
          </div>

          {/* Referees List */}
          <div className="space-y-3">
            <AnimatePresence>
              {referees.map((referee, index) => (
                <motion.div
                  key={referee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${
                    referee.verified
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {referee.name}
                        </h4>
                        {referee.verified && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{referee.email}</p>
                      <p className="text-sm text-gray-600">{referee.phone}</p>
                      {!referee.verified && referee.verificationCode && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                          <span className="text-gray-600">
                            Verification Code:{" "}
                          </span>
                          <span className="font-mono font-bold">
                            {referee.verificationCode}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!referee.verified && (
                        <Button
                          size="sm"
                          onClick={() => handleSendVerification(referee.id)}
                          isLoading={isLoading}
                          rightIcon={<Send className="w-3 h-3" />}
                        >
                          Verify
                        </Button>
                      )}
                      <button
                        onClick={() => handleRemoveReferee(referee.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add Referee Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3"
            >
              <h4 className="font-semibold text-gray-900">Add Referee</h4>
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={newReferee.name}
                onChange={(e) =>
                  setNewReferee({ ...newReferee, name: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={newReferee.email}
                onChange={(e) =>
                  setNewReferee({ ...newReferee, email: e.target.value })
                }
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="08137559976"
                value={newReferee.phone}
                onChange={(e) =>
                  setNewReferee({ ...newReferee, phone: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddReferee} className="flex-1">
                  Add Referee
                </Button>
              </div>
            </motion.div>
          )}

          {/* Add Button */}
          {!showAddForm && referees.length < 2 && (
            <Button
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="w-full"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Referee
            </Button>
          )}

          {/* Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-2 items-start">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium">How referee verification works</p>
                <p className="mt-1 text-blue-700">
                  Your referees will receive a verification code to confirm they
                  know you. Each verified referee adds +20 points to your trust
                  score.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className="w-full"
            disabled={referees.length === 0}
          >
            {referees.length === 0 ? "Add at least one referee" : "Continue"}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};
