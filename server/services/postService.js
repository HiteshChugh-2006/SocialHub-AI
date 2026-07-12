/**
 * postService.js — Business logic layer for post operations
 *
 * Separates business rules from controller/route concerns.
 * Controllers call service methods; services interact with models.
 *
 * Future experiments will extend this with:
 *   - AI caption/hashtag generation
 *   - Scheduling logic
 *   - Publishing to actual social media APIs
 *   - Analytics event tracking
 */

const Post = require('../models/Post');
const { validatePost, countHashtags } = require('../utils/validators');

/**
 * Create and persist a new post after running server-side validation.
 *
 * @param {object} data - Raw post data from the request body
 * @param {object} files - Multer file objects { image?, video? }
 * @returns {Promise<Post>} The saved Mongoose document
 */
const createPost = async (data, files = {}) => {
  const { content, selectedPlatforms } = data;

  // ── Resolve media references ─────────────────────────────────────────────
  const uploadedImage = files.image ? files.image[0].filename : null;
  const uploadedVideo = files.video ? files.video[0].filename : null;

  // ── Compute metrics ──────────────────────────────────────────────────────
  const characterCount = content ? content.length : 0;
  const hashtagCount = content ? countHashtags(content) : 0;

  // ── Validate against all selected platforms ──────────────────────────────
  const rawValidation = validatePost({
    content,
    selectedPlatforms,
    hasImage: !!uploadedImage,
    hasVideo: !!uploadedVideo,
  });

  // Map to schema field names (errorMessages / warningMessages)
  const validationStatus = {};
  Object.entries(rawValidation).forEach(([platformId, result]) => {
    validationStatus[platformId] = {
      valid: result.valid,
      errorMessages: result.errors,
      warningMessages: result.warnings,
    };
  });

  // ── Build and persist the document ──────────────────────────────────────
  const post = new Post({
    content,
    selectedPlatforms,
    uploadedImage,
    uploadedVideo,
    characterCount,
    hashtagCount,
    validationStatus,
  });

  await post.save();
  return post;
};

/**
 * Retrieve posts with optional pagination.
 *
 * @param {object} options - { page, limit }
 * @returns {Promise<{ posts: Post[], total: number, page: number, pages: number }>}
 */
const getPosts = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Post.countDocuments(),
  ]);

  return {
    posts,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

module.exports = { createPost, getPosts };
