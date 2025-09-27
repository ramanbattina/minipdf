import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiniPDF - JPG to PDF Converter | Fast, Free, Private",
  description: "Convert JPG and PNG images to PDF instantly. No watermarks, files auto-delete after 2 hours. Drag to reorder, customize settings.",
  keywords: "jpg to pdf, png to pdf, image to pdf, convert images, pdf converter, free pdf, no watermark",
  authors: [{ name: "MiniPDF" }],
  creator: "MiniPDF",
  publisher: "MiniPDF",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://minipdf.com",
    title: "MiniPDF - JPG to PDF Converter",
    description: "Convert JPG and PNG images to PDF instantly. No watermarks, files auto-delete after 2 hours.",
    siteName: "MiniPDF",
  },
  twitter: {
    card: "summary_large_image",
    title: "MiniPDF - JPG to PDF Converter",
    description: "Convert JPG and PNG images to PDF instantly. No watermarks, files auto-delete after 2 hours.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
