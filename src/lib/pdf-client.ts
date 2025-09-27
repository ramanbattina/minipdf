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

    // Get image data
    const imageBytes = await image.file.arrayBuffer();
    let pdfImage;
    
    try {
      // Try to embed as JPEG first
      pdfImage = await pdfDoc.embedJpg(imageBytes);
    } catch {
      try {
        // Fallback to PNG
        pdfImage = await pdfDoc.embedPng(imageBytes);
      } catch (error) {
        console.error('Failed to embed image:', error);
        throw new Error(`Failed to process image: ${image.name}`);
      }
    }

    // Calculate dimensions
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const margin = MARGINS[options.margins];
    
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);

    let imageWidth = pdfImage.width;
    let imageHeight = pdfImage.height;

    // Scale image to fit within margins
    const scaleX = availableWidth / imageWidth;
    const scaleY = availableHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY);

    imageWidth *= scale;
    imageHeight *= scale;

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

  const pdfBytes = await pdfDoc.save();
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
