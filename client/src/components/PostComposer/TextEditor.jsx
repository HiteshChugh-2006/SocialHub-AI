/**
 * client/src/components/PostComposer/TextEditor.jsx
 * Live-updating textarea with character + hashtag counters.
 */

import styles from './TextEditor.module.css';
import { PLATFORM_RULES } from '../../utils/platformRules';
import { countCharacters, countHashtags } from '../../utils/validators';

// Hex → rgb for CSS custom property
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const TextEditor = ({ content, onChange, selectedPlatforms }) => {
  const charCount = countCharacters(content);
  const hashCount = countHashtags(content);

  // Determine worst-case status across selected platforms
  const getCharStatus = () => {
    if (!selectedPlatforms.length) return 'ok';
    const limits = selectedPlatforms.map((p) => PLATFORM_RULES[p]?.maxChars ?? Infinity);
    const strictest = Math.min(...limits);
    if (charCount > strictest) return 'over';
    if (charCount > strictest * 0.85) return 'nearLimit';
    return 'ok';
  };

  const charStatus = getCharStatus();
  const wrapClass  = [
    styles.textareaWrap,
    charStatus === 'over'      ? styles.over      : '',
    charStatus === 'nearLimit' ? styles.nearLimit  : '',
  ].join(' ').trim();

  return (
    <div className={styles.container}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Compose Post</span>
      </div>

      <div className={wrapClass}>
        <textarea
          id="post-content"
          className={styles.textarea}
          placeholder="What do you want to share today? ✨"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Post content"
          aria-describedby="char-counter hashtag-counter"
          spellCheck
        />

        <div className={styles.statsBar} aria-live="polite" aria-atomic="false">
          {/* Aggregate counters */}
          <div className={styles.counterGroup}>
            <div className={styles.counter} id="char-counter">
              <span className={styles.counterIcon} aria-hidden="true">✍️</span>
              <span
                className={`${styles.counterValue} ${styles[charStatus]}`}
                aria-label={`${charCount} characters`}
              >
                {charCount.toLocaleString()}
              </span>
              <span>chars</span>
            </div>

            <div className={styles.counter} id="hashtag-counter">
              <span className={styles.counterIcon} aria-hidden="true">#</span>
              <span
                className={styles.counterValue}
                style={{ color: 'var(--color-info)' }}
                aria-label={`${hashCount} hashtags`}
              >
                {hashCount}
              </span>
              <span>tags</span>
            </div>
          </div>

          {/* Per-platform char budget pills */}
          {selectedPlatforms.length > 0 && (
            <div className={styles.platformCounters} aria-label="Character limits per platform">
              {selectedPlatforms.map((platformId) => {
                const rules   = PLATFORM_RULES[platformId];
                const limit   = rules.maxChars;
                const isOver  = charCount > limit;
                const color   = rules.accentColor;
                const colorRgb = hexToRgb(color);
                const display  = limit >= 10000
                  ? `${(limit / 1000).toFixed(0)}k`
                  : limit;

                return (
                  <span
                    key={platformId}
                    className={`${styles.platformPill} ${isOver ? styles.over : ''}`}
                    style={{
                      '--platform-color':     color,
                      '--platform-color-rgb': colorRgb,
                    }}
                    aria-label={`${rules.label}: ${charCount} of ${limit} characters`}
                  >
                    {rules.icon} {charCount}/{display}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
