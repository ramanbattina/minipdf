import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import JpgToPdfConverter from '@/components/JpgToPdfConverter';

export const metadata: Metadata = {
  title: 'JPG to PDF Converter - Fast, Free, Private | MiniPDF',
  description: 'Convert JPG and PNG images to PDF instantly. Drag to reorder, customize page size and margins. No watermarks, files auto-delete after 2 hours.',
  keywords: 'jpg to pdf, png to pdf, image to pdf, convert images, pdf converter, free pdf',
  openGraph: {
    title: 'JPG to PDF Converter - Fast, Free, Private',
    description: 'Convert JPG and PNG images to PDF instantly. No watermarks, files auto-delete after 2 hours.',
    type: 'website',
  },
};

export default function JpgToPdfPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">MiniPDF</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <JpgToPdfConverter />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="ml-2 text-sm font-semibold text-gray-900">MiniPDF</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
