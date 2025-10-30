import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for admin operations
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 admin requests per windowMs
  message: {
    status: 429,
    success: false,
    error: 'Too many admin requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict rate limiting for authentication
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    status: 429,
    success: false,
    error: 'Too many login attempts from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Moderate rate limiting for user registration
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: {
    status: 429,
    success: false,
    error: 'Too many registration attempts from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for order creation
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 orders per windowMs
  message: {
    status: 429,
    success: false,
    error: 'Too many orders from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for newsletter subscription
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 newsletter subscriptions per hour
  message: {
    status: 429,
    success: false,
    error: 'Too many newsletter subscription attempts from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
