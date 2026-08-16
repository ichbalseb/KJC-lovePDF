# KJC-lovePDF

<p align="center">
  <strong>Fast, Local & Privacy-First PDF and Image Toolkit in Pure Go</strong>
</p>

<p align="center">
  <a href="https://github.com/ichbalseb/KJC-lovePDF/stargazers"><img src="https://img.shields.io/github/stars/ichbalseb/KJC-lovePDF?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/ichbalseb/KJC-lovePDF/network/members"><img src="https://img.shields.io/github/forks/ichbalseb/KJC-lovePDF?style=flat-square" alt="Forks"></a>
  <a href="https://github.com/ichbalseb/KJC-lovePDF/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/Go-1.24+-00ADD8?style=flat-square&logo=go" alt="Go Version">
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local-success?style=flat-square" alt="100% Local">
  <img src="https://img.shields.io/badge/Cloud%20Uploads-Zero-brightgreen?style=flat-square" alt="Zero Cloud Uploads">
</p>

---

## Overview

**KJC-lovePDF** is a high-performance, lightweight, self-hosted web application and tool suite for manipulating PDF documents, raster images, and animated GIFs. 

All processing happens **100% locally on your own machine**. Your files never touch external servers or third-party cloud services, ensuring total confidentiality, lightning-fast processing, and offline capability.

---

## Key Features

### 📄 PDF Manipulation
- **Merge PDFs**: Combine multiple PDF files into a single consolidated document with drag-and-drop reordering.
- **Split PDF**: Extract specific page ranges (e.g., `1-3, 5, 7-9`) or split every page into separate files packaged in a ZIP download.
- **Compress PDF**: Shrink PDF file sizes efficiently with customizable compression levels (low, medium, high).
- **Remove Pages**: Easily delete unwanted pages or page intervals from any PDF.
- **Add Password**: Encrypt PDFs with robust password protection to restrict unauthorized viewing and printing.
- **Remove Password**: Strip password encryption and restrictions from authorized documents for easy sharing.
- **Images to PDF**: Convert and combine multiple images (PNG, JPEG, WebP, TIFF) into a unified PDF document.

