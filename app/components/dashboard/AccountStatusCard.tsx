"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { CheckCircle2 } from "lucide-react";
import moment from "moment";

export const AccountStatusCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Status</CardTitle>
        <CardDescription>Your verification is complete</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900">Account Verified</h3>
            <p className="text-sm text-green-700">
              Completed on {moment().format("MMMM DD, YYYY")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
