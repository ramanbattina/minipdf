export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

export interface PDFOptions {
  pageSize: 'A4' | 'Letter' | 'Fit';
  orientation: 'Portrait' | 'Landscape';
  margins: 0 | 5 | 10 | 20; // in mm
}

export interface ConversionResult {
  success: boolean;
  pdfBlob?: Blob;
  fileName?: string;
  error?: string;
  fileSize?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const PAGE_SIZES = {
  A4: { width: 595, height: 842 }, // A4 in points
  Letter: { width: 612, height: 792 }, // Letter in points
} as const;

export const MARGINS = {
  0: 0,
  5: 14.17, // 5mm in points
  10: 28.35, // 10mm in points
  20: 56.69, // 20mm in points
} as const;
