/**
 * PlatformCard.jsx — Selectable card for a single social media platform
 *
 * Shows platform icon, name, character limit, media support, and hashtag rules.
 * Highlights when selected.
 */

import './PlatformCard.css';

/**
 * @param {object}   platform       - Platform definition from PLATFORMS constant
 * @param {boolean}  isSelected     - Whether this platform is currently selected
 * @param {Function} onToggle       - Callback to toggle selection
 */
const PlatformCard = ({ platform, isSelected, onToggle }) => {
  const { id, name, icon, color, colorDim, charLimit, supportsImages, supportsVideos, maxHashtags, hashtagNote, mediaNote } = platform;

  return (
    <button
      id={`platform-card-${id}`}
      className={`platform-card ${isSelected ? 'platform-card--selected' : ''}`}
      onClick={() => onToggle(id)}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${name}`}
      style={{
        '--platform-color': color,
        '--platform-color-dim': colorDim,
      }}
    >
      {/* ── Selected indicator ─────────────────────────────────────────── */}
      <div className="platform-card__check" aria-hidden="true">
        {isSelected && (
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* ── Platform icon ──────────────────────────────────────────────── */}
      <div
        className="platform-card__icon"
        dangerouslySetInnerHTML={{ __html: icon }}
        aria-hidden="true"
      />

      {/* ── Platform name ──────────────────────────────────────────────── */}
      <div className="platform-card__name">{name}</div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="platform-card__stats">
        <div className="platform-card__stat">
          <span className="platform-card__stat-label">Limit</span>
          <span className="platform-card__stat-value">
            {charLimit.toLocaleString()}
          </span>
        </div>
        <div className="platform-card__stat">
          <span className="platform-card__stat-label">Media</span>
          <span className="platform-card__stat-value platform-card__stat-value--small">
            {mediaNote}
          </span>
        </div>
        <div className="platform-card__stat">
          <span className="platform-card__stat-label">Tags</span>
          <span className="platform-card__stat-value platform-card__stat-value--small">
            {hashtagNote}
          </span>
        </div>
      </div>
    </button>
  );
};

export default PlatformCard;
