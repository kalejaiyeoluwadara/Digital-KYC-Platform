"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { GPSLocation } from "./types";

interface GPSLocationCaptureProps {
  address: string;
  gpsLocation: GPSLocation | null;
  gpsAddress: string | null;
  isLoading: boolean;
  onGetLocation: () => void;
  onBack: () => void;
}

export const GPSLocationCapture: React.FC<GPSLocationCaptureProps> = ({
  address,
  gpsLocation,
  gpsAddress,
  isLoading,
  onGetLocation,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex gap-3 items-start">
          <Navigation className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Live GPS Location Required
            </h4>
            <p className="text-sm text-blue-700">
              We need your current GPS coordinates to verify you are at the
              address you entered. This is used only for verification and not
              stored long-term.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Address to verify:</p>
        <p className="text-sm font-semibold text-gray-900 mt-1">{address}</p>
      </div>

      {gpsLocation && (
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900">GPS Captured!</h4>
              <p className="text-sm text-green-700 mt-1">
                {gpsAddress || "Fetching address..."}
              </p>
              <p className="text-xs text-green-600 font-mono mt-1">
                {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={onGetLocation}
          isLoading={isLoading}
          className="flex-1"
          rightIcon={<Navigation className="w-4 h-4" />}
        >
          {gpsLocation ? "Recapture GPS" : "Capture GPS"}
        </Button>
      </div>
    </motion.div>
  );
};
