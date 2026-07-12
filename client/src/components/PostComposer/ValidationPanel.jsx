/**
 * client/src/components/PostComposer/ValidationPanel.jsx
 * Displays per-platform validation errors and the Publish button.
 */

import styles from './ValidationPanel.module.css';
import { PLATFORM_RULES } from '../../utils/platformRules';

// Hex → name map for aria labels
const PLATFORM_NAME = Object.fromEntries(
  Object.entries(PLATFORM_RULES).map(([id, r]) => [id, r.label])
);

const ValidationPanel = ({
  errors,        // Record<platformId|'all', string[]>
  isValid,
  isLoading,
  onPublish,
  onClear,
  successMessage,
}) => {
  const errorEntries = Object.entries(errors); // [[platformId, [msg, ...]], ...]

  return (
    <div className={styles.container}>
      {/* Success toast */}
      {successMessage && (
        <div className={styles.successToast} role="status" aria-live="polite">
          🎉 {successMessage}
        </div>
      )}

      {/* Validation messages */}
      {errorEntries.length > 0 ? (
        <div
          className={styles.errorList}
          role="alert"
          aria-live="polite"
          aria-label="Validation errors"
        >
          {errorEntries.map(([platformId, msgs]) => {
            const rule  = PLATFORM_RULES[platformId];
            const color = rule?.accentColor ?? '#F87171';
            const name  = PLATFORM_NAME[platformId] ?? platformId;

            return (
              <div key={platformId} className={styles.platformGroup}>
                <div className={styles.platformGroupHeader}>
                  <span
                    className={styles.platformDot}
                    style={{ '--platform-color': color }}
                    aria-hidden="true"
                  />
                  {name} — {msgs.length} issue{msgs.length > 1 ? 's' : ''}
                </div>
                <ul className={styles.errorItems}>
                  {msgs.map((msg, i) => (
                    <li key={i} className={styles.errorItem}>
                      <span className={styles.errorIcon} aria-hidden="true">⚠️</span>
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        isValid && (
          <div className={styles.allGood} role="status">
            <span className={styles.allGoodIcon} aria-hidden="true">✅</span>
            Content passes all platform rules — ready to publish!
          </div>
        )
      )}

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          id="publish-btn"
          type="button"
          className={`${styles.publishBtn} ${isLoading ? styles.loading : ''}`}
          disabled={!isValid || isLoading}
          onClick={onPublish}
          aria-disabled={!isValid || isLoading}
          aria-label={isValid ? 'Publish post' : 'Publish button disabled — fix validation errors first'}
        >
          {isLoading && <span className={styles.spinner} aria-hidden="true" />}
          {isLoading ? 'Publishing…' : '🚀 Publish'}
        </button>

        <button
          id="clear-btn"
          type="button"
          className={styles.clearBtn}
          onClick={onClear}
          aria-label="Clear and reset composer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ValidationPanel;
