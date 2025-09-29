import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ImageFile, PDFOptions, PAGE_SIZES, MARGINS } from '@/types';

export async function generatePDFClient(
  images: ImageFile[],
  options: PDFOptions
): Promise<{ pdfBytes: Uint8Array; fileName: string }> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const image of images) {
    // Create a new page
    let page;
    
    if (options.pageSize === 'Fit') {
      // For fit mode, we'll use a standard size but scale the image
      page = pdfDoc.addPage([PAGE_SIZES.A4.width, PAGE_SIZES.A4.height]);
    } else {
      const pageSize = PAGE_SIZES[options.pageSize];
      const width = options.orientation === 'Landscape' ? pageSize.height : pageSize.width;
      const height = options.orientation === 'Landscape' ? pageSize.width : pageSize.height;
      page = pdfDoc.addPage([width, height]);
    }

    // Compute page metrics for target DPI scaling
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const margin = MARGINS[options.margins];
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);

    // Load image into an HTMLImageElement
    const arrayBuffer = await image.file.arrayBuffer();
    const imgBlob = new Blob([arrayBuffer]);
    const imgUrl = URL.createObjectURL(imgBlob);
    const htmlImg = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = (e) => reject(e);
      el.src = imgUrl;
    });

    const originalPixelWidth = htmlImg.naturalWidth || htmlImg.width;
    const originalPixelHeight = htmlImg.naturalHeight || htmlImg.height;

    // Determine display size in PDF points maintaining aspect ratio
    const scaleX = availableWidth / originalPixelWidth;
    const scaleY = availableHeight / originalPixelHeight;
    const displayScale = Math.min(scaleX, scaleY);
    const displayWidthPts = originalPixelWidth * displayScale;
    const displayHeightPts = originalPixelHeight * displayScale;

    // Determine target pixel resolution based on desired DPI
    const targetDPI = options.maxDPI ?? 200; // sensible default
    const displayWidthInches = displayWidthPts / 72;
    const displayHeightInches = displayHeightPts / 72;
    const targetPixelWidth = Math.max(1, Math.round(displayWidthInches * targetDPI));
    const targetPixelHeight = Math.max(1, Math.round(displayHeightInches * targetDPI));

    // Render to canvas at target size then export JPEG with quality
    const canvas = document.createElement('canvas');
    canvas.width = targetPixelWidth;
    canvas.height = targetPixelHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(htmlImg, 0, 0, targetPixelWidth, targetPixelHeight);
    const quality = Math.min(0.99, Math.max(0.4, (options.quality ?? 85) / 100));
    const compressedBlob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', quality)
    );
    URL.revokeObjectURL(imgUrl);
    const compressedBytes = new Uint8Array(await compressedBlob.arrayBuffer());

    // Embed compressed JPEG into PDF
    const pdfImage = await pdfDoc.embedJpg(compressedBytes);

    // Use precalculated display size in points
    const imageWidth = displayWidthPts;
    const imageHeight = displayHeightPts;

    // Center the image
    const x = margin + (availableWidth - imageWidth) / 2;
    const y = margin + (availableHeight - imageHeight) / 2;

    // Draw the image
    page.drawImage(pdfImage, {
      x,
      y,
      width: imageWidth,
      height: imageHeight,
    });

    // Add page number (optional)
    if (images.length > 1) {
      const pageNumber = images.indexOf(image) + 1;
      page.drawText(`${pageNumber}`, {
        x: pageWidth - margin - 20,
        y: margin - 10,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }
  }

  // Use objectStreams: 'generate' for smaller PDFs and no additional metadata
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  const fileName = `converted-images-${new Date().toISOString().split('T')[0]}.pdf`;

  return { pdfBytes, fileName };
}

export function downloadPDF(pdfBytes: Uint8Array, fileName: string): void {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}
