'use client';

import { PDFOptions } from '@/types';
import { Settings, FileText, RotateCw, Ruler } from 'lucide-react';
import { useState } from 'react';

interface OptionsPanelProps {
  options: PDFOptions;
  onOptionsChange: (options: PDFOptions) => void;
  disabled?: boolean;
}

export default function OptionsPanel({ options, onOptionsChange, disabled = false }: OptionsPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const handlePageSizeChange = (pageSize: PDFOptions['pageSize']) => {
    onOptionsChange({ ...options, pageSize });
  };

  const handleOrientationChange = (orientation: PDFOptions['orientation']) => {
    onOptionsChange({ ...options, orientation });
  };

  const handleMarginsChange = (margins: PDFOptions['margins']) => {
    onOptionsChange({ ...options, margins });
  };

  const handleQualityChange = (quality: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(quality)));
    onOptionsChange({ ...options, quality: clamped });
  };

  const handleMaxDPIChange = (maxDPI: number) => {
    const clamped = Math.max(72, Math.min(600, Math.round(maxDPI)));
    onOptionsChange({ ...options, maxDPI: clamped });
  };

  const applyPreset = (preset: 'smallest' | 'balanced' | 'best') => {
    if (preset === 'smallest') {
      onOptionsChange({ ...options, quality: 75, maxDPI: 150 });
    } else if (preset === 'balanced') {
      onOptionsChange({ ...options, quality: 85, maxDPI: 200 });
    } else {
      onOptionsChange({ ...options, quality: 92, maxDPI: 300 });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">PDF Options</h3>
      </div>

      {/* Page Size */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Page Size</label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['A4', 'Letter', 'Fit'] as const).map((size) => (
            <button
              key={size}
              onClick={() => handlePageSizeChange(size)}
              disabled={disabled}
              className={`
                px-3 py-2 text-sm font-medium rounded-md border transition-colors
                ${options.pageSize === size
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {size === 'Fit' ? 'Fit to Image' : size}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          {options.pageSize === 'Fit' 
            ? 'PDF pages will match the size of your images'
            : `${options.pageSize} standard page size`
          }
        </p>
      </div>

      {/* Orientation */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <RotateCw className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Orientation</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['Portrait', 'Landscape'] as const).map((orientation) => (
            <button
              key={orientation}
              onClick={() => handleOrientationChange(orientation)}
              disabled={disabled}
              className={`
                px-3 py-2 text-sm font-medium rounded-md border transition-colors
                ${options.orientation === orientation
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {orientation}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          {options.orientation === 'Portrait' 
            ? 'Taller than wide (standard)'
            : 'Wider than tall'
          }
        </p>
      </div>

      {/* Margins */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Ruler className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Margins</label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {([0, 5, 10, 20] as const).map((margin) => (
            <button
              key={margin}
              onClick={() => handleMarginsChange(margin)}
              disabled={disabled}
              className={`
                px-3 py-2 text-sm font-medium rounded-md border transition-colors
                ${options.margins === margin
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {margin}mm
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          {options.margins === 0 
            ? 'No margins - images will fill the entire page'
            : `${options.margins}mm margin around each image`
          }
        </p>
      </div>

      {/* Advanced */}
      <div className="pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          className={`w-full text-left text-sm font-medium ${showAdvanced ? 'text-blue-700' : 'text-gray-700'} flex items-center justify-between`}
          disabled={disabled}
        >
          <span>Advanced</span>
          <span className="text-xs">{showAdvanced ? 'Hide' : 'Show'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {/* Presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Presets</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('smallest')}
                  disabled={disabled}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                >Smallest</button>
                <button
                  type="button"
                  onClick={() => applyPreset('balanced')}
                  disabled={disabled}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                >Balanced</button>
                <button
                  type="button"
                  onClick={() => applyPreset('best')}
                  disabled={disabled}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                >Best quality</button>
              </div>
            </div>

            {/* Compression */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Image quality</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min={40}
                  max={95}
                  step={1}
                  value={options.quality ?? 85}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  disabled={disabled}
                  className="w-full"
                />
                <span className="text-sm text-gray-700 w-10 text-right">{options.quality ?? 85}</span>
              </div>
              <p className="text-xs text-gray-500">Lower = smaller PDF. 75–85 is a good balance.</p>
            </div>

            {/* Max DPI */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max DPI</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min={72}
                  max={600}
                  step={1}
                  value={options.maxDPI ?? 200}
                  onChange={(e) => handleMaxDPIChange(Number(e.target.value))}
                  disabled={disabled}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                />
                <span className="text-sm text-gray-600">pixels/inch</span>
              </div>
              <p className="text-xs text-gray-500">Images are downscaled to this resolution on the page.</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-md p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Page size: {options.pageSize === 'Fit' ? 'Fit to Image' : options.pageSize}</p>
          <p>• Orientation: {options.orientation}</p>
          <p>• Margin: {options.margins}mm</p>
          {showAdvanced && (
            <>
              <p>• Quality: {options.quality ?? 85}</p>
              <p>• Max DPI: {options.maxDPI ?? 200}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
