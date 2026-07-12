/**
 * server/app.js
 * ─────────────────────────────────────────────────────────────────
 * Express application factory.
 * Keeps app config separate from server startup (index.js),
 * which makes testing easier in future experiments.
 *
 * Future experiments:
 *   - Mount /api/auth    router – Exp: Authentication
 *   - Mount /api/users   router – Exp: User management
 *   - Mount /api/schedule router – Exp: Scheduling
 *   - Mount /api/analytics router – Exp: Analytics
 *   - Add rate-limiter middleware  – Exp: Security hardening
 *   - Add helmet middleware        – Exp: Security hardening
 * ─────────────────────────────────────────────────────────────────
 */

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const path       = require('path');

const postRoutes = require('./routes/postRoutes');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ── HTTP request logger ──────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Body parsers ─────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files: serve uploaded media ──────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API routes ───────────────────────────────────────────────────
app.use('/api/posts', postRoutes);

// Future routes (Exp placeholders):
// app.use('/api/auth',      require('./routes/authRoutes'));
// app.use('/api/users',     require('./routes/userRoutes'));
// app.use('/api/schedule',  require('./routes/scheduleRoutes'));
// app.use('/api/analytics', require('./routes/analyticsRoutes'));

// ── Health check endpoint ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    version:   '1.1.1',
  });
});

// ── 404 handler ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[GlobalError]', err);

  // Multer-specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Maximum 100 MB.' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ success: false, message: 'Too many files. Maximum 10 per request.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