### 🖼️ Image & Media Tools
- **Compress & Resize Images**: Compress JPEG, PNG, and WebP images with adjustable quality (1–100%), format conversion, and custom resizing (Catmull-Rom interpolation).
- **Dimension Presets**: Built-in sizing presets for standard formats:
  - Passport Photo (`600x600px` @ 300 DPI / 2x2")
  - ID Photo (`450x600px` @ 300 DPI / 1.5x2")
  - Full HD (`1920x1080px`)
  - Square (`1024x1024px` / `512x512px`)
- **Compress Animated GIFs**: Optimize heavy animated GIFs through color quantization and frame optimization while retaining smooth playback.

### 🔒 Privacy & Performance
- **Zero Cloud Uploads**: Files are processed locally on your CPU/RAM.
- **No Internet Required**: Works completely offline.
- **Auto Cache Purging**: Temporary processing files are automatically cleared from disk after 1 hour.
- **Configurable Security**: Built-in HTTP Basic Authentication and per-IP rate limiting (30 requests/min).
- **Pure Go Engine**: Powered by `pdfcpu` and standard Go libraries with zero external C-dependencies or heavy runtimes.

---

## Quick Start

### Prerequisites
- [Go 1.24+](https://golang.org/dl/) (for building from source)
- Linux, macOS, or Windows

### 1. Clone & Build

```bash
# Clone the repository
git clone https://github.com/ichbalseb/KJC-lovePDF.git
cd KJC-lovePDF

# Download dependencies
go mod download

# Build the executable
go build -o kjc-lovepdf cmd/server/main.go

# Run the server
./kjc-lovepdf
```

Open your browser and navigate to:
```
http://localhost:8080
```

---

## Configuration & Flags

### Command Line Options

```bash
./kjc-lovepdf [flags]
```

| Flag | Default | Description |
|---|---|---|
| `-port` | `:8080` | Port address the HTTP server listens on (e.g. `:8081` or `127.0.0.1:3000`) |
| `-tmp` | `./tmp` | Directory used for temporary scratch files during processing |
| `-max-memory` | `104857600` (100 MB) | Maximum upload memory threshold in bytes |

#### Example: Custom Port & Memory
```bash
./kjc-lovepdf -port :8081 -tmp ./custom_tmp -max-memory 209715200
```

### Authentication

To secure access when deploying on a local network or shared server, set the `AUTH_USERNAME` and `AUTH_PASSWORD` environment variables:

```bash
AUTH_USERNAME=admin AUTH_PASSWORD=supersecret ./kjc-lovepdf
```

---

## Tool Guide

| Tool | Endpoint | Accepted Formats | Output |
|---|---|---|---|
| **Merge PDF** | `/merge` | `.pdf` (2–20 files) | Single combined `.pdf` |
| **Split PDF** | `/split` | `.pdf` | `.pdf` (range) or `.zip` (all pages) |
| **Compress PDF** | `/compress` | `.pdf` | Optimized `.pdf` |
| **Remove Pages** | `/remove-page` | `.pdf` | Cleaned `.pdf` |
| **Protect PDF** | `/add-password` | `.pdf` | Encrypted `.pdf` |
| **Unlock PDF** | `/remove-password` | `.pdf` | Decrypted `.pdf` |
| **Images to PDF** | `/image-to-pdf` | `.jpg`, `.jpeg`, `.png`, `.webp`, `.tiff` | Consolidated `.pdf` |
| **Compress Image** | `/compress-image` | `.jpg`, `.jpeg`, `.png`, `.webp` | Compressed `.jpg` / `.png` / `.webp` |
| **Compress GIF** | `/compress-gif` | `.gif` | Optimized animated `.gif` |

---

## Cross-Platform Compilation

You can compile standalone binaries for any operating system:

```bash
# Linux (x86_64)
GOOS=linux GOARCH=amd64 go build -o kjc-lovepdf-linux cmd/server/main.go

# macOS (Apple Silicon / M1 / M2 / M3 / M4)
GOOS=darwin GOARCH=arm64 go build -o kjc-lovepdf-mac-arm64 cmd/server/main.go

# macOS (Intel)
GOOS=darwin GOARCH=amd64 go build -o kjc-lovepdf-mac-intel cmd/server/main.go

# Windows (x86_64)
GOOS=windows GOARCH=amd64 go build -o kjc-lovepdf.exe cmd/server/main.go
```

---

## Project Structure

```
KJC-lovePDF/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point & CLI flag parser
├── internal/
│   ├── handlers/
│   │   └── handlers.go          # HTTP request handlers & upload logic
│   ├── image/
│   │   ├── compressor.go        # Image compression, resizing & preset engine
│   │   └── gifcompressor.go     # GIF color quantization & frame optimization
│   ├── middleware/
│   │   ├── auth.go              # Constant-time HTTP Basic Auth middleware
│   │   ├── logging.go           # HTTP access logger
│   │   └── ratelimit.go         # In-memory IP rate limiter
│   ├── pdf/
│   │   ├── compressor.go        # PDF optimization via pdfcpu
│   │   ├── encrypt.go           # PDF encryption & user password protection
│   │   ├── imagetopdf.go        # Image-to-PDF compilation
│   │   ├── merger.go            # Multi-PDF page merging
│   │   ├── password.go          # PDF decryption & password removal
│   │   ├── removepage.go        # PDF page extraction & removal
│   │   └── splitter.go          # PDF splitting (ranges & multi-file ZIP)
│   └── server/
│       └── server.go            # Mux router registration & auto-cleanup worker
├── web/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css        # Custom UI styles, transitions & animations
│   │   └── js/
│   │       └── app.js           # Client-side validation, drag-and-drop & API calls
│   └── templates/
│       ├── add-password.html    # Password encryption tool template
│       ├── compress-gif.html    # Animated GIF compression template
│       ├── compress-image.html  # Image compression & resizing template
│       ├── compress.html        # PDF compression tool template
│       ├── image-to-pdf.html    # Images to PDF conversion template
│       ├── index.html           # Main dashboard / hub page
│       ├── merge.html           # PDF merge tool template
│       ├── remove-page.html     # Page removal tool template
│       ├── remove-password.html # PDF unlock tool template
│       └── split.html           # PDF splitting tool template
├── tmp/                         # Local scratch directory (auto-purged hourly)
├── go.mod                       # Go module dependencies
├── go.sum                       # Go checksums
├── LICENSE                      # MIT License
├── CONTRIBUTING.md              # Contribution guide
└── README.md                    # Project documentation
```

---

## Security & Architecture Details

- **Path Traversal Protection**: All file paths and temporary identifiers are strictly sanitized using `filepath.Base` and internal validation.
- **In-Memory Rate Limiting**: Built-in token-bucket rate limiter (30 requests/minute per client IP) prevents automated denial-of-service.
- **Timing Attack Resistance**: HTTP Basic Authentication verifies credentials using `crypto/subtle.ConstantTimeCompare`.
- **Automatic Garbage Collection**: Background goroutine continuously inspects the scratch directory and purges files older than 1 hour.
- **Strict Size Limits**: Multi-part memory reader enforces limits (default 100MB) preventing unbounded memory consumption.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ichbalseb/KJC-lovePDF/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## Acknowledgments

- PDF processing engine powered by [pdfcpu](https://github.com/pdfcpu/pdfcpu)
- Image manipulation powered by Go standard library & `golang.org/x/image`
- Typography: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
