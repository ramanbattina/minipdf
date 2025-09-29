'use client';

import { useState, useCallback } from 'react';
import { Download, FileText, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import Dropzone from './Dropzone';
import ThumbnailList from './ThumbnailList';
import OptionsPanel from './OptionsPanel';
import ProgressBar from './ProgressBar';
import { ImageFile, PDFOptions, ConversionResult } from '@/types';
import { generatePDFClient } from '@/lib/pdf-client';
import { calculateTotalSize, isClientMode, formatFileSize } from '@/lib/utils';
import { cn } from '@/lib/utils';

const DEFAULT_OPTIONS: PDFOptions = {
  pageSize: 'A4',
  orientation: 'Portrait',
  margins: 5,
  quality: 85,
  maxDPI: 200,
};

export default function JpgToPdfConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [options, setOptions] = useState<PDFOptions>(DEFAULT_OPTIONS);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [progress, setProgress] = useState(0);

  const maxImages = parseInt(process.env.NEXT_PUBLIC_MAX_IMAGES_CLIENT || '20');
  const maxClientMB = parseInt(process.env.NEXT_PUBLIC_MAX_CLIENT_MB || '25');

  const handleFilesAdded = useCallback((newFiles: ImageFile[]) => {
    setImages(prev => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, maxImages);
    });
    setConversionResult(null);
  }, [maxImages]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
    setConversionResult(null);
  }, []);

  const handleReorderImages = useCallback((newImages: ImageFile[]) => {
    setImages(newImages);
    setConversionResult(null);
  }, []);

  const runConvert = async (override?: Partial<PDFOptions>) => {
    if (images.length === 0) return;

    setIsConverting(true);
    setProgress(0);
    setConversionResult(null);

    try {
      const effectiveOptions: PDFOptions = { ...options, ...(override || {}) } as PDFOptions;
      const totalSize = calculateTotalSize(images.map(img => img.file));
      const useClientMode = isClientMode(totalSize, maxClientMB);

      if (useClientMode) {
        // Client-side conversion
        setProgress(10);
        
        const { pdfBytes, fileName } = await generatePDFClient(images, effectiveOptions);
        
        setProgress(90);
        
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProgress(100);
        
        const result: ConversionResult = {
          success: true,
          pdfBlob: new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }),
          fileName,
          fileSize: pdfBytes.length,
        };
        
        setConversionResult(result);
      } else {
        // Server-side conversion for large files
        setProgress(10);
        
        const formData = new FormData();
        images.forEach((image, index) => {
          formData.append(`image_${index}`, image.file);
        });
        formData.append('options', JSON.stringify(effectiveOptions));

        const response = await fetch('/api/convert/jpg-to-pdf', {
          method: 'POST',
          body: formData,
        });

        setProgress(50);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Server conversion failed');
        }

        setProgress(90);

        const pdfBlob = await response.blob();
        const fileName = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'converted.pdf';

        setProgress(100);

        const result: ConversionResult = {
          success: true,
          pdfBlob,
          fileName,
          fileSize: pdfBlob.size,
        };

        setConversionResult(result);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Conversion failed',
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvert = async () => runConvert();
  const handleQuickConvert = async () => runConvert(DEFAULT_OPTIONS);

  const handleDownload = () => {
    if (conversionResult?.success && conversionResult.pdfBlob) {
      const url = URL.createObjectURL(conversionResult.pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = conversionResult.fileName || 'converted.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleStartOver = () => {
    // Clean up object URLs
    images.forEach(image => URL.revokeObjectURL(image.preview));
    setImages([]);
    setOptions(DEFAULT_OPTIONS);
    setConversionResult(null);
    setProgress(0);
  };

  const totalSize = calculateTotalSize(images.map(img => img.file));
  const useClientMode = isClientMode(totalSize, maxClientMB);

  return (
    <div className="max-w-6xl mx-auto p-6 pb-28 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">JPG to PDF Converter</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert your images into a single PDF document. Drag to reorder, customize settings, and download instantly.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-800">
            <strong>Privacy First:</strong> Your files are processed locally when possible and automatically deleted after 2 hours.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload and Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Images</h2>
            <Dropzone
              onFilesAdded={handleFilesAdded}
              maxFiles={maxImages}
              disabled={isConverting}
            />
          </div>

          {/* Images List */}
          {images.length > 0 && (
            <div>
              <ThumbnailList
                images={images}
                onReorder={handleReorderImages}
                onRemove={handleRemoveImage}
                maxImages={maxImages}
              />
            </div>
          )}

          {/* File Info */}
          {images.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {images.length} image{images.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
                </span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  useClientMode 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                )}>
                  {useClientMode ? 'Client-side processing' : 'Server-side processing'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Options and Actions */}
        <div className="space-y-6">
          {/* Options Panel */}
          <OptionsPanel
            options={options}
            onOptionsChange={setOptions}
            disabled={isConverting}
          />

          {/* Convert Button */}
          <div className="space-y-4">
            <button
              onClick={handleConvert}
              disabled={images.length === 0 || isConverting}
              className={cn(
                'w-full py-3 px-4 rounded-lg font-medium transition-colors',
                'flex items-center justify-center space-x-2',
                images.length === 0 || isConverting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              <FileText className="w-5 h-5" />
              <span>
                {isConverting ? 'Converting...' : `Convert to PDF (${images.length} image${images.length !== 1 ? 's' : ''})`}
              </span>
            </button>

            {/* Quick Convert */}
            <button
              onClick={handleQuickConvert}
              disabled={images.length === 0 || isConverting}
              className={cn(
                'w-full py-2 px-4 rounded-lg font-medium transition-colors',
                images.length === 0 || isConverting
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              )}
            >
              <span className="inline-flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Quick convert (use defaults)</span>
              </span>
            </button>

            {/* Progress Bar */}
            {isConverting && (
              <ProgressBar
                progress={progress}
                status="processing"
                message="Generating PDF..."
              />
            )}

            {/* Conversion Result */}
            {conversionResult && (
              <div className="space-y-4">
                {conversionResult.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Conversion Successful!</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>File: {conversionResult.fileName}</p>
                      <p>Size: {conversionResult.fileSize ? formatFileSize(conversionResult.fileSize) : 'Unknown'}</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={handleDownload}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </button>
                      <button
                        onClick={handleStartOver}
                        className="px-4 py-2 border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors"
                      >
                        Start Over
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">Conversion Failed</span>
                    </div>
                    <p className="text-sm text-red-700">{conversionResult.error}</p>
                    <button
                      onClick={handleStartOver}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Fixed Bottom Convert Bar */}
      {images.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200">
          <div className="max-w-6xl mx-auto p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="text-sm text-gray-700">
              {images.length} image{images.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleQuickConvert}
                disabled={isConverting}
                className={cn(
                  'flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors',
                  isConverting && 'opacity-50 cursor-not-allowed'
                )}
              >
                Quick convert
              </button>
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className={cn(
                  'flex-1 sm:flex-none px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors font-medium',
                  isConverting && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isConverting ? 'Converting…' : 'Convert to PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
