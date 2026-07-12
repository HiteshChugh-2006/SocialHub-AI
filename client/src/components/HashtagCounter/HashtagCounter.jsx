/**
 * HashtagCounter.jsx — Displays the real-time hashtag count
 */

import './HashtagCounter.css';

/**
 * @param {number}   hashtagCount       - Number of hashtags detected in content
 * @param {string[]} selectedPlatforms  - IDs of selected platforms (for future per-platform display)
 */
const HashtagCounter = ({ hashtagCount }) => {
  return (
    <div className="hashtag-counter" aria-live="polite" aria-atomic="true">
      <span className="hashtag-counter__icon" aria-hidden="true">#</span>
      <span className="hashtag-counter__label">Hashtags:</span>
      <span className={`hashtag-counter__count ${hashtagCount > 0 ? 'hashtag-counter__count--active' : ''}`}>
        {hashtagCount}
      </span>
    </div>
  );
};

export default HashtagCounter;
