import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './modules/auth/index.js';
import healthRoutes from './modules/health/health.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Compress response bodies
app.use(compression());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

app.use('/api', apiLimiter);

// Health check endpoint
app.use('/health', healthRoutes);

// Auth routes
app.use('/api/v1/auth', authRoutes);

// Catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// Global central error handler middleware
app.use(errorHandler);

export default app;
