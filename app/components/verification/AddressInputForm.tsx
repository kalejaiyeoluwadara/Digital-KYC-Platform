"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AddressData } from "./types";

interface AddressInputFormProps {
  addressData: AddressData;
  onAddressChange: (field: keyof AddressData, value: string) => void;
  onSubmit: () => void;
}

export const AddressInputForm: React.FC<AddressInputFormProps> = ({
  addressData,
  onAddressChange,
  onSubmit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
        <p className="text-sm text-blue-900">
          <strong>New fast verification:</strong> Enter your address, share GPS
          location, and upload a photo of your front door. Verification takes
          just minutes!
        </p>
      </div>

      <Input
        label="Street Address"
        placeholder="17 Toyin Street"
        value={addressData.street}
        onChange={(e) => onAddressChange("street", e.target.value)}
        leftIcon={<MapPin className="w-5 h-5" />}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="City"
          placeholder="Abeokuta"
          value={addressData.city}
          onChange={(e) => onAddressChange("city", e.target.value)}
        />
        <Input
          label="State"
          placeholder="Lagos"
          value={addressData.state}
          onChange={(e) => onAddressChange("state", e.target.value)}
        />
      </div>

      <Input
        label="ZIP Code"
        placeholder="10001"
        value={addressData.zipCode}
        onChange={(e) => onAddressChange("zipCode", e.target.value)}
      />

      <Button onClick={onSubmit} className="w-full">
        Continue to GPS Verification
      </Button>
    </motion.div>
  );
};
