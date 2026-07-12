/**
 * server.js — Express application entry point for SocialHub AI
 *
 * Configures:
 *   - Environment variables (dotenv)
 *   - MongoDB connection
 *   - Middleware stack (CORS, JSON, Morgan, static files)
 *   - API routes
 *   - Centralised error handler
 *   - Graceful shutdown
 *
 * Future experiments will extend this with:
 *   - Passport.js / JWT authentication middleware
 *   - Socket.io for real-time notifications
 *   - Rate limiting (express-rate-limit)
 *   - Helmet for security headers
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const errorHandler = require('./middleware/errorHandler');

// ─── App Initialisation ───────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — allow requests from the Vite dev server (and future production domain)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// HTTP request logger (dev format in development, combined in production)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse JSON bodies (limit set to prevent abuse)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded media files statically
// e.g. GET /uploads/1234567890-photo.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SocialHub AI API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/posts', postRoutes);

// ── Stubs for future experiment routes (uncomment as needed) ──────────────────
// app.use('/api/auth',          require('./routes/authRoutes'));
// app.use('/api/users',         require('./routes/userRoutes'));
// app.use('/api/schedule',      require('./routes/scheduleRoutes'));
// app.use('/api/analytics',     require('./routes/analyticsRoutes'));
// app.use('/api/teams',         require('./routes/teamRoutes'));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Centralised Error Handler (must be last) ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 SocialHub AI Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = (signal) => {
  console.log(`\n⚡ ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections — log but don't crash
// (DB retry failures are handled gracefully in config/db.js)
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled Promise Rejection:', reason?.message || reason);
});

module.exports = app; // Export for testing in future experiments
