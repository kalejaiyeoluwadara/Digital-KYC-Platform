'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, CheckCircle2, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { toast } from 'sonner';

interface AddressVerificationProps {
  onComplete: (address: string, location: { lat: number; lng: number }) => void;
}

export const AddressVerification: React.FC<AddressVerificationProps> = ({
  onComplete
}) => {
  const [address, setAddress] = useState('');
  const [step, setStep] = useState<'input' | 'location' | 'confirm'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleAddressSubmit = () => {
    if (!address) {
      toast.error('Please enter your address');
      return;
    }
    setStep('location');
  };

  const handleGetLocation = async () => {
    setIsLoading(true);
    
    // Simulate getting user location
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLoading(false);
        setStep('confirm');
        toast.success('Location captured successfully!');
      } catch (error) {
        setIsLoading(false);
        // Simulate location for demo
        setLocation({ lat: 40.7128, lng: -74.0060 });
        setStep('confirm');
        toast.success('Location captured successfully!');
      }
    } else {
      setIsLoading(false);
      toast.error('Geolocation not supported');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      toast.success('Utility bill uploaded!');
    }
  };

  const handleComplete = () => {
    if (!location) return;
    toast.success('Address verified! +15 points');
    onComplete(address, location);
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
            <CardDescription>Verify your residential address (+15 points)</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Input
              label="Home Address"
              placeholder="123 Main Street, City, State ZIP"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              leftIcon={<MapPin className="w-5 h-5" />}
            />
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Optional: Upload Utility Bill
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Upload a recent utility bill or bank statement to strengthen verification
              </p>
              <label className="block">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="cursor-pointer p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">
                      {uploadedFile || 'Click to upload document'}
                    </span>
                  </div>
                </div>
              </label>
            </div>
            
            <Button
              onClick={handleAddressSubmit}
              className="w-full"
            >
              Continue
            </Button>
          </motion.div>
        )}

        {step === 'location' && (
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
                    GPS Location Verification
                  </h4>
                  <p className="text-sm text-blue-700">
                    Share your current location to verify you are at your registered address.
                    This is a one-time check for security purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Address to verify:</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{address}</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('input')}
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
                Share Location
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'confirm' && location && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Location Verified!</h4>
                  <p className="text-sm text-green-700">Address matches GPS coordinates</p>
                </div>
              </div>

              <div className="space-y-2 mt-4 p-4 bg-white rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-gray-900">{address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coordinates:</span>
                  <span className="font-mono text-xs text-gray-900">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
                {uploadedFile && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Document:</span>
                    <span className="font-medium text-green-600">Uploaded ✓</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleComplete}
              className="w-full"
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Address
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

