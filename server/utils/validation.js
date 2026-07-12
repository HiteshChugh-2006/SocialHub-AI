/**
 * server/utils/validation.js
 * ─────────────────────────────────────────────────────────────────
 * Pure validation functions for post content and media rules.
 * Business logic lives here — controllers stay thin.
 *
 * Future experiments:
 *   - Add AI-content moderation checks (Exp: AI generation).
 *   - Add URL-preview validation (Exp: link sharing).
 *   - Add scheduled-time window validation (Exp: scheduling).
 * ─────────────────────────────────────────────────────────────────
 */

// ── Platform rules (single source of truth) ──────────────────────
const PLATFORM_RULES = {
  twitter: {
    label: 'Twitter/X',
    maxChars: 280,
    maxHashtags: Infinity,
    allowVideo: true,
    allowImage: true,
  },
  facebook: {
    label: 'Facebook',
    maxChars: 63206,
    maxHashtags: Infinity,
    allowVideo: true,
    allowImage: true,
  },
  instagram: {
    label: 'Instagram',
    maxChars: 2200,
    maxHashtags: 30,
    allowVideo: true,
    allowImage: true,
  },
  linkedin: {
    label: 'LinkedIn',
    maxChars: 3000,
    maxHashtags: 5,
    allowVideo: false,
    allowImage: true,
  },
};

/**
 * Count hashtags in text content.
 * Matches #word patterns (ignores URLs and numbers-only tags).
 * @param {string} text
 * @returns {number}
 */
const countHashtags = (text) => {
  const matches = text.match(/#[a-zA-Z][a-zA-Z0-9_]*/g);
  return matches ? matches.length : 0;
};

/**
 * Count characters in content (simple Unicode-aware count).
 * @param {string} text
 * @returns {number}
 */
const countCharacters = (text) => {
  return [...text].length; // spread handles emoji / surrogate pairs
};

/**
 * Validate a post against all selected platforms.
 *
 * @param {Object} params
 * @param {string}   params.content     – Post text content
 * @param {string[]} params.platforms   – Selected platforms
 * @param {Object[]} params.media       – Uploaded media objects { type: 'image'|'video' }
 *
 * @returns {{ valid: boolean, errors: Object[], platformStats: Object[] }}
 */
const validatePost = ({ content, platforms, media = [] }) => {
  if (!content || content.trim().length === 0) {
    return {
      valid: false,
      errors: [{ platform: 'all', message: 'Post content cannot be empty.' }],
      platformStats: [],
    };
  }

  if (!platforms || platforms.length === 0) {
    return {
      valid: false,
      errors: [{ platform: 'all', message: 'At least one platform must be selected.' }],
      platformStats: [],
    };
  }

  const charCount = countCharacters(content);
  const hashCount = countHashtags(content);
  const hasVideo  = media.some((m) => m.type === 'video');

  const errors        = [];
  const platformStats = [];

  for (const platform of platforms) {
    const rules = PLATFORM_RULES[platform];
    if (!rules) {
      errors.push({ platform, message: `Unknown platform: ${platform}` });
      continue;
    }

    const platformErrors = [];

    // Character limit check
    if (charCount > rules.maxChars) {
      platformErrors.push(
        `${rules.label}: Content exceeds ${rules.maxChars} character limit (${charCount} used).`
      );
    }

    // Hashtag limit check
    if (rules.maxHashtags !== Infinity && hashCount > rules.maxHashtags) {
      platformErrors.push(
        `${rules.label}: Too many hashtags (${hashCount} used, max ${rules.maxHashtags}).`
      );
    }

    // Video restriction check
    if (hasVideo && !rules.allowVideo) {
      platformErrors.push(`${rules.label}: Video uploads are not supported.`);
    }

    if (platformErrors.length > 0) {
      errors.push(...platformErrors.map((message) => ({ platform, message })));
    }

    platformStats.push({
      platform,
      characterCount: charCount,
      hashtagCount:   hashCount,
      isValid:        platformErrors.length === 0,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    platformStats,
    // Return computed counts so controller doesn't re-compute
    characterCount: charCount,
    hashtagCount: hashCount,
  };
};

module.exports = {
  validatePost,
  countHashtags,
  countCharacters,
  PLATFORM_RULES,
};
