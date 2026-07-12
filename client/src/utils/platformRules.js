/**
 * client/src/utils/platformRules.js
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for all platform-specific rules on
 * the client side. Mirrors server/utils/validation.js PLATFORM_RULES.
 *
 * Future experiments:
 *   - Add 'requiresAuth' flag per platform – Exp: Platform OAuth.
 *   - Add 'supportsPoll' / 'supportsAltText' – Exp: Rich media.
 *   - Fetch rules dynamically from /api/config – Exp: Admin panel.
 * ─────────────────────────────────────────────────────────────────
 */

export const PLATFORM_RULES = {
  twitter: {
    id:           'twitter',
    label:        'Twitter / X',
    icon:         '𝕏',
    maxChars:     280,
    maxHashtags:  Infinity,
    allowVideo:   true,
    allowImage:   true,
    color:        '#000000',
    accentColor:  '#1DA1F2',
    description:  'Max 280 characters · Unlimited hashtags',
  },
  facebook: {
    id:           'facebook',
    label:        'Facebook',
    icon:         'f',
    maxChars:     63206,
    maxHashtags:  Infinity,
    allowVideo:   true,
    allowImage:   true,
    color:        '#1877F2',
    accentColor:  '#1877F2',
    description:  'Max 63,206 characters · Unlimited hashtags',
  },
  instagram: {
    id:           'instagram',
    label:        'Instagram',
    icon:         '◎',
    maxChars:     2200,
    maxHashtags:  30,
    allowVideo:   true,
    allowImage:   true,
    color:        '#E1306C',
    accentColor:  '#E1306C',
    description:  'Max 2,200 characters · Max 30 hashtags',
  },
  linkedin: {
    id:           'linkedin',
    label:        'LinkedIn',
    icon:         'in',
    maxChars:     3000,
    maxHashtags:  5,
    allowVideo:   false,
    allowImage:   true,
    color:        '#0A66C2',
    accentColor:  '#0A66C2',
    description:  'Max 3,000 characters · Max 5 hashtags · No videos',
  },
};

/** Ordered list of platform IDs for consistent display order. */
export const PLATFORM_ORDER = ['twitter', 'facebook', 'instagram', 'linkedin'];

/**
 * Get the strictest character limit across a set of selected platforms.
 * Useful for showing a combined counter.
 * @param {string[]} selectedPlatforms
 * @returns {number}
 */
export const getStrictestCharLimit = (selectedPlatforms) => {
  if (!selectedPlatforms.length) return Infinity;
  return Math.min(
    ...selectedPlatforms.map((p) => PLATFORM_RULES[p]?.maxChars ?? Infinity)
  );
};
