'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
  height?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
  color = '#000000',
  height = 'md'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[height])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  className
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors',
                index < currentStep
                  ? 'bg-black text-white'
                  : index === currentStep
                  ? 'bg-black text-white ring-4 ring-gray-200'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {index + 1}
            </motion.div>
          </div>
          {index < totalSteps - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-gray-200">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: index < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
                className="h-full bg-black"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

