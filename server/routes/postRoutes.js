/**
 * postRoutes.js — Route definitions for the /api/posts endpoint
 *
 * Registers:
 *   POST /api/posts  — create a new post (with optional file uploads)
 *   GET  /api/posts  — retrieve paginated posts
 *
 * Multer is configured here to handle multipart/form-data for media uploads.
 * Files are stored in server/uploads/ in development.
 * Future experiments will swap this for cloud storage (e.g. AWS S3, Cloudinary).
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const { createPost, getPosts } = require('../controllers/postController');
const { postValidationRules, handleValidationErrors } = require('../middleware/validatePost');

const router = express.Router();

// ─── Multer Storage Configuration ────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Prefix with timestamp to avoid filename collisions
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
  const allowed = [...allowedImageTypes, ...allowedVideoTypes];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB per file
  },
});

// Multer fields configuration: one image, one video
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/posts
router.post(
  '/',
  uploadFields,
  postValidationRules,
  handleValidationErrors,
  createPost
);

// GET /api/posts
router.get('/', getPosts);

module.exports = router;
