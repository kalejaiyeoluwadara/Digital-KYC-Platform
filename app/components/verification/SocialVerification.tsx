'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, CheckCircle2, Linkedin, Twitter } from 'lucide-react';
import { FaGoogle, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { toast } from 'sonner';

interface SocialVerificationProps {
  onComplete: (profiles: { google: boolean; linkedin: boolean; twitter: boolean }) => void;
}

export const SocialVerification: React.FC<SocialVerificationProps> = ({
  onComplete
}) => {
  const [connectedProfiles, setConnectedProfiles] = useState({
    google: false,
    linkedin: false,
    twitter: false
  });
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleConnect = async (platform: 'google' | 'linkedin' | 'twitter') => {
    setIsLoading(platform);
    
    // Simulate OAuth connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectedProfiles(prev => ({ ...prev, [platform]: true }));
    setIsLoading(null);
    
    const points = platform === 'linkedin' ? 20 : 10;
    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected! +${points} points`);
  };

  const handleContinue = () => {
    onComplete(connectedProfiles);
  };

  const totalPoints = 
    (connectedProfiles.google ? 10 : 0) +
    (connectedProfiles.linkedin ? 20 : 0) +
    (connectedProfiles.twitter ? 10 : 0);

  const platforms = [
    {
      id: 'google' as const,
      name: 'Google',
      icon: FaGoogle,
      points: 10,
      color: '#4285F4',
      description: 'Verify your Google account'
    },
    {
      id: 'linkedin' as const,
      name: 'LinkedIn',
      icon: FaLinkedin,
      points: 20,
      color: '#0A66C2',
      description: 'Connect your professional profile'
    },
    {
      id: 'twitter' as const,
      name: 'Twitter',
      icon: FaTwitter,
      points: 10,
      color: '#1DA1F2',
      description: 'Link your Twitter account'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Social Profile Verification</CardTitle>
            <CardDescription>Connect social accounts to boost your trust score (up to +40 points)</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Current Points */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Points Earned:</span>
              <span className="text-2xl font-bold text-black">{totalPoints} / 40</span>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-3">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              const isConnected = connectedProfiles[platform.id];
              const loading = isLoading === platform.id;

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isConnected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${platform.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: platform.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                          {isConnected && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{platform.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        +{platform.points}
                      </span>
                      <Button
                        size="sm"
                        variant={isConnected ? 'secondary' : 'primary'}
                        onClick={() => handleConnect(platform.id)}
                        disabled={isConnected}
                        isLoading={loading}
                      >
                        {isConnected ? 'Connected' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-2 items-start">
              <Link2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium">Why connect social profiles?</p>
                <p className="mt-1 text-blue-700">
                  Verified work/school domain emails and established social profiles add significant 
                  credibility to your digital identity.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full"
            disabled={totalPoints === 0}
          >
            {totalPoints === 0 ? 'Connect at least one account' : 'Continue'}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

