/**
 * server/index.js
 * ─────────────────────────────────────────────────────────────────
 * Server entry point.
 * Loads environment variables, connects to MongoDB, then starts
 * the Express server.
 * ─────────────────────────────────────────────────────────────────
 */

require('dotenv').config();

const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB, then start listening ─────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  SocialHub AI Server running on http://localhost:${PORT}`);
    console.log(`📡  Environment: ${process.env.NODE_ENV}`);
    console.log(`🩺  Health check: http://localhost:${PORT}/api/health`);
  });
});
