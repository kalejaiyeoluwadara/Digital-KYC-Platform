'use client';

import React from 'react';
import { Shield, Lock, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Secure by Design</h3>
              <p className="text-sm text-gray-600">
                Bank-grade encryption protects all your data
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Privacy First</h3>
              <p className="text-sm text-gray-600">
                Your information is never shared without consent
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Instant Verification</h3>
              <p className="text-sm text-gray-600">
                Complete KYC in minutes, not days
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="font-bold text-gray-900">TrustBank</span>
          </div>
          <p className="text-sm text-gray-600">
            © 2025 TrustBank. Digital KYC Platform.
          </p>
        </div>
      </div>
    </footer>
  );
};

