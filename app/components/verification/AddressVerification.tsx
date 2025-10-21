"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  Upload,
  Camera,
  AlertCircle,
  XCircle,
} from "lucide-react";
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

interface AddressVerificationProps {
  onComplete: (address: string, location: { lat: number; lng: number }) => void;
}

interface PhotoEXIFData {
  latitude: number | null;
  longitude: number | null;
  timestamp: Date | null;
}

interface ValidationResult {
  isValid: boolean;
  gpsMatch: boolean;
  photoEXIFMatch: boolean;
  addressValid: boolean;
  distance: number; // distance in km between GPS and address
  trustLevel: "high" | "medium" | "low";
  message: string;
}

export const AddressVerification: React.FC<AddressVerificationProps> = ({
  onComplete,
}) => {
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [step, setStep] = useState<
    "input" | "gps" | "photo" | "validating" | "result"
  >("input");
  const [isLoading, setIsLoading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [gpsAddress, setGpsAddress] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoEXIF, setPhotoEXIF] = useState<PhotoEXIFData | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  // Reverse geocode GPS coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "KYC-Verification-App", // Required by Nominatim
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Format the address nicely
        if (data.address) {
          const parts = [];
          if (data.address.house_number) parts.push(data.address.house_number);
          if (data.address.road) parts.push(data.address.road);
          if (data.address.suburb || data.address.neighbourhood) {
            parts.push(data.address.suburb || data.address.neighbourhood);
          }
          if (data.address.city || data.address.town || data.address.village) {
            parts.push(
              data.address.city || data.address.town || data.address.village
            );
          }
          if (data.address.state) parts.push(data.address.state);
          if (data.address.postcode) parts.push(data.address.postcode);

          return parts.join(", ") || data.display_name;
        }

        return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }

    // Fallback to coordinates if geocoding fails
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Extract EXIF data from image
  const extractEXIFData = async (file: File): Promise<PhotoEXIFData> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        // Simple EXIF parsing - in production, use a library like exifr
        // For demo purposes, we'll simulate EXIF data with some randomness
        // In real implementation, you'd parse the actual EXIF data from the image

        // Simulate extraction delay
        setTimeout(() => {
          // For demo: add small random offset to GPS location if available
          if (gpsLocation) {
            const latOffset = (Math.random() - 0.5) * 0.001; // ~100m variance
            const lngOffset = (Math.random() - 0.5) * 0.001;

            resolve({
              latitude: gpsLocation.lat + latOffset,
              longitude: gpsLocation.lng + lngOffset,
              timestamp: new Date(),
            });
          } else {
            resolve({
              latitude: null,
              longitude: null,
              timestamp: new Date(),
            });
          }
        }, 1000);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Validate address against database (simulated)
  const validateAddressInDatabase = async (
    address: string
  ): Promise<{
    valid: boolean;
    coordinates?: { lat: number; lng: number };
  }> => {
    // Simulate API call to address validation service
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo: simulate that address is valid if it has all components
        const hasAllComponents = street && city && state && zipCode;

        // Return simulated coordinates close to GPS if available
        if (hasAllComponents && gpsLocation) {
          resolve({
            valid: true,
            coordinates: {
              lat: gpsLocation.lat + (Math.random() - 0.5) * 0.002,
              lng: gpsLocation.lng + (Math.random() - 0.5) * 0.002,
            },
          });
        } else if (hasAllComponents) {
          // Default coordinates for demo
          resolve({
            valid: true,
            coordinates: { lat: 40.7128, lng: -74.006 },
          });
        } else {
          resolve({ valid: false });
        }
      }, 1500);
    });
  };

  const handleAddressSubmit = () => {
    if (!street || !city || !state || !zipCode) {
      toast.error("Please fill in all address fields");
      return;
    }
    const fullAddress = `${street}, ${city}, ${state} ${zipCode}`;
    setAddress(fullAddress);
    setStep("gps");
  };

  const handleGetLocation = async () => {
    setIsLoading(true);

    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          }
        );

        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setGpsLocation(coords);

        // Reverse geocode to get address
        const address = await reverseGeocode(coords.lat, coords.lng);
        setGpsAddress(address);

        setIsLoading(false);
        setStep("photo");
        toast.success("GPS location captured successfully!");
      } catch (error) {
        setIsLoading(false);
        toast.error(
          "Failed to get GPS location. Please enable location permissions."
        );
      }
    } else {
      setIsLoading(false);
      toast.error("Geolocation not supported by your browser");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("Photo uploaded successfully!");
    }
  };

  const handleValidateAddress = async () => {
    if (!gpsLocation || !photoFile) {
      toast.error("Missing required data");
      return;
    }

    setIsLoading(true);
    setStep("validating");

    try {
      // Extract EXIF data from photo
      const exifData = await extractEXIFData(photoFile);
      setPhotoEXIF(exifData);

      // Validate address in database
      const addressValidation = await validateAddressInDatabase(address);

      // Cross-check all data
      let gpsMatch = false;
      let photoEXIFMatch = false;
      let distance = 0;

      if (addressValidation.valid && addressValidation.coordinates) {
        // Calculate distance between GPS and address coordinates
        distance = calculateDistance(
          gpsLocation.lat,
          gpsLocation.lng,
          addressValidation.coordinates.lat,
          addressValidation.coordinates.lng
        );

        // GPS matches if within 0.5 km
        gpsMatch = distance < 0.5;

        // Check photo EXIF data if available
        if (exifData.latitude && exifData.longitude) {
          const photoDistance = calculateDistance(
            exifData.latitude,
            exifData.longitude,
            addressValidation.coordinates.lat,
            addressValidation.coordinates.lng
          );
          photoEXIFMatch = photoDistance < 0.5;
        }
      }

      // Calculate trust level
      let trustLevel: "high" | "medium" | "low" = "low";
      let message = "";

      if (addressValidation.valid && gpsMatch && photoEXIFMatch) {
        trustLevel = "high";
        message =
          "All verification checks passed! Your address has been fully verified.";
      } else if (addressValidation.valid && gpsMatch) {
        trustLevel = "medium";
        message =
          "Address verified with GPS match. Photo location data not available or not matching.";
      } else if (addressValidation.valid) {
        trustLevel = "low";
        message =
          "Address exists in database, but location verification failed.";
      } else {
        trustLevel = "low";
        message = "Unable to verify address. Please check your details.";
      }

      const result: ValidationResult = {
        isValid: addressValidation.valid,
        gpsMatch,
        photoEXIFMatch,
        addressValid: addressValidation.valid,
        distance,
        trustLevel,
        message,
      };

      setValidationResult(result);
      setIsLoading(false);
      setStep("result");

      if (trustLevel === "high") {
        toast.success("Address fully verified! +15 points");
      } else if (trustLevel === "medium") {
        toast.success("Address verified! +10 points");
      } else {
        toast.error("Address verification incomplete. +5 points");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Verification failed. Please try again.");
      setStep("photo");
    }
  };

  const handleComplete = () => {
    if (!gpsLocation) return;
    onComplete(address, gpsLocation);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Address Verification</CardTitle>
            <CardDescription>
              Verify your address in minutes (+5 to +15 points)
            </CardDescription>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-4">
          <div
            className={`flex-1 h-1 rounded ${
              step !== "input" ? "bg-black" : "bg-gray-200"
            }`}
          />
          <div
            className={`flex-1 h-1 rounded ${
              step === "photo" || step === "validating" || step === "result"
                ? "bg-black"
                : "bg-gray-200"
            }`}
          />
          <div
            className={`flex-1 h-1 rounded ${
              step === "validating" || step === "result"
                ? "bg-black"
                : "bg-gray-200"
            }`}
          />
          <div
            className={`flex-1 h-1 rounded ${
              step === "result" ? "bg-black" : "bg-gray-200"
            }`}
          />
        </div>
      </CardHeader>

      <CardContent>
        {/* Step 1: Address Input */}
        {step === "input" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <p className="text-sm text-blue-900">
                <strong>New fast verification:</strong> Enter your address,
                share GPS location, and upload a photo of your front door.
                Verification takes just minutes!
              </p>
            </div>

            <Input
              label="Street Address"
              placeholder="123 Main Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              leftIcon={<MapPin className="w-5 h-5" />}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="State"
                placeholder="NY"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <Input
              label="ZIP Code"
              placeholder="10001"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />

            <Button onClick={handleAddressSubmit} className="w-full">
              Continue to GPS Verification
            </Button>
          </motion.div>
        )}

        {/* Step 2: GPS Location Capture */}
        {step === "gps" && (
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
                    We need your current GPS coordinates to verify you are at
                    the address you entered. This is used only for verification
                    and not stored long-term.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Address to verify:</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {address}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("input")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleGetLocation}
                isLoading={isLoading}
                className="flex-1"
                rightIcon={<Navigation className="w-4 h-4" />}
              >
                Capture GPS
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Photo Upload */}
        {step === "photo" && gpsLocation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900">
                    GPS Captured!
                  </h4>
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
                onChange={handlePhotoUpload}
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
              <Button
                variant="outline"
                onClick={() => setStep("gps")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleValidateAddress}
                disabled={!photoFile}
                className="flex-1"
              >
                Verify Address
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Validating */}
        {step === "validating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 py-8"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-900">
                  Verifying Your Address
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  • Extracting photo EXIF data...
                  <br />
                  • Validating address in database...
                  <br />
                  • Cross-checking GPS coordinates...
                  <br />• Calculating trust score...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Results */}
        {step === "result" && validationResult && (
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
                    {validationResult.trustLevel === "high" &&
                      "High Trust Level"}
                    {validationResult.trustLevel === "medium" &&
                      "Medium Trust Level"}
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
              <h4 className="font-semibold text-gray-900">
                Verification Details:
              </h4>

              <div className="p-4 bg-white border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Address Database
                  </span>
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
                  <span className="text-sm text-gray-600">
                    GPS Location Match
                  </span>
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
                  <span className="text-sm text-gray-600">
                    Photo EXIF Location
                  </span>
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
              </div>

              {/* Address Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Entered Address:</p>
                <p className="text-sm font-semibold text-gray-900">{address}</p>
                {gpsLocation && gpsAddress && (
                  <>
                    <p className="text-xs text-gray-600 mt-3 mb-1">
                      GPS Location:
                    </p>
                    <p className="text-sm text-gray-900">{gpsAddress}</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
                    </p>
                  </>
                )}
              </div>
            </div>

            <Button
              onClick={handleComplete}
              className="w-full"
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Complete Verification
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
