import rateLimit from 'express-rate-limit';

const Limiter = (production_mode: boolean) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: production_mode ? 100 : 10000,
    message: {
      error:
        'Too many requests from this IP, please try again after 15 minutes',
      retryAfter: 15 * 60 * 1000,
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests
    skipSuccessfulRequests: false,
  });

export default Limiter;
