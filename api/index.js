/**
 * Taranga Ocean Hazard Monitoring System - Unified Backend Server
 * This file serves as the single entry point for all environments (Vercel and local)
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// --- CORRECTED ROUTE IMPORT ---
// All API logic is now driven from the correct auth file.
import authRoutes from '../src/api/auth.js';

// --- TODO: CONSOLIDATE OTHER ROUTES ---
// These routes are from the old structure and need to be migrated
// to the new `src/api` directory pattern before being re-enabled.
// import hazardRoutes from '../routes/hazards.js';
// import socialMediaRoutes from '../routes/socialMedia.js';
// import donationRoutes from '../routes/donations.js';
// import volunteerRoutes from '../routes/volunteers.js';
// import analyticsRoutes from '../routes/analytics.js';
// import notificationRoutes from '../routes/notifications.js';

const app = express();

/**
 * Middleware Setup
 */
app.use(helmet()); // Basic security headers
app.use(compression()); // Gzip compression
app.use(morgan('combined')); // Request logging
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: '10mb' })); // JSON body parser

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);


/**
 * --- API ROUTES ---
 */

// Authentication routes - THE ONLY ENABLED ROUTE
app.use('/api/auth', authRoutes);

// --- TODO: Re-enable these routes after they are fixed ---
// app.use('/api/hazards', hazardRoutes);
// app.use('/api/social-media', socialMediaRoutes);
// app.use('/api/donations', donationRoutes);
// app.use('/api/volunteers', volunteerRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * --- ERROR HANDLING ---
 */

// 404 handler for any unhandled API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('--- GLOBAL SERVER ERROR ---');
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'An internal server error occurred.',
  });
});

// Export the app for Vercel's serverless environment
export default app;