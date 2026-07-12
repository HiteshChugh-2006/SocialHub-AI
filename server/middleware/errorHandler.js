/**
 * errorHandler.js — Centralised Express error-handling middleware
 *
 * Must be registered LAST in the Express middleware chain (after all routes).
 * Formats all errors into a consistent JSON response shape.
 *
 * Future experiments may extend this with:
 *   - Sentry / monitoring integration
 *   - Error type classification (4xx vs 5xx)
 *   - Request ID tracing
 */

/**
 * Global error handler middleware.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  // Log the full error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('🔥 Error:', err);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages,
    });
  }

  // Mongoose cast error (invalid ObjectId etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid resource identifier',
      messages: [err.message],
    });
  }

  // Duplicate key (MongoDB unique constraint)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate resource',
      messages: ['A resource with this value already exists'],
    });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File too large',
      messages: ['Uploaded file exceeds the size limit'],
    });
  }

  // Default: internal server error
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    messages: [],
  });
};

module.exports = errorHandler;
