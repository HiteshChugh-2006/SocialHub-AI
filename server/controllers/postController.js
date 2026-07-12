/**
 * postController.js — HTTP handlers for post routes
 *
 * Thin controller layer — only deals with HTTP concerns (req/res).
 * All business logic is delegated to postService.
 */

const postService = require('../services/postService');

/**
 * POST /api/posts
 * Create a new post with optional media uploads.
 */
const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.body, req.files || {});

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error); // Delegate to centralised error handler
  }
};

/**
 * GET /api/posts
 * Retrieve paginated list of posts (most recent first).
 *
 * Query params:
 *   page  {number} default 1
 *   limit {number} default 10
 */
const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await postService.getPosts({ page, limit });

    return res.status(200).json({
      success: true,
      data: result.posts,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getPosts };
