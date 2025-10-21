"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Download } from "lucide-react";

interface QuickActionsCardProps {
  onDownloadReport: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onDownloadReport,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onDownloadReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Verification Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
