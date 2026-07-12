/**
 * Post.js — Mongoose model for social media posts
 *
 * Stores all data related to a composed post including content,
 * selected platforms, uploaded media references, and validation results.
 *
 * Future experiments will extend this model with:
 *   - authorId (User reference for authentication)
 *   - scheduledAt (for content scheduling)
 *   - publishedAt + publishStatus (for analytics)
 *   - aiGeneratedCaption, aiGeneratedHashtags (for AI module)
 *   - teamId (for team collaboration)
 */

const mongoose = require('mongoose');

// ─── Validation Result Sub-Schema ─────────────────────────────────────────────
const PlatformValidationSchema = new mongoose.Schema(
  {
    valid: { type: Boolean, required: true },
    errorMessages: [{ type: String }],
    warningMessages: [{ type: String }],
  },
  { _id: false, suppressReservedKeysWarning: true }
);

// ─── Post Schema ──────────────────────────────────────────────────────────────
const PostSchema = new mongoose.Schema(
  {
    // Main post content
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      maxlength: [63206, 'Content exceeds the maximum allowed length'],
    },

    // Platforms selected by the user
    selectedPlatforms: {
      type: [
        {
          type: String,
          enum: ['twitter', 'facebook', 'instagram', 'linkedin'],
        },
      ],
      required: [true, 'At least one platform must be selected'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one platform must be selected',
      },
    },

    // Media file references (stored as relative paths / filenames)
    uploadedImage: {
      type: String,
      default: null,
    },
    uploadedVideo: {
      type: String,
      default: null,
    },

    // Computed metrics (denormalised for query performance)
    characterCount: {
      type: Number,
      required: true,
      min: 0,
    },
    hashtagCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Validation results per platform (snapshot at time of save)
    validationStatus: {
      type: Map,
      of: PlatformValidationSchema,
      default: {},
    },

    // ── Extension points for future experiments ──────────────────────────────
    // authorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // scheduledAt: { type: Date, default: null },
    // publishStatus: { type: String, enum: ['draft', 'scheduled', 'published', 'failed'], default: 'draft' },
    // aiMetadata:  { type: Object, default: {} },
    // teamId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
PostSchema.index({ createdAt: -1 }); // Most recent posts first
PostSchema.index({ selectedPlatforms: 1 }); // Filter by platform

// ─── Virtual: overall validity across all platforms ──────────────────────────
PostSchema.virtual('isFullyValid').get(function () {
  for (const [, result] of this.validationStatus) {
    if (!result.valid) return false;
  }
  return true;
});

module.exports = mongoose.model('Post', PostSchema);
