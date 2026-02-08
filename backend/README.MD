# SmartCart Backend

A secure Express.js backend server for the SmartCart e-commerce application built with TypeScript and modern security practices.

## Features

- **Express.js** with TypeScript for robust API development
- **Comprehensive Security** middleware stack:
  - Helmet for security headers
  - CORS configuration
  - Rate limiting protection
  - NoSQL injection prevention
  - XSS attack prevention with DOMPurify
  - HTTP Parameter Pollution (HPP) protection
- **Development Tools**:
  - Hot reloading with Nodemon and TSX
  - Code formatting with Prettier
  - TypeScript compilation and type checking
- **ES Modules** support for modern JavaScript

## Prerequisites

- Node.js 18+
- pnpm package manager

## Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Available Scripts

### Development

- `pnpm dev` - Start development server with hot reloading (using TSX)
- `pnpm nodemon` - Start development server with Nodemon

### Production

- `pnpm build` - Build the project for production
- `pnpm start` - Start the production server

### Code Quality

- `pnpm prettier` - Format code with Prettier
- `pnpm prettier:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm lint` - Run type checking and formatting check

## Project Structure

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
└── config/
    ├── Limiter.ts      # Rate limiting configuration
    └── Sanitize.ts     # Input sanitization utilities
```

## Development

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. The server will start at:
   - **Local**: `http://localhost:4000`
   - **Network**: `http://0.0.0.0:4000`

3. The server automatically restarts when you make changes to the source files.

## Technologies Used

### Runtime & Language

- Node.js with ES Modules
- TypeScript

### Framework & Libraries

- Express.js
- Cloudinary (for image management)

### Security Middleware

- Helmet (security headers)
- CORS (cross-origin resource sharing)
- express-mongo-sanitize (NoSQL injection prevention)
- DOMPurify (XSS prevention)
- hpp (HTTP Parameter Pollution protection)
- express-rate-limit (rate limiting)

### Development Tools

- TSX (TypeScript execution)
- Nodemon (hot reloading)
- Prettier (code formatting)

### Package Manager

- pnpm
