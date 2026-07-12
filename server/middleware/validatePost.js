/**
 * validatePost.js — Request validation middleware for post endpoints
 *
 * Runs server-side validation before the request reaches the controller.
 * Uses express-validator for request body checks and custom platform rules.
 */

const { body, validationResult } = require('express-validator');

// ─── Allowed platform identifiers ────────────────────────────────────────────
const VALID_PLATFORMS = ['twitter', 'facebook', 'instagram', 'linkedin'];

/**
 * Validation rules array for creating a post.
 * Pass this array as middleware before the controller handler.
 */
const postValidationRules = [
  body('content')
    .notEmpty()
    .withMessage('Post content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ max: 63206 })
    .withMessage('Content exceeds the maximum allowed length (63,206 characters)'),

  body('selectedPlatforms')
    .isArray({ min: 1 })
    .withMessage('At least one platform must be selected')
    .custom((platforms) => {
      const invalid = platforms.filter((p) => !VALID_PLATFORMS.includes(p));
      if (invalid.length > 0) {
        throw new Error(`Invalid platform(s): ${invalid.join(', ')}`);
      }
      return true;
    }),
];

/**
 * Middleware that reads express-validator results and sends a 422 if invalid.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: 'Validation Failed',
      messages: errors.array().map((e) => e.msg),
    });
  }
  next();
};

module.exports = { postValidationRules, handleValidationErrors };
