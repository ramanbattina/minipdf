import { 
  formatFileSize, 
  generateId, 
  validateImageFile, 
  calculateTotalSize, 
  isClientMode 
} from '@/lib/utils';

describe('Utils', () => {
  const createMockFile = (name: string, size: number, type: string): File => ({
    name,
    size,
    type,
  } as File);
  describe('formatFileSize', () => {
    test('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    test('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('validateImageFile', () => {

    test('should validate correct image files', () => {
      const jpgFile = createMockFile('test.jpg', 1024, 'image/jpeg');
      const pngFile = createMockFile('test.png', 2048, 'image/png');
      
      expect(validateImageFile(jpgFile).valid).toBe(true);
      expect(validateImageFile(pngFile).valid).toBe(true);
    });

    test('should reject invalid file types', () => {
      const txtFile = createMockFile('test.txt', 1024, 'text/plain');
      const gifFile = createMockFile('test.gif', 1024, 'image/gif');
      
      expect(validateImageFile(txtFile).valid).toBe(false);
      expect(validateImageFile(txtFile).error).toContain('Only JPG and PNG files are allowed');
      
      expect(validateImageFile(gifFile).valid).toBe(false);
      expect(validateImageFile(gifFile).error).toContain('Only JPG and PNG files are allowed');
    });

    test('should reject oversized files', () => {
      const largeFile = createMockFile('large.jpg', 11 * 1024 * 1024, 'image/jpeg');
      
      expect(validateImageFile(largeFile).valid).toBe(false);
      expect(validateImageFile(largeFile).error).toContain('File size must be less than 10MB');
    });

    test('should accept files at size limit', () => {
      const maxSizeFile = createMockFile('max.jpg', 10 * 1024 * 1024, 'image/jpeg');
      
      expect(validateImageFile(maxSizeFile).valid).toBe(true);
    });
  });

  describe('calculateTotalSize', () => {
    test('should calculate total size of files', () => {
      const files = [
        createMockFile('file1.jpg', 1024, 'image/jpeg'),
        createMockFile('file2.jpg', 2048, 'image/jpeg'),
        createMockFile('file3.jpg', 512, 'image/jpeg'),
      ];
      
      expect(calculateTotalSize(files)).toBe(3584);
    });

    test('should handle empty array', () => {
      expect(calculateTotalSize([])).toBe(0);
    });
  });

  describe('isClientMode', () => {
    test('should return true for small files', () => {
      const smallSize = 20 * 1024 * 1024; // 20MB
      const maxClientMB = 25;
      
      expect(isClientMode(smallSize, maxClientMB)).toBe(true);
    });

    test('should return false for large files', () => {
      const largeSize = 30 * 1024 * 1024; // 30MB
      const maxClientMB = 25;
      
      expect(isClientMode(largeSize, maxClientMB)).toBe(false);
    });

    test('should return true for files at limit', () => {
      const limitSize = 25 * 1024 * 1024; // 25MB
      const maxClientMB = 25;
      
      expect(isClientMode(limitSize, maxClientMB)).toBe(true);
    });
  });
});
