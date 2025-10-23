"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle, Map } from "lucide-react";
import { Button } from "../ui/Button";
import { ValidationResult, GPSLocation } from "./types";

interface ValidationResultsProps {
  validationResult: ValidationResult;
  address: string;
  gpsLocation: GPSLocation | null;
  gpsAddress: string | null;
  onComplete: () => void;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  validationResult,
  address,
  gpsLocation,
  gpsAddress,
  onComplete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {/* Trust Level Banner */}
      <div
        className={`p-6 rounded-lg border-2 ${
          validationResult.trustLevel === "high"
            ? "bg-green-50 border-green-300"
            : validationResult.trustLevel === "medium"
            ? "bg-yellow-50 border-yellow-300"
            : "bg-orange-50 border-orange-300"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          {validationResult.trustLevel === "high" && (
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          )}
          {validationResult.trustLevel === "medium" && (
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          )}
          {validationResult.trustLevel === "low" && (
            <XCircle className="w-8 h-8 text-orange-600" />
          )}
          <div>
            <h4
              className={`font-bold text-lg ${
                validationResult.trustLevel === "high"
                  ? "text-green-900"
                  : validationResult.trustLevel === "medium"
                  ? "text-yellow-900"
                  : "text-orange-900"
              }`}
            >
              {validationResult.trustLevel === "high" && "High Trust Level"}
              {validationResult.trustLevel === "medium" && "Medium Trust Level"}
              {validationResult.trustLevel === "low" && "Low Trust Level"}
            </h4>
            <p
              className={`text-sm ${
                validationResult.trustLevel === "high"
                  ? "text-green-700"
                  : validationResult.trustLevel === "medium"
                  ? "text-yellow-700"
                  : "text-orange-700"
              }`}
            >
              {validationResult.message}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Details */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Verification Details:</h4>

        <div className="p-4 bg-white border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Address Database</span>
            <div className="flex items-center gap-2">
              {validationResult.addressValid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Valid
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    Not Found
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">GPS Location Match</span>
            <div className="flex items-center gap-2">
              {validationResult.gpsMatch ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Matched
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    {validationResult.distance > 0
                      ? `${validationResult.distance.toFixed(2)} km away`
                      : "No Match"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Photo EXIF Location</span>
            <div className="flex items-center gap-2">
              {validationResult.photoEXIFMatch ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Matched
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">
                    Unavailable
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Location History Analysis
            </span>
            <div className="flex items-center gap-2">
              {validationResult.locationHistoryMatch ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Consistent
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    Inconsistent
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Location History Analysis Details */}
        {validationResult.locationHistoryAnalysis && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Map className="w-4 h-4" />
              Location History Analysis
            </h5>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-blue-600 mb-1">
                  Total Entries Analyzed
                </p>
                <p className="text-sm font-semibold text-blue-900">
                  {validationResult.locationHistoryAnalysis.totalEntries}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-1">Home Frequency</p>
                <p className="text-sm font-semibold text-blue-900">
                  {validationResult.locationHistoryAnalysis.homeFrequency.toFixed(
                    1
                  )}
                  %
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-1">Consistency Score</p>
                <p className="text-sm font-semibold text-blue-900">
                  {validationResult.locationHistoryAnalysis.consistencyScore.toFixed(
                    0
                  )}
                  /100
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-1">Status</p>
                <p
                  className={`text-sm font-semibold ${
                    validationResult.locationHistoryAnalysis.isConsistent
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {validationResult.locationHistoryAnalysis.isConsistent
                    ? "Consistent"
                    : "Inconsistent"}
                </p>
              </div>
            </div>

            {validationResult.locationHistoryAnalysis.suspiciousPatterns
              .length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-red-600 mb-2 font-medium">
                  Suspicious Patterns Detected:
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  {validationResult.locationHistoryAnalysis.suspiciousPatterns.map(
                    (pattern, index) => (
                      <li key={index}>• {pattern}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="mt-3">
              <p className="text-xs text-blue-600 mb-2 font-medium">
                Recent Activity (Last 10 entries):
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {validationResult.locationHistoryAnalysis.recentActivity
                  .slice(0, 5)
                  .map((entry, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-xs"
                    >
                      <span className="text-gray-700">{entry.activity}</span>
                      <span className="text-gray-500">
                        {entry.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Address Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Entered Address:</p>
          <p className="text-sm font-semibold text-gray-900">{address}</p>
          {gpsLocation && gpsAddress && (
            <>
              <p className="text-xs text-gray-600 mt-3 mb-1">GPS Location:</p>
              <p className="text-sm text-gray-900">{gpsAddress}</p>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
              </p>
            </>
          )}
        </div>
      </div>

      <Button
        onClick={onComplete}
        className="w-full"
        rightIcon={<CheckCircle2 className="w-4 h-4" />}
      >
        Complete Verification
      </Button>
    </motion.div>
  );
};
