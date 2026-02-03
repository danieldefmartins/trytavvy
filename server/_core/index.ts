import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { securityHeaders } from "./securityHeaders";
import { handleStripeWebhook } from "../webhookHandler";

// ============================================================
// CORS Configuration - Environment-based allowlist
// ============================================================

// Parse allowed origins from environment variable
// Format: comma-separated list of origins
// Example: CORS_ALLOWED_ORIGINS=https://pros.tavvy.com,https://trytavvy.com
function getAllowedOrigins(): string[] {
  const envOrigins = process.env.CORS_ALLOWED_ORIGINS || '';
  const origins = envOrigins
    .split(',')
    .map(o => o.trim())
    .filter(o => o.length > 0);
  
  // In development, allow localhost
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3000');
    origins.push('http://localhost:5173');
    origins.push('http://127.0.0.1:3000');
    origins.push('http://127.0.0.1:5173');
  }
  
  console.log('[CORS] Allowed origins:', origins);
  return origins;
}

const ALLOWED_ORIGINS = getAllowedOrigins();

// ============================================================
// Rate Limiting - In-memory sliding window implementation
// ============================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  message?: string;
}

function createRateLimiter(config: RateLimitConfig) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Get client identifier (IP address, with fallback)
    const clientIp = req.ip || 
      req.headers['x-forwarded-for']?.toString().split(',')[0] || 
      req.socket.remoteAddress || 
      'unknown';
    
    const key = `${clientIp}:${req.path}`;
    const now = Date.now();
    
    let entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired one
      entry = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(key, entry);
    } else {
      entry.count++;
    }
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.maxRequests - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));
    
    if (entry.count > config.maxRequests) {
      console.warn(`[RateLimit] Exceeded for ${clientIp} on ${req.path}`);
      return res.status(429).json({
        error: config.message || 'Too many requests, please try again later.',
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      });
    }
    
    next();
  };
}

// Rate limiters for different endpoints
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 10,  // 10 login attempts per 15 minutes
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 100,  // 100 requests per minute
  message: 'API rate limit exceeded. Please slow down.',
});

const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 30,  // 30 requests per minute for sensitive operations
  message: 'Rate limit exceeded for this operation.',
});

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Trust proxy for accurate IP detection behind Railway/load balancers
  app.set('trust proxy', 1);
  
  // Error handling for malformed URLs (bot scanners send invalid UTF-8 sequences)
  app.use((req, res, next) => {
    try {
      decodeURIComponent(req.path);
      next();
    } catch (e) {
      // Silently reject malformed URLs (likely bot/scanner attacks)
      res.status(400).send('Bad Request');
    }
  });
  
  // CORS middleware with allowlist
  app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman, etc.)
      // These requests are authenticated via JWT in Authorization header, not cookies
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowlist
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      
      // Reject unknown origins
      console.warn(`[CORS] Rejected request from origin: ${origin}`);
      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
  }));
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Security headers
  app.use(securityHeaders({
    cspDirectives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
      'connect-src': [
        "'self'",
        'https://*.supabase.co',
        'wss://*.supabase.co',
        'https://api.stripe.com',
        'https://js.stripe.com',
      ],
      'frame-src': ['https://js.stripe.com', 'https://hooks.stripe.com'],
      'frame-ancestors': ["'self'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
    },
    xFrameOptions: 'SAMEORIGIN', // Allow Stripe iframes
  }));
  
  // Apply rate limiting to auth endpoints
  app.use('/api/trpc/auth.login', authRateLimiter);
  app.use('/api/trpc/auth.register', authRateLimiter);
  
  // Apply strict rate limiting to sensitive operations
  app.use('/api/trpc/stripe', strictRateLimiter);
  app.use('/api/trpc/subscription', strictRateLimiter);
  
  // Apply general rate limiting to all API endpoints
  app.use('/api/trpc', apiRateLimiter);
  
  // Stripe webhook - Must be before express.json() middleware
  // Raw body is needed for webhook signature verification
  app.post(
    '/api/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
  );
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
