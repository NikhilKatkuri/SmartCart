# Express.js Security Checklist

## ✅ Implemented Security Measures

### 1. Security Headers

- **Helmet**: Comprehensive security headers
- **Custom Security Headers**: Additional protection against XSS, clickjacking, etc.
- **Content Security Policy (CSP)**: Prevents XSS attacks (production only)
- **HSTS**: Forces HTTPS in production

### 2. Input Validation & Sanitization

- **Express Mongo Sanitize**: Prevents NoSQL injection attacks
- **XSS Clean**: Prevents cross-site scripting attacks
- **HPP**: Prevents HTTP Parameter Pollution attacks
- **Body Size Limits**: Prevents DoS attacks via large payloads

### 3. Rate Limiting

- **General Rate Limiting**: 100 requests per 15 minutes
- **Auth Rate Limiting**: Stricter limits for authentication endpoints
- **Configurable Limits**: Different limits for development vs production

### 4. CORS Configuration

- **Strict Origin Control**: Only allowed origins can access your API
- **Credential Support**: Properly configured for cookie-based auth
- **Method Restrictions**: Only necessary HTTP methods allowed

### 5. Performance & Security

- **Compression**: Reduces response size and improves performance
- **Trust Proxy**: Properly configured for reverse proxy scenarios

## 🔐 Additional Security Recommendations

### 1. Authentication & Authorization

```typescript
// Add these to your routes
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// JWT middleware
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### 2. Input Validation

```typescript
// Use express-validator for robust input validation
import { body, validationResult } from 'express-validator';

export const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

### 3. Session Security

```typescript
import session from 'express-session';
import MongoStore from 'connect-mongo';

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL!,
    }),
    cookie: {
      secure: production_mode, // HTTPS only in production
      httpOnly: true, // Prevent XSS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'strict', // CSRF protection
    },
  })
);
```

### 4. File Upload Security

```typescript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});
```

### 5. Logging & Monitoring

```typescript
import winston from 'winston';
import morgan from 'morgan';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// HTTP request logging
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);
```

## 🚨 Critical Security Practices

### 1. Environment Variables

- ✅ Use `.env` files for configuration
- ✅ Never commit `.env` files to version control
- ✅ Use different configurations for different environments
- ✅ Validate required environment variables on startup

### 2. Dependencies

```bash
# Regular security audits
npm audit
pnpm audit

# Keep dependencies updated
npm update
pnpm update

# Use tools like Snyk for continuous monitoring
```

### 3. Error Handling

```typescript
// Global error handler (add at the end of middleware stack)
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err.stack);

  if (production_mode) {
    res.status(500).json({ error: 'Something went wrong!' });
  } else {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
```

### 4. Database Security

- Use parameterized queries/ORM to prevent SQL injection
- Implement proper indexing for performance
- Use database user with minimal required permissions
- Enable database logging and monitoring

### 5. HTTPS in Production

- Always use HTTPS in production
- Configure proper SSL/TLS certificates
- Use HTTP/2 when possible
- Implement certificate pinning for mobile apps

## 📦 Recommended Additional Packages

```bash
pnpm add express-validator winston morgan jsonwebtoken bcrypt express-session connect-mongo multer
pnpm add -D @types/express-session @types/multer @types/jsonwebtoken @types/bcrypt
```

## 🔍 Security Testing

### 1. Automated Testing

- Use OWASP ZAP for security testing
- Implement unit tests for security functions
- Use tools like `npm audit` regularly

### 2. Manual Testing

- Test rate limiting functionality
- Verify CORS configuration
- Test authentication/authorization flows
- Validate input sanitization

### 3. Monitoring

- Set up error tracking (Sentry, Bugsnag)
- Monitor for unusual traffic patterns
- Log security events
- Set up alerts for failures

Remember: Security is an ongoing process, not a one-time setup. Regularly update dependencies, monitor for vulnerabilities, and stay informed about new security best practices!
