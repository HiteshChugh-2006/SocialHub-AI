/**
 * ComposerPage.jsx — Main post composer page (Experiment 1.1.1)
 *
 * Two-column layout on desktop:
 *   Left:  Post textarea, platform selection, action buttons
 *   Right: Character counter, hashtag counter, media upload, validation panel
 *
 * Collapses to single-column on mobile.
 * All state is managed by the useComposer hook.
 */

import useComposer from '../../hooks/useComposer';
import PlatformCard from '../../components/PlatformCard/PlatformCard';
import CharacterCounter from '../../components/CharacterCounter/CharacterCounter';
import HashtagCounter from '../../components/HashtagCounter/HashtagCounter';
import MediaUpload from '../../components/MediaUpload/MediaUpload';
import ValidationPanel from '../../components/ValidationPanel/ValidationPanel';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';
import { PLATFORMS } from '../../utils/constants';
import './ComposerPage.css';

const ComposerPage = () => {
  const {
    content,
    selectedPlatforms,
    scheduledDate,
    image,
    video,
    isSubmitting,
    charCount,
    hashtagCount,
    validationResults,
    canPublish,
    textareaRef,
    handleContentChange,
    setScheduledDate,
    togglePlatform,
    handleImageUpload,
    handleVideoUpload,
    removeImage,
    removeVideo,
    handleClear,
    handleCopy,
    handleSubmit,
  } = useComposer();

  return (
    <main className="composer-page" id="main-content">
      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="composer-page__header">
        <div className="composer-page__header-text">
          <p className="composer-page__eyebrow">Experiment 1.1.1</p>
          <h1 className="composer-page__title">Post Composer</h1>
          <p className="composer-page__subtitle">
            Craft your message once — validate against every platform in real time and publish everywhere simultaneously.
          </p>
          <div className="composer-page__stats">
            <div className="stat-pill">
              <span className="stat-pill__dot" />
              <span>4 Platforms</span>
            </div>
            <div className="stat-pill">
              <span>✦</span>
              <span>Live Validation</span>
            </div>
            <div className="stat-pill">
              <span>⚡</span>
              <span>{charCount > 0 ? `${charCount} chars` : 'Start typing'}</span>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ──────────────────────────────────────────── */}
        <div className="composer-page__header-actions">
          <button
            id="copy-btn"
            type="button"
            className="btn btn-ghost"
            onClick={handleCopy}
            aria-label="Copy post text to clipboard"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="15" height="15">
              <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Copy
          </button>
          <button
            id="clear-btn"
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            aria-label="Clear all fields"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="15" height="15">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Clear
          </button>
          <button
            id="publish-btn"
            type="button"
            className="btn btn-primary composer-page__publish-btn"
            onClick={handleSubmit}
            disabled={!canPublish || isSubmitting}
            aria-label={canPublish ? 'Publish post to selected platforms' : 'Fix validation errors to publish'}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Publishing…
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="15" height="15">
                  <path d="M2 8l5 5 7-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Publish Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Two-column Layout ───────────────────────────────────────────── */}
      <div className="composer-page__layout">

        {/* ════ LEFT COLUMN ════════════════════════════════════════════ */}
        <div className="composer-page__left">

          {/* ── Post Composer Card ──────────────────────────────────── */}
          <section className="card composer-card" aria-label="Post composer">
            <div className="composer-card__header">
              <h2 className="composer-card__title">
                <span className="composer-card__title-icon" aria-hidden="true">✏️</span>
                Write Your Post
              </h2>
              <div className="composer-card__meta">
                <CharacterCounter
                  charCount={charCount}
                  selectedPlatforms={selectedPlatforms}
                />
                <span className="composer-card__divider" aria-hidden="true">·</span>
                <HashtagCounter hashtagCount={hashtagCount} />
              </div>
            </div>

            <textarea
              id="post-content"
              ref={textareaRef}
              className="composer-card__textarea"
              value={content}
              onChange={handleContentChange}
              placeholder="What's on your mind today?"
              rows={5}
              aria-label="Post content"
              aria-describedby="char-count-hint"
            />
            <p id="char-count-hint" className="sr-only">
              Current character count: {charCount}. Select platforms to see their limits.
            </p>
          </section>

          {/* ── Platform Selection ──────────────────────────────────── */}
          <section className="card platform-section" aria-label="Platform selection">
            <div className="platform-section__header">
              <h2 className="platform-section__title">
                <span aria-hidden="true">🌐</span>
                Select Platforms
              </h2>
              {selectedPlatforms.length > 0 && (
                <span className="platform-section__badge">
                  {selectedPlatforms.length} selected
                </span>
              )}
            </div>
            <div
              className="platform-section__grid"
              role="group"
              aria-label="Platform selection grid"
            >
              {PLATFORMS.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  isSelected={selectedPlatforms.includes(platform.id)}
                  onToggle={togglePlatform}
                />
              ))}
            </div>
          </section>

          {/* ── Schedule Post ───────────────────────────────────────── */}
          <section className="card platform-section" aria-label="Schedule post">
            <div className="platform-section__header">
              <h2 className="platform-section__title">
                <span aria-hidden="true">📅</span>
                Schedule Post
              </h2>
            </div>
            <div style={{ marginTop: 'var(--space-3)' }}>
              <DateTimePicker 
                value={scheduledDate}
                onChange={(newDate) => setScheduledDate(newDate)}
              />
              <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Leave blank to publish immediately. Draft is auto-saved locally.
              </p>
            </div>
          </section>

          {/* ── Mobile: Action buttons (duplicated for mobile UX) ──── */}
          <div className="composer-page__mobile-actions">
            <button id="copy-btn-mobile" type="button" className="btn btn-ghost" onClick={handleCopy}>
              Copy
            </button>
            <button id="clear-btn-mobile" type="button" className="btn btn-secondary" onClick={handleClear}>
              Clear All
            </button>
            <button
              id="publish-btn-mobile"
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!canPublish || isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Publishing…' : 'Publish Now'}
            </button>
          </div>
        </div>

        {/* ════ RIGHT COLUMN ════════════════════════════════════════════ */}
        <div className="composer-page__right">

          {/* ── Media Upload ─────────────────────────────────────────── */}
          <section className="card right-section" aria-label="Media upload">
            <h2 className="right-section__title">
              <span aria-hidden="true">🖼️</span>
              Media
            </h2>
            <MediaUpload
              image={image}
              video={video}
              onImageUpload={handleImageUpload}
              onVideoUpload={handleVideoUpload}
              onRemoveImage={removeImage}
              onRemoveVideo={removeVideo}
            />
          </section>

          {/* ── Validation Panel ─────────────────────────────────────── */}
          <section className="card right-section" aria-label="Platform validation">
            <h2 className="right-section__title">
              <span aria-hidden="true">✅</span>
              Platform Validation
            </h2>

            {selectedPlatforms.length > 0 && (
              <div className="composer-page__validation-summary">
                {Object.values(validationResults).every((r) => r.valid) ? (
                  <div className="validation-summary validation-summary--all-good">
                    All platforms ready to publish
                  </div>
                ) : (
                  <div className="validation-summary validation-summary--issues">
                    Fix errors before publishing
                  </div>
                )}
              </div>
            )}

            <ValidationPanel validationResults={validationResults} />
          </section>

        </div>
      </div>
    </main>
  );
};

export default ComposerPage;
