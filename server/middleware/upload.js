/**
 * server/middleware/upload.js
 * ─────────────────────────────────────────────────────────────────
 * Multer configuration for handling image and video file uploads.
 * Files are stored locally for Experiment 1.1.1.
 *
 * Future experiments:
 *   - Replace diskStorage with a Cloudinary / S3 multer storage engine
 *     (e.g., multer-storage-cloudinary or multer-s3).
 *   - Only the storage variable needs to change; the rest of this
 *     middleware stays the same.
 * ─────────────────────────────────────────────────────────────────
 */

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ── Ensure uploads directory exists ─────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Disk storage configuration ───────────────────────────────────
// Future: swap this block for a cloud storage engine
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext          = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ── File type filter ─────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  const ALLOWED_MIME_TYPES = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
  ];

  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed types: images and videos only.`
      ),
      false
    );
  }
};

// ── Multer instance ──────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max per file
    files: 10,                   // max 10 files per request
  },
});

module.exports = upload;
