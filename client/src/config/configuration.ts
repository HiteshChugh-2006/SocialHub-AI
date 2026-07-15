/**
 * configuration.ts
 * 
 * Key-value mapping for global application configuration.
 * Using TypeScript allows for strong typing of configuration keys.
 */

// Storage keys for local storage mapping
export const STORAGE_KEYS = {
    DRAFT_POST: 'socialhub_draft_post',
    SCHEDULED_POSTS: 'socialhub_scheduled_posts',
    THEME_PREFERENCE: 'socialhub_theme',
    USER_SETTINGS: 'socialhub_user_settings'
} as const;

// Application wide configuration
export const APP_CONFIG = {
    APP_NAME: 'SocialHub AI',
    VERSION: '1.1.1',
    SUPPORT_EMAIL: 'support@socialhub.ai'
} as const;

// Scheduler limits & config
export const SCHEDULER_CONFIG = {
    MAX_DAYS_IN_ADVANCE: 90,
    MIN_MINUTES_IN_FUTURE: 15,
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
