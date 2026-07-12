/**
 * validators.js (client) — Frontend validation utilities for SocialHub AI
 *
 * Mirrors server/utils/validators.js to provide real-time validation feedback.
 * Both must stay in sync whenever platform rules change.
 */

import { PLATFORMS, COUNTER_THRESHOLDS } from './constants';

// ─── Hashtag Regex ────────────────────────────────────────────────────────────
const HASHTAG_REGEX = /#\w+/g;

/**
 * Count the number of hashtags in a text string.
 * @param {string} text
 * @returns {number}
 */
export const countHashtags = (text) => {
  const matches = text.match(HASHTAG_REGEX);
  return matches ? matches.length : 0;
};

/**
 * Determine character counter color based on usage vs limit.
 * @param {number} count  - current character count
 * @param {number} limit  - platform character limit
 * @returns {'normal'|'warning'|'danger'}
 */
export const getCounterStatus = (count, limit) => {
  if (count > limit) return 'danger';
  if (count >= limit * COUNTER_THRESHOLDS.WARNING_PERCENT) return 'warning';
  return 'normal';
};

/**
 * Validate post content against a specific platform's rules.
 *
 * @param {object} platform  - Platform object from PLATFORMS array
 * @param {object} postData  - { content, hasImage, hasVideo }
 * @returns {{ valid: boolean, status: 'ready'|'warning'|'error', errors: string[], warnings: string[] }}
 */
export const validateForPlatform = (platform, postData) => {
  const { content = '', hasImage = false, hasVideo = false } = postData;
  const errors = [];
  const warnings = [];
  const charCount = content.length;
  const hashtagCount = countHashtags(content);

  // ── Character limit check ────────────────────────────────────────────────
  if (charCount > platform.charLimit) {
    errors.push(`Exceeds character limit (${charCount.toLocaleString()} / ${platform.charLimit.toLocaleString()})`);
  } else if (charCount >= platform.charLimit * COUNTER_THRESHOLDS.WARNING_PERCENT) {
    warnings.push(`Approaching character limit (${charCount.toLocaleString()} / ${platform.charLimit.toLocaleString()})`);
  }

  // ── Hashtag limit check ──────────────────────────────────────────────────
  if (platform.maxHashtags !== null && hashtagCount > platform.maxHashtags) {
    errors.push(`Too many hashtags (${hashtagCount} / ${platform.maxHashtags} max)`);
  }

  // ── Video support check ──────────────────────────────────────────────────
  if (hasVideo && !platform.supportsVideos) {
    errors.push(`${platform.name} doesn't support video uploads`);
  }

  // ── Image support check ──────────────────────────────────────────────────
  if (hasImage && !platform.supportsImages) {
    errors.push(`${platform.name} doesn't support image uploads`);
  }

  // ── Derive status ────────────────────────────────────────────────────────
  let status;
  if (errors.length > 0) {
    status = 'error';
  } else if (warnings.length > 0) {
    status = 'warning';
  } else {
    status = 'ready';
  }

  return {
    valid: errors.length === 0,
    status,
    errors,
    warnings,
  };
};

/**
 * Validate post content across all selected platforms.
 *
 * @param {string[]} selectedPlatformIds  - Array of platform id strings
 * @param {object}   postData             - { content, hasImage, hasVideo }
 * @returns {object} Map of platformId → validation result
 */
export const validateAllPlatforms = (selectedPlatformIds, postData) => {
  const results = {};

  selectedPlatformIds.forEach((id) => {
    const platform = PLATFORMS.find((p) => p.id === id);
    if (platform) {
      results[id] = validateForPlatform(platform, postData);
    }
  });

  return results;
};

/**
 * Returns true if ALL selected platforms pass validation.
 * Used to enable/disable the Publish button.
 *
 * @param {object} validationResults  - Output of validateAllPlatforms()
 * @returns {boolean}
 */
export const isAllValid = (validationResults) => {
  return Object.values(validationResults).every((r) => r.valid);
};

/**
 * Validate that uploaded file is an accepted image type.
 * @param {File} file
 * @returns {boolean}
 */
export const isValidImageFile = (file) => {
  const accepted = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return accepted.includes(file.type);
};

/**
 * Validate that uploaded file is an accepted video type.
 * @param {File} file
 * @returns {boolean}
 */
export const isValidVideoFile = (file) => {
  const accepted = ['video/mp4', 'video/quicktime', 'video/webm'];
  return accepted.includes(file.type);
};

/**
 * Format bytes to a human-readable string (e.g. "4.2 MB")
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
