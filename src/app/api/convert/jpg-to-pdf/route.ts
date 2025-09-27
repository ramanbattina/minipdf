import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import { z } from 'zod';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Validation schema
const ConvertRequestSchema = z.object({
  options: z.object({
    pageSize: z.enum(['A4', 'Letter', 'Fit']),
    orientation: z.enum(['Portrait', 'Landscape']),
    margins: z.union([z.literal(0), z.literal(5), z.literal(10), z.literal(20)]),
  }),
});

const PAGE_SIZES = {
  A4: { width: 595, height: 842 },
  Letter: { width: 612, height: 792 },
} as const;

const MARGINS = {
  0: 0,
  5: 14.17,
  10: 28.35,
  20: 56.69,
} as const;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Parse options
    const optionsString = formData.get('options') as string;
    if (!optionsString) {
      return NextResponse.json({ error: 'Options are required' }, { status: 400 });
    }

    const options = JSON.parse(optionsString);
    const validatedOptions = ConvertRequestSchema.parse({ options }).options;

    // Extract image files
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        imageFiles.push(value);
      }
    }

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    // Check file size limits
    const maxServerMB = parseInt(process.env.MAX_SERVER_MB || '100');
    const totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxServerMB * 1024 * 1024) {
      return NextResponse.json({ 
        error: `Total file size exceeds ${maxServerMB}MB limit` 
      }, { status: 400 });
    }

    // Create temp directory
    const tempDir = join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const processedImages: string[] = [];
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    try {
      // Process each image
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const tempPath = join(tempDir, `temp_${Date.now()}_${i}.jpg`);

        try {
          // Normalize image with Sharp
          const imageBuffer = await file.arrayBuffer();
          const processedBuffer = await sharp(Buffer.from(imageBuffer))
            .jpeg({ quality: 90, progressive: true })
            .toBuffer();

          await writeFile(tempPath, processedBuffer);
          processedImages.push(tempPath);

          // Create PDF page
          let page;
          
          if (validatedOptions.pageSize === 'Fit') {
            page = pdfDoc.addPage([PAGE_SIZES.A4.width, PAGE_SIZES.A4.height]);
          } else {
            const pageSize = PAGE_SIZES[validatedOptions.pageSize];
            const width = validatedOptions.orientation === 'Landscape' ? pageSize.height : pageSize.width;
            const height = validatedOptions.orientation === 'Landscape' ? pageSize.width : pageSize.height;
            page = pdfDoc.addPage([width, height]);
          }

          // Get image metadata
          const imageMetadata = await sharp(processedBuffer).metadata();
          const imageWidth = imageMetadata.width || 0;
          const imageHeight = imageMetadata.height || 0;

          if (imageWidth === 0 || imageHeight === 0) {
            throw new Error(`Invalid image dimensions for ${file.name}`);
          }

          // Embed image
          const pdfImage = await pdfDoc.embedJpg(processedBuffer);

          // Calculate dimensions
          const pageWidth = page.getWidth();
          const pageHeight = page.getHeight();
          const margin = MARGINS[validatedOptions.margins];
          
          const availableWidth = pageWidth - (margin * 2);
          const availableHeight = pageHeight - (margin * 2);

          let scaledWidth = imageWidth;
          let scaledHeight = imageHeight;

          // Scale image to fit within margins
          const scaleX = availableWidth / imageWidth;
          const scaleY = availableHeight / imageHeight;
          const scale = Math.min(scaleX, scaleY);

          scaledWidth *= scale;
          scaledHeight *= scale;

          // Center the image
          const x = margin + (availableWidth - scaledWidth) / 2;
          const y = margin + (availableHeight - scaledHeight) / 2;

          // Draw the image
          page.drawImage(pdfImage, {
            x,
            y,
            width: scaledWidth,
            height: scaledHeight,
          });

          // Add page number if multiple images
          if (imageFiles.length > 1) {
            page.drawText(`${i + 1}`, {
              x: pageWidth - margin - 20,
              y: margin - 10,
              size: 10,
              font,
              color: rgb(0.5, 0.5, 0.5),
            });
          }

        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error);
          throw new Error(`Failed to process image: ${file.name}`);
        }
      }

      // Generate PDF
      const pdfBytes = await pdfDoc.save();
      const fileName = `converted-images-${new Date().toISOString().split('T')[0]}.pdf`;

      // Clean up temp files
      for (const tempPath of processedImages) {
        try {
          await unlink(tempPath);
        } catch (error) {
          console.error('Error cleaning up temp file:', error);
        }
      }

      // Return PDF as stream
      return new NextResponse(new Uint8Array(pdfBytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': pdfBytes.length.toString(),
        },
      });

    } catch (error) {
      // Clean up temp files on error
      for (const tempPath of processedImages) {
        try {
          await unlink(tempPath);
        } catch (cleanupError) {
          console.error('Error cleaning up temp file:', cleanupError);
        }
      }
      throw error;
    }

  } catch (error) {
    console.error('PDF conversion error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: error.issues 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}
