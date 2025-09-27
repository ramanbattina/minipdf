import { generatePDFClient } from '@/lib/pdf-client';
import { ImageFile, PDFOptions } from '@/types';

// Mock File and Blob for testing
global.File = class MockFile {
  name: string;
  size: number;
  type: string;
  
  constructor(name: string, size: number, type: string) {
    this.name = name;
    this.size = size;
    this.type = type;
  }
  
  async arrayBuffer(): Promise<ArrayBuffer> {
    // Return a valid JPEG file for testing
    const jpegData = new Uint8Array([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x00, 0xFF, 0xD9
    ]);
    return jpegData.buffer;
  }
} as unknown as typeof File;

global.Blob = class MockBlob {
  constructor(public parts: unknown[], public options: unknown) {}
} as unknown as typeof Blob;

describe('PDF Client Generation', () => {
  const createMockImageFile = (name: string, size: number = 1024): ImageFile => ({
    id: 'test-id',
    file: new File(name, size, 'image/jpeg') as unknown as File,
    preview: 'data:image/jpeg;base64,test',
    name,
    size,
  });

  const defaultOptions: PDFOptions = {
    pageSize: 'A4',
    orientation: 'Portrait',
    margins: 5,
  };

  test('should generate PDF with single image', async () => {
    const images = [createMockImageFile('test.jpg')];
    
    const result = await generatePDFClient(images, defaultOptions);
    
    expect(result.pdfBytes).toBeDefined();
    expect(result.pdfBytes.length).toBeGreaterThan(0);
    expect(result.fileName).toMatch(/converted-images-\d{4}-\d{2}-\d{2}\.pdf/);
  });

  test('should generate PDF with multiple images', async () => {
    const images = [
      createMockImageFile('test1.jpg'),
      createMockImageFile('test2.jpg'),
      createMockImageFile('test3.jpg'),
    ];
    
    const result = await generatePDFClient(images, defaultOptions);
    
    expect(result.pdfBytes).toBeDefined();
    expect(result.pdfBytes.length).toBeGreaterThan(0);
    expect(result.fileName).toMatch(/converted-images-\d{4}-\d{2}-\d{2}\.pdf/);
  });

  test('should handle different page sizes', async () => {
    const images = [createMockImageFile('test.jpg')];
    
    const a4Options = { ...defaultOptions, pageSize: 'A4' as const };
    const letterOptions = { ...defaultOptions, pageSize: 'Letter' as const };
    const fitOptions = { ...defaultOptions, pageSize: 'Fit' as const };
    
    const a4Result = await generatePDFClient(images, a4Options);
    const letterResult = await generatePDFClient(images, letterOptions);
    const fitResult = await generatePDFClient(images, fitOptions);
    
    expect(a4Result.pdfBytes).toBeDefined();
    expect(letterResult.pdfBytes).toBeDefined();
    expect(fitResult.pdfBytes).toBeDefined();
  });

  test('should handle different orientations', async () => {
    const images = [createMockImageFile('test.jpg')];
    
    const portraitOptions = { ...defaultOptions, orientation: 'Portrait' as const };
    const landscapeOptions = { ...defaultOptions, orientation: 'Landscape' as const };
    
    const portraitResult = await generatePDFClient(images, portraitOptions);
    const landscapeResult = await generatePDFClient(images, landscapeOptions);
    
    expect(portraitResult.pdfBytes).toBeDefined();
    expect(landscapeResult.pdfBytes).toBeDefined();
  });

  test('should handle different margins', async () => {
    const images = [createMockImageFile('test.jpg')];
    
    const marginOptions = [0, 5, 10, 20] as const;
    
    for (const margin of marginOptions) {
      const options = { ...defaultOptions, margins: margin };
      const result = await generatePDFClient(images, options);
      expect(result.pdfBytes).toBeDefined();
    }
  });
});
