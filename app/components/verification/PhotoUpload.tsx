"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { GPSLocation } from "./types";

interface PhotoUploadProps {
  gpsLocation: GPSLocation;
  gpsAddress: string | null;
  photoFile: File | null;
  photoPreview: string | null;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  gpsLocation,
  gpsAddress,
  photoFile,
  photoPreview,
  onPhotoUpload,
  onBack,
  onNext,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
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

      <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex gap-3 items-start">
          <Camera className="w-6 h-6 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">
              Upload Front Door Photo
            </h4>
            <p className="text-sm text-purple-700">
              Take a photo of your front door or immediate surroundings.
            </p>
          </div>
        </div>
      </div>

      {photoPreview && (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
          <img
            src={photoPreview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Photo Ready ✓
          </div>
        </div>
      )}

      <label className="block">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPhotoUpload}
          className="hidden"
        />
        <div className="cursor-pointer p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors">
          <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
            <Camera className="w-8 h-8" />
            <span className="text-sm font-medium">
              {photoFile ? "Change Photo" : "Take or Upload Photo"}
            </span>
            <span className="text-xs text-gray-500">
              Photo with location data preferred
            </span>
          </div>
        </div>
      </label>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} disabled={!photoFile} className="flex-1">
          Continue to Location History
        </Button>
      </div>
    </motion.div>
  );
};
