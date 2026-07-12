/**
 * validators.js (server) — Platform validation rules engine
 * Mirrors the frontend validators to enforce server-side validation.
 * Single source of truth for platform rules lives in PLATFORM_RULES.
 *
 * Future experiments may extend this with AI-based content analysis,
 * sentiment checks, spam detection, etc.
 */

// ─── Platform Rules ───────────────────────────────────────────────────────────
const PLATFORM_RULES = {
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    charLimit: 280,
    supportsImages: true,
    supportsVideos: true,
    maxHashtags: null, // null = unlimited
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    charLimit: 63206,
    supportsImages: true,
    supportsVideos: true,
    maxHashtags: null,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    charLimit: 2200,
    supportsImages: true,
    supportsVideos: true,
    maxHashtags: 30,
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    charLimit: 3000,
    supportsImages: true,
    supportsVideos: false,
    maxHashtags: 5,
  },
};

/**
 * Count hashtags in a given text string using regex.
 * @param {string} text
 * @returns {number} count of hashtags
 */
const countHashtags = (text) => {
  const matches = text.match(/#\w+/g);
  return matches ? matches.length : 0;
};

/**
 * Validate a post against a specific platform's rules.
 * @param {string} platformId - One of: twitter, facebook, instagram, linkedin
 * @param {object} postData - { content, hasImage, hasVideo }
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
const validateForPlatform = (platformId, postData) => {
  const rules = PLATFORM_RULES[platformId];
  if (!rules) {
    return { valid: false, errors: [`Unknown platform: ${platformId}`], warnings: [] };
  }

  const { content = '', hasImage = false, hasVideo = false } = postData;
  const errors = [];
  const warnings = [];
  const charCount = content.length;
  const hashtagCount = countHashtags(content);

  // Character limit
  if (charCount > rules.charLimit) {
    errors.push(
      `Content exceeds ${rules.name} character limit (${charCount}/${rules.charLimit})`
    );
  } else if (charCount > rules.charLimit * 0.9) {
    warnings.push(
      `Approaching ${rules.name} character limit (${charCount}/${rules.charLimit})`
    );
  }

  // Hashtag limit
  if (rules.maxHashtags !== null && hashtagCount > rules.maxHashtags) {
    errors.push(
      `Too many hashtags for ${rules.name} (${hashtagCount}/${rules.maxHashtags} max)`
    );
  }

  // Video support
  if (hasVideo && !rules.supportsVideos) {
    errors.push(`${rules.name} does not support video uploads`);
  }

  // Image support
  if (hasImage && !rules.supportsImages) {
    errors.push(`${rules.name} does not support image uploads`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate a post across all selected platforms.
 * @param {object} postData - { content, selectedPlatforms, hasImage, hasVideo }
 * @returns {object} Map of platformId → validation result
 */
const validatePost = (postData) => {
  const { selectedPlatforms = [] } = postData;
  const results = {};

  selectedPlatforms.forEach((platformId) => {
    results[platformId] = validateForPlatform(platformId, postData);
  });

  return results;
};

module.exports = {
  PLATFORM_RULES,
  countHashtags,
  validateForPlatform,
  validatePost,
};
