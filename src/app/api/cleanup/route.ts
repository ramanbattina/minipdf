import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a cleanup request (could add auth here)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CLEANUP_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tempDir = join(process.cwd(), 'temp');
    const ttlHours = parseInt(process.env.TTL_HOURS || '2');
    const ttlMs = ttlHours * 60 * 60 * 1000; // Convert to milliseconds
    const now = Date.now();

    let deletedCount = 0;
    let errorCount = 0;

    try {
      const files = await readdir(tempDir);
      
      for (const file of files) {
        const filePath = join(tempDir, file);
        
        try {
          const stats = await stat(filePath);
          const fileAge = now - stats.mtime.getTime();
          
          if (fileAge > ttlMs) {
            await unlink(filePath);
            deletedCount++;
            console.log(`Deleted expired file: ${file}`);
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
          errorCount++;
        }
      }
    } catch (error) {
      if ((error as { code?: string }).code !== 'ENOENT') {
        throw error;
      }
      // Temp directory doesn't exist, which is fine
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      errorCount,
      message: `Cleanup completed. Deleted ${deletedCount} files, ${errorCount} errors.`,
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
      error: 'Cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also support GET for manual cleanup
export async function GET(request: NextRequest) {
  return POST(request);
}
