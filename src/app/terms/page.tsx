import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - MiniPDF',
  description: 'Terms of service for MiniPDF. Learn about acceptable use, limitations, and your rights when using our PDF conversion service.',
};

export default function TermsPage() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Scale className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              By using MiniPDF, you agree to these terms of service. Please read them carefully.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using MiniPDF, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
              <p className="text-gray-600 mb-4">
                MiniPDF provides a web-based service for converting image files (JPG, PNG) to PDF format. 
                The service includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Image to PDF conversion</li>
                <li>Drag-and-drop reordering of images</li>
                <li>Customizable page sizes, orientations, and margins</li>
                <li>Local processing for files under 25MB</li>
                <li>Server processing for larger files</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
              <p className="text-gray-600 mb-4">
                You agree to use MiniPDF only for lawful purposes and in accordance with these terms. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Upload files containing illegal, harmful, or malicious content</li>
                <li>Attempt to reverse engineer or compromise the service</li>
                <li>Use the service for commercial purposes without permission</li>
                <li>Upload copyrighted material without proper authorization</li>
                <li>Exceed reasonable usage limits or abuse the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">File Limits and Processing</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Maximum 20 images per conversion</li>
                <li>Individual files limited to 10MB each</li>
                <li>Total file size limited to 25MB for local processing</li>
                <li>Total file size limited to 100MB for server processing</li>
                <li>Files are automatically deleted after 2 hours</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data</h2>
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. Please review our Privacy Policy for details on how we handle your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Files under 25MB are processed locally in your browser</li>
                <li>Larger files are processed on secure servers and deleted after 2 hours</li>
                <li>We do not store your files permanently</li>
                <li>We do not add watermarks to your PDFs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
              <p className="text-gray-600">
                We strive to provide reliable service, but we cannot guarantee 100% uptime. The service may be 
                temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right 
                to modify or discontinue the service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                MiniPDF is provided "as is" without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Loss of data or files</li>
                <li>Service interruptions or downtime</li>
                <li>Conversion errors or quality issues</li>
                <li>Any indirect, incidental, or consequential damages</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-600">
                You retain all rights to the files you upload. By using our service, you grant us a temporary, 
                non-exclusive license to process your files solely for the purpose of providing the conversion service. 
                We do not claim ownership of your content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Content</h2>
              <p className="text-gray-600 mb-4">
                You may not upload files containing:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Illegal or harmful content</li>
                <li>Copyrighted material without permission</li>
                <li>Malicious software or code</li>
                <li>Adult or inappropriate content</li>
                <li>Content that violates any laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-600">
                We reserve the right to terminate or suspend access to our service immediately, without prior notice, 
                for any violation of these terms or for any other reason at our discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting. Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these terms of service, please contact us through our website.
              </p>
            </section>

            <div className="bg-gray-50 rounded-lg p-4 mt-8">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
