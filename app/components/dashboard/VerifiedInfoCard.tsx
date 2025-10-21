"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { VerificationItem } from "../ui/VerificationItem";
import { LucideIcon } from "lucide-react";

export interface VerificationItemData {
  icon: LucideIcon;
  label: string;
  value: string;
  verified: boolean;
}

interface VerifiedInfoCardProps {
  items: VerificationItemData[];
}

export const VerifiedInfoCard: React.FC<VerifiedInfoCardProps> = ({
  items,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verified Information</CardTitle>
        <CardDescription>All your verified data points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <VerificationItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              verified={item.verified}
              index={index}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
