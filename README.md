# MiniPDF - JPG to PDF Converter

A production-ready Next.js web application for converting JPG and PNG images to PDF documents. Features client-side processing for small files, server-side processing for larger files, and automatic file cleanup for privacy.

## Features

- **🖼️ Image to PDF Conversion**: Convert JPG and PNG images to PDF
- **🔄 Drag & Drop Reordering**: Reorder images by dragging thumbnails
- **⚙️ Customizable Options**: Choose page size, orientation, and margins
- **🔒 Privacy First**: Local processing for files under 25MB, auto-delete after 2 hours
- **⚡ Fast Performance**: Client-side processing for instant results
- **📱 Responsive Design**: Works on desktop and mobile devices
- **♿ Accessible**: Built with accessibility in mind
- **🔍 SEO Optimized**: Static routes with proper metadata

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: pdf-lib
- **Image Processing**: Sharp (server-side)
- **File Upload**: react-dropzone
- **Drag & Drop**: @dnd-kit
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd minipdf
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# File Management
TTL_HOURS=2
MAX_CLIENT_MB=25
MAX_SERVER_MB=100
MAX_IMAGES_CLIENT=20

# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (optional)
# STORAGE_BUCKET=minipdf-files
# STORAGE_REGION=auto
# STORAGE_ENDPOINT=https://your-account.r2.cloudflarestorage.com
# STORAGE_ACCESS_KEY_ID=your-access-key
# STORAGE_SECRET_ACCESS_KEY=your-secret-key
```

## Usage

### Client-Side Processing (Recommended)
- Files under 25MB total are processed locally in the browser
- No data leaves your device
- Instant processing and download

### Server-Side Processing
- Files over 25MB are processed on the server
- Files are automatically deleted after 2 hours
- Uses Sharp for image optimization

### File Limits
- Maximum 20 images per conversion
- Individual files: 10MB max
- Client mode: 25MB total max
- Server mode: 100MB total max

## API Routes

### POST `/api/convert/jpg-to-pdf`
Converts images to PDF on the server.

**Request**: FormData with image files and options
**Response**: PDF file stream

### POST `/api/cleanup`
Cleans up expired temporary files.

### GET `/api/health`
Health check endpoint.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Docker Deployment

### Build and run with Docker:

```bash
docker build -t minipdf .
docker run -p 3000:3000 minipdf
```

### Using Docker Compose:

```bash
docker-compose up -d
```

## Production Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app includes a Dockerfile for deployment on any platform that supports Docker:

- Railway
- Render
- DigitalOcean App Platform
- AWS ECS
- Google Cloud Run

## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── jpg-to-pdf/        # Main tool page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Dropzone.tsx       # File upload component
│   ├── ThumbnailList.tsx  # Image list with drag & drop
│   ├── OptionsPanel.tsx   # PDF options
│   ├── ProgressBar.tsx    # Conversion progress
│   └── JpgToPdfConverter.tsx # Main converter
├── lib/                   # Utility functions
│   ├── pdf-client.ts      # Client-side PDF generation
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript type definitions
└── __tests__/             # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Privacy

- Files under 25MB are processed locally in your browser
- Server files are automatically deleted after 2 hours
- No permanent storage of user files
- No tracking or analytics of file contents
- No watermarks added to PDFs

## Support

For support, please open an issue on GitHub or contact us through the website.

## Roadmap

- [ ] Additional file format support (TIFF, BMP)
- [ ] Batch processing improvements
- [ ] Cloud storage integration
- [ ] API rate limiting
- [ ] User accounts (optional)
- [ ] More PDF customization options
