/**
 * client/src/components/PostComposer/PlatformSelector.jsx
 * Multi-platform toggle buttons.
 */

import styles from './PlatformSelector.module.css';
import { PLATFORM_RULES, PLATFORM_ORDER } from '../../utils/platformRules';

// Hex → rgb components for CSS custom property (used in box-shadow rgba)
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const PlatformSelector = ({ selectedPlatforms, onToggle }) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Publish to</span>
      <div className={styles.grid} role="group" aria-label="Select platforms">
        {PLATFORM_ORDER.map((platformId) => {
          const platform   = PLATFORM_RULES[platformId];
          const isSelected = selectedPlatforms.includes(platformId);
          const color      = platform.accentColor;
          const colorRgb   = hexToRgb(color);

          return (
            <button
              key={platformId}
              type="button"
              id={`platform-btn-${platformId}`}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} ${platform.label}`}
              onClick={() => onToggle(platformId)}
              className={`${styles.platformBtn} ${isSelected ? styles.selected : ''}`}
              style={{
                '--platform-color':     color,
                '--platform-color-rgb': colorRgb,
              }}
            >
              {isSelected && (
                <span className={styles.checkmark} aria-hidden="true">✓</span>
              )}
              <div className={styles.iconWrap} aria-hidden="true">
                {platform.icon}
              </div>
              <span className={styles.platformName}>{platform.label}</span>
              <span className={styles.ruleDesc}>{platform.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSelector;
