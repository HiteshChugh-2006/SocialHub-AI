/**
 * client/src/components/PostComposer/PostComposer.jsx
 * ─────────────────────────────────────────────────────────────────
 * Orchestrator component for Experiment 1.1.1.
 * Manages state for: selected platforms, content, media files,
 * validation errors, loading, and success feedback.
 *
 * Future experiments:
 *   - Add AI content generation panel (Exp: AI generation).
 *   - Add schedule picker (Exp: Scheduling).
 *   - Connect to user context for userId (Exp: Authentication).
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useMemo, useCallback } from 'react';
import styles from './PostComposer.module.css';

import PlatformSelector from './PlatformSelector';
import TextEditor       from './TextEditor';
import MediaUpload      from './MediaUpload';
import ValidationPanel  from './ValidationPanel';

import { validatePost }  from '../../utils/validators';
import { PLATFORM_RULES } from '../../utils/platformRules';
import { createPost }    from '../../services/api';

// Hex → rgb for CSS custom property
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

// ── Initial state ────────────────────────────────────────────────
const INITIAL_STATE = {
  content:           '',
  selectedPlatforms: [],
  mediaFiles:        [],
  isLoading:         false,
  successMessage:    '',
};

const PostComposer = () => {
  const [content,           setContent]           = useState(INITIAL_STATE.content);
  const [selectedPlatforms, setSelectedPlatforms] = useState(INITIAL_STATE.selectedPlatforms);
  const [mediaFiles,        setMediaFiles]        = useState(INITIAL_STATE.mediaFiles);
  const [isLoading,         setIsLoading]         = useState(INITIAL_STATE.isLoading);
  const [successMessage,    setSuccessMessage]    = useState(INITIAL_STATE.successMessage);

  // ── Live validation (memoised) ───────────────────────────────
  const validation = useMemo(
    () => validatePost(content, selectedPlatforms, mediaFiles),
    [content, selectedPlatforms, mediaFiles]
  );

  // ── Platform toggle ──────────────────────────────────────────
  const handlePlatformToggle = useCallback((platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
    setSuccessMessage('');
  }, []);

  // ── Publish ──────────────────────────────────────────────────
  const handlePublish = async () => {
    if (!validation.valid || isLoading) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      await createPost({ content, platforms: selectedPlatforms, mediaFiles });
      setSuccessMessage('Post published successfully! 🎉');

      // Reset composer after a short delay so user can see the message
      setTimeout(() => {
        setContent('');
        setMediaFiles([]);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      // Surface server-side errors in the validation panel
      if (apiErrors) {
        // Map array of {platform, message} to Record<platform, string[]>
        const mapped = {};
        for (const { platform, message } of apiErrors) {
          const key = platform || 'all';
          mapped[key] = [...(mapped[key] || []), message];
        }
        // We can't update validation state directly (it's derived),
        // so display as a toast instead (server errors are rare after client validation)
        setSuccessMessage('');
        console.error('Server validation errors:', mapped);
      } else {
        setSuccessMessage('');
        alert('Failed to publish post. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Clear ────────────────────────────────────────────────────
  const handleClear = () => {
    setContent('');
    setMediaFiles([]);
    setSelectedPlatforms([]);
    setSuccessMessage('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* ── Card header ─────────────────────────────────────── */}
        <div className={styles.cardHeader}>
          <div>
            <h1 className={styles.cardTitle}>New Post</h1>
            <p className={styles.cardSubtitle}>
              Compose and publish to multiple platforms at once
            </p>
          </div>

          {/* Selected platform tags */}
          {selectedPlatforms.length > 0 && (
            <div className={styles.platformSummary} aria-label="Selected platforms">
              {selectedPlatforms.map((p) => {
                const rule = PLATFORM_RULES[p];
                return (
                  <span
                    key={p}
                    className={styles.platformTag}
                    style={{
                      '--platform-color':     rule.accentColor,
                      '--platform-color-rgb': hexToRgb(rule.accentColor),
                    }}
                  >
                    {rule.icon} {rule.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Card body ───────────────────────────────────────── */}
        <div className={styles.cardBody}>
          {/* 1. Platform selection */}
          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onToggle={handlePlatformToggle}
          />

          <div className={styles.divider} aria-hidden="true" />

          {/* 2. Content textarea */}
          <TextEditor
            content={content}
            onChange={setContent}
            selectedPlatforms={selectedPlatforms}
          />

          {/* 3. Media upload */}
          <MediaUpload
            mediaFiles={mediaFiles}
            onFilesChange={setMediaFiles}
            selectedPlatforms={selectedPlatforms}
          />

          <div className={styles.divider} aria-hidden="true" />

          {/* 4. Validation + publish */}
          <ValidationPanel
            errors={validation.errors}
            isValid={validation.valid}
            isLoading={isLoading}
            onPublish={handlePublish}
            onClear={handleClear}
            successMessage={successMessage}
          />

          {/* Future: AI generation panel  – Exp: AI generation  */}
          {/* Future: Schedule picker      – Exp: Scheduling     */}
        </div>
      </div>
    </div>
  );
};

export default PostComposer;
