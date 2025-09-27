'use client';

import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
  error?: string;
}

export default function ProgressBar({ progress, status, message, error }: ProgressBarProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-blue-600';
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return message || 'Processing...';
      case 'success':
        return message || 'Conversion completed!';
      case 'error':
        return error || 'Conversion failed';
      default:
        return 'Ready to convert';
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={cn(
            'text-sm font-medium',
            status === 'processing' && 'text-blue-600',
            status === 'success' && 'text-green-600',
            status === 'error' && 'text-red-600',
            status === 'idle' && 'text-gray-600'
          )}>
            {getStatusText()}
          </span>
        </div>
        {status === 'processing' && (
          <span className="text-sm text-gray-500">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {status === 'processing' && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all duration-300', getStatusColor())}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {status === 'error' && error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
