"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { toast } from "sonner";
import { AddressInputForm } from "./AddressInputForm";
import { GPSLocationCapture } from "./GPSLocationCapture";
import { PhotoUpload } from "./PhotoUpload";
import { LocationHistoryVerification } from "./LocationHistoryVerification";
import { ValidatingStep } from "./ValidatingStep";
import { ValidationResults } from "./ValidationResults";
import {
  AddressData,
  GPSLocation,
  ValidationResult,
  VerificationStep,
  PhotoEXIFData,
  LocationHistoryAnalysis,
} from "./types";
import {
  reverseGeocode,
  extractEXIFData,
  calculateDistance,
  generateLocationHistory,
  analyzeLocationHistory,
  validateAddressInDatabase,
} from "./utils";

interface AddressVerificationProps {
  onComplete: (
    address: string,
    location: { lat: number; lng: number },
    trustLevel: "high" | "medium" | "low",
    points: number
  ) => void;
}

export const AddressVerification: React.FC<AddressVerificationProps> = ({
  onComplete,
}) => {
  const [addressData, setAddressData] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    fullAddress: "",
  });
  const [step, setStep] = useState<VerificationStep>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<GPSLocation | null>(null);
  const [gpsAddress, setGpsAddress] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoEXIF, setPhotoEXIF] = useState<PhotoEXIFData | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [locationHistoryAnalysis, setLocationHistoryAnalysis] = useState<
    LocationHistoryAnalysis | undefined
  >(undefined);

  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressSubmit = () => {
    if (
      !addressData.street ||
      !addressData.city ||
      !addressData.state ||
      !addressData.zipCode
    ) {
      toast.error("Please fill in all address fields");
      return;
    }
    const fullAddress = `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`;
    setAddressData((prev) => ({ ...prev, fullAddress }));
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

        const coords: GPSLocation = {
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
      setStep("location-history");
    }
  };

  const handleLocationHistoryVerification = async () => {
    if (!gpsLocation) {
      toast.error("Missing GPS location data");
      return;
    }

    setIsLoading(true);
    setStep("validating");

    try {
      // Generate simulated location history
      const locationHistory = generateLocationHistory(
        gpsLocation.lat,
        gpsLocation.lng,
        addressData.street,
        addressData.city
      );

      // Analyze the location history
      const analysis = await analyzeLocationHistory(
        locationHistory,
        addressData.fullAddress,
        gpsLocation.lat,
        gpsLocation.lng
      );

      setLocationHistoryAnalysis(analysis);

      // Proceed to final validation
      await handleValidateAddress();
    } catch (error) {
      setIsLoading(false);
      toast.error("Location history analysis failed. Please try again.");
      setStep("location-history");
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
      const exifData = await extractEXIFData(photoFile, gpsLocation);
      setPhotoEXIF(exifData);

      // Validate address in database
      const addressValidation = await validateAddressInDatabase(
        addressData.fullAddress,
        gpsLocation
      );

      // Cross-check all data
      let gpsMatch = false;
      let photoEXIFMatch = false;
      let locationHistoryMatch = false;
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

      // Check location history consistency
      if (locationHistoryAnalysis) {
        locationHistoryMatch = locationHistoryAnalysis.isConsistent;
      }

      // Calculate trust level
      let trustLevel: "high" | "medium" | "low" = "low";
      let message = "";

      if (
        addressValidation.valid &&
        gpsMatch &&
        photoEXIFMatch &&
        locationHistoryMatch
      ) {
        trustLevel = "high";
        message =
          "All verification checks passed! Your address has been fully verified with location history analysis.";
      } else if (addressValidation.valid && gpsMatch && locationHistoryMatch) {
        trustLevel = "medium";
        message =
          "Address verified with GPS and location history match. Photo location data not available or not matching.";
      } else if (addressValidation.valid && gpsMatch) {
        trustLevel = "medium";
        message =
          "Address verified with GPS match. Location history analysis inconclusive.";
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
        locationHistoryMatch,
        distance,
        trustLevel,
        message,
        ...(locationHistoryAnalysis && { locationHistoryAnalysis }),
      };

      setValidationResult(result);
      setIsLoading(false);
      setStep("result");

      if (trustLevel === "high") {
        toast.success("Address fully verified! +25 points");
      } else if (trustLevel === "medium") {
        toast.success("Address verified! +15 points");
      } else {
        toast.error("Address verification incomplete. +10 points");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Verification failed. Please try again.");
      setStep("location-history");
    }
  };

  const handleComplete = () => {
    if (!gpsLocation || !validationResult) return;

    // Calculate points based on trust level
    let points = 0;
    if (validationResult.trustLevel === "high") points = 25;
    else if (validationResult.trustLevel === "medium") points = 15;
    else points = 10;

    onComplete(
      addressData.fullAddress,
      gpsLocation,
      validationResult.trustLevel,
      points
    );
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
            <CardDescription>Verify your address in minutes</CardDescription>
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
              step === "photo" ||
              step === "location-history" ||
              step === "validating" ||
              step === "result"
                ? "bg-black"
                : "bg-gray-200"
            }`}
          />
          <div
            className={`flex-1 h-1 rounded ${
              step === "location-history" ||
              step === "validating" ||
              step === "result"
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
          <AddressInputForm
            addressData={addressData}
            onAddressChange={handleAddressChange}
            onSubmit={handleAddressSubmit}
          />
        )}

        {/* Step 2: GPS Location Capture */}
        {step === "gps" && (
          <GPSLocationCapture
            address={addressData.fullAddress}
            gpsLocation={gpsLocation}
            gpsAddress={gpsAddress}
            isLoading={isLoading}
            onGetLocation={handleGetLocation}
            onBack={() => setStep("input")}
          />
        )}

        {/* Step 3: Photo Upload */}
        {step === "photo" && gpsLocation && (
          <PhotoUpload
            gpsLocation={gpsLocation}
            gpsAddress={gpsAddress}
            photoFile={photoFile}
            photoPreview={photoPreview}
            onPhotoUpload={handlePhotoUpload}
            onBack={() => setStep("gps")}
            onNext={() => setStep("location-history")}
          />
        )}

        {/* Step 4: Location History Verification */}
        {step === "location-history" && gpsLocation && (
          <LocationHistoryVerification
            address={addressData.fullAddress}
            gpsLocation={gpsLocation}
            isLoading={isLoading}
            onAnalyze={handleLocationHistoryVerification}
            onBack={() => setStep("photo")}
          />
        )}

        {/* Step 5: Validating */}
        {step === "validating" && <ValidatingStep />}

        {/* Step 6: Results */}
        {step === "result" && validationResult && (
          <ValidationResults
            validationResult={validationResult}
            address={addressData.fullAddress}
            gpsLocation={gpsLocation}
            gpsAddress={gpsAddress}
            onComplete={handleComplete}
          />
        )}
      </CardContent>
    </Card>
  );
};
