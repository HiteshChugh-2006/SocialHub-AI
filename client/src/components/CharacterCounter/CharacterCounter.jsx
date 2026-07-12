/**
 * CharacterCounter.jsx — Live character count display
 *
 * Shows current character count vs the lowest limit among selected platforms.
 * Changes colour at 90% (warning) and when exceeded (danger).
 */

import { useMemo } from 'react';
import { PLATFORMS } from '../../utils/constants';
import { getCounterStatus } from '../../utils/validators';
import './CharacterCounter.css';

/**
 * @param {number}   charCount          - Current character count
 * @param {string[]} selectedPlatforms  - Array of selected platform IDs
 */
const CharacterCounter = ({ charCount, selectedPlatforms }) => {
  // Find the most restrictive limit among selected platforms
  const activeLimit = useMemo(() => {
    if (selectedPlatforms.length === 0) return null;
    return Math.min(
      ...selectedPlatforms.map((id) => {
        const p = PLATFORMS.find((p) => p.id === id);
        return p ? p.charLimit : Infinity;
      })
    );
  }, [selectedPlatforms]);

  const status = activeLimit ? getCounterStatus(charCount, activeLimit) : 'normal';
  const percentage = activeLimit ? Math.min((charCount / activeLimit) * 100, 100) : 0;

  return (
    <div className={`char-counter char-counter--${status}`} aria-live="polite" aria-atomic="true">
      {/* ── Count display ──────────────────────────────────────────────── */}
      <div className="char-counter__display">
        <span className="char-counter__current">{charCount.toLocaleString()}</span>
        {activeLimit && (
          <>
            <span className="char-counter__separator">/</span>
            <span className="char-counter__limit">{activeLimit.toLocaleString()}</span>
          </>
        )}
      </div>

      {/* ── Progress arc ──────────────────────────────────────────────── */}
      {activeLimit && (
        <div className="char-counter__arc" aria-hidden="true">
          <svg viewBox="0 0 36 36" className="char-counter__circle-svg">
            <circle className="char-counter__circle-bg" cx="18" cy="18" r="15.9" />
            <circle
              className="char-counter__circle-fill"
              cx="18"
              cy="18"
              r="15.9"
              strokeDasharray={`${percentage} 100`}
            />
          </svg>
        </div>
      )}

      {/* ── Exceeded label ─────────────────────────────────────────────── */}
      {status === 'danger' && (
        <span className="char-counter__label">
          {activeLimit ? `−${(charCount - activeLimit).toLocaleString()} over limit` : 'Over limit'}
        </span>
      )}
    </div>
  );
};

export default CharacterCounter;
