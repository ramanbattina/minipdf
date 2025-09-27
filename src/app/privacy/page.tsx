import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - MiniPDF',
  description: 'Learn how MiniPDF protects your privacy. Files are processed locally when possible and automatically deleted after 2 hours.',
};

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              At MiniPDF, we take your privacy seriously. This policy explains how we handle your files and data.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">File Processing</h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Local Processing (Preferred)</h3>
                  <p className="text-green-700">
                    For files under 25MB total, all processing happens locally in your browser. 
                    Your files never leave your device, ensuring maximum privacy.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Server Processing (Large Files)</h3>
                  <p className="text-blue-700">
                    Files over 25MB are processed on our secure server. These files are automatically 
                    deleted after 2 hours and are never stored permanently.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Collection</h2>
              <p className="text-gray-600 mb-4">
                We collect minimal data to provide our service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Files you upload (temporarily, for processing only)</li>
                <li>Basic usage analytics (page views, conversion counts)</li>
                <li>Error logs (for debugging, no personal data)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Files are stored temporarily in memory during processing</li>
                <li>Server files are automatically deleted after 2 hours</li>
                <li>No permanent storage of your files or personal data</li>
                <li>Analytics data is anonymized and aggregated</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                We use the following services to provide our functionality:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li><strong>Vercel:</strong> Hosting and deployment platform</li>
                <li><strong>Cloudflare R2:</strong> Temporary file storage (if configured)</li>
                <li><strong>Sharp & PDF-lib:</strong> Image and PDF processing libraries</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Request deletion of any data we may have</li>
                <li>Opt out of analytics tracking</li>
                <li>Contact us with privacy concerns</li>
                <li>Use our service without creating an account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security</h2>
              <p className="text-gray-600 mb-4">
                We implement security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>HTTPS encryption for all data transmission</li>
                <li>Automatic file deletion after processing</li>
                <li>No permanent storage of uploaded files</li>
                <li>Regular security updates and monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. Any changes will be posted on this page 
                with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this privacy policy or our data practices, 
                please contact us through our website.
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
