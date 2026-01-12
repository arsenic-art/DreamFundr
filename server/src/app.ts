import express from "express";
import cors from "cors";
import helmet from "helmet";
import healthRoutes from "./routes/health.routes.js";
import routes from "./routes/index.js";
import { handleWebhook } from "./controllers/payment.controller.js";
import { requestLogger, errorLogger } from "./middlewares/logger.middleware.js";
import rateLimit from "express-rate-limit";

const app = express();
app.set('trust proxy', 1);

app.use(requestLogger);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://checkout.razorpay.com"],
      frameSrc: ["https://api.razorpay.com", "https://checkout.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false, 
}));

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ["http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400, // 24 hours
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 500 : 1000,
  message: { 
    message: "Too many requests, please try again later.",
    retryAfter: Math.ceil(15 * 60 * 1000 / 1000) 
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.originalUrl === '/health',  
});
app.use(limiter);

// Health check endpoint (before other middlewares for faster response)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// WEBHOOK FIRST (before JSON parsing) - with enhanced security
app.post("/api/payments/webhook", 
  express.raw({ type: "application/json", limit: '1mb' }),
  handleWebhook
);

// JSON parsing AFTER webhook with security limits
app.use(express.json({ 
  limit: process.env.NODE_ENV === 'production' ? '5mb' : '10mb'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.NODE_ENV === 'production' ? '5mb' : '10mb'
}));

// API Routes
app.use("/api", routes);
app.use("/health", healthRoutes);

// Catch-all route for undefined endpoints
app.use('/', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.use(errorLogger);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

export default app;
