'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';
import { ImageFile } from '@/types';
import { validateImageFile, generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  onFilesAdded: (files: ImageFile[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export default function Dropzone({ onFilesAdded, maxFiles = 20, disabled = false }: DropzoneProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([]);
    const newErrors: string[] = [];
    const validFiles: ImageFile[] = [];

    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      if (errors.some((e: any) => e.code === 'file-too-large')) {
        newErrors.push(`${file.name} is too large (max 10MB per file)`);
      } else if (errors.some((e: any) => e.code === 'file-invalid-type')) {
        newErrors.push(`${file.name} is not a valid image file`);
      } else {
        newErrors.push(`${file.name}: ${errors[0]?.message || 'Invalid file'}`);
      }
    });

    // Validate accepted files
    acceptedFiles.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        const imageFile: ImageFile = {
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        };
        validFiles.push(imageFile);
      } else {
        newErrors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles,
    disabled,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          'hover:border-blue-400 hover:bg-blue-50/50',
          isDragActive && !isDragReject && 'border-blue-500 bg-blue-50',
          isDragReject && 'border-red-500 bg-red-50',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            'p-4 rounded-full',
            isDragActive && !isDragReject ? 'bg-blue-100' : 'bg-gray-100'
          )}>
            <Upload className={cn(
              'w-8 h-8',
              isDragActive && !isDragReject ? 'text-blue-600' : 'text-gray-600'
            )} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive
                ? isDragReject
                  ? 'Some files are not supported'
                  : 'Drop your images here'
                : 'Drag & drop images here'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports JPG, PNG • Max 10MB per file • Up to {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
