import 'dotenv/config';

import express from 'express';
import Limiter from './config/Limiter';
import compression from 'compression';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import sanitizeObject from './config/Sanitize';
import hpp from 'hpp';
import cors from 'cors';
import router from './routes';
import { globalErrorHandler } from './handlers/errorHandler';

const production_mode = process.env['NODE_ENV'] === 'production' ? true : false;

const app: express.Application = express();

// Trust proxy if behind reverse proxy (like nginx)
if (production_mode) {
  app.set('trust proxy', 1);
}

// Compression for better performance
app.use(compression());

// Enhanced Helmet configuration for better security
app.use(
  helmet({
    contentSecurityPolicy: production_mode
      ? {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
          },
        }
      : false, // Disable CSP in development mode
    crossOriginEmbedderPolicy: false,
    hsts: production_mode
      ? {
          maxAge: 31536000, // 1 year
          includeSubDomains: true,
          preload: true,
        }
      : false,
  })
);

// Security headers middleware
app.use((_req, res, next) => {
  // Remove Express server header
  res.removeHeader('X-Powered-By');

  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  if (production_mode) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  next();
});

// CORS configuration
app.use(
  cors({
    origin: production_mode
      ? process.env['CLIENT_URL']?.split(',') || false // Support multiple origins
      : ['http://localhost:3000', 'http://localhost:3001'], // Dev origins
    credentials: true, // Allow cookies
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 86400, // 24 hours
  })
);

// body parser
app.use(
  express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      // Store raw body for webhook verification if needed
      req.rawBody = buf;
    },
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 1000,
  })
);

// rate limit middleware
app.use(Limiter(production_mode));

// Prevent NoSQL injection attacks (body only - Express 5.x compatible)
app.use((req, _res, next) => {
  // Only sanitize request body and params, avoid query due to Express 5.x read-only issue
  if (req.body && typeof req.body === 'object') {
    req.body = ExpressMongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  if (req.params && typeof req.params === 'object') {
    req.params = ExpressMongoSanitize.sanitize(req.params, {
      replaceWith: '_',
    });
  }
  next();
});

// Prevent XSS attacks with DOMPurify
app.use((req, _res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters (Express 5.x compatible)
  if (req.query && typeof req.query === 'object') {
    // Since req.query is read-only in Express 5.x, sanitize individual properties
    const queryKeys = Object.keys(req.query);
    for (const key of queryKeys) {
      const value = req.query[key];
      if (typeof value === 'string') {
        // Directly modify the property instead of reassigning the whole object
        (req.query as any)[key] = sanitizeObject(value);
      } else if (Array.isArray(value)) {
        (req.query as any)[key] = sanitizeObject(value);
      }
    }
  }

  next();
});

// Prevent HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: ['sort', 'fields'], // Add parameter names that are allowed to be duplicated
  })
);

// routes
app.use(router);

// global error handler
app.use(globalErrorHandler);

export default app;
