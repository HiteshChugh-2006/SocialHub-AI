/**
 * ValidationPanel.jsx — Per-platform validation status display
 *
 * Shows a validation card for each selected platform with:
 *   - ✔ Ready / ⚠ Warning / ✖ Error status
 *   - Specific error/warning messages
 *   - Updates in real-time as the user types
 */

import { PLATFORM_MAP } from '../../utils/constants';
import './ValidationPanel.css';

// ─── Status icon helpers ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ready: {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Ready',
    colorClass: 'validation-item--ready',
  },
  warning: {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2L1 14h14L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: 'Near Limit',
    colorClass: 'validation-item--warning',
  },
  error: {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: 'Failed',
    colorClass: 'validation-item--error',
  },
};

/**
 * Single platform validation row.
 */
const ValidationItem = ({ platformId, result }) => {
  const platform = PLATFORM_MAP[platformId];
  if (!platform) return null;

  const config = STATUS_CONFIG[result.status];

  return (
    <div
      className={`validation-item ${config.colorClass}`}
      role="status"
      aria-label={`${platform.name}: ${config.label}`}
    >
      {/* ── Platform info ─────────────────────────────────────────────── */}
      <div className="validation-item__header">
        <div
          className="validation-item__platform-icon"
          dangerouslySetInnerHTML={{ __html: platform.icon }}
          style={{ color: platform.color }}
          aria-hidden="true"
        />
        <span className="validation-item__platform-name">{platform.name}</span>

        <div className="validation-item__status">
          <span className="validation-item__status-icon">{config.icon}</span>
          <span className="validation-item__status-label">{config.label}</span>
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────────────────── */}
      {(result.errors.length > 0 || result.warnings.length > 0) && (
        <ul className="validation-item__messages" aria-label={`Issues for ${platform.name}`}>
          {result.errors.map((msg, i) => (
            <li key={`err-${i}`} className="validation-item__message validation-item__message--error">
              {msg}
            </li>
          ))}
          {result.warnings.map((msg, i) => (
            <li key={`warn-${i}`} className="validation-item__message validation-item__message--warning">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * ValidationPanel — renders all selected platform validation items.
 *
 * @param {object} validationResults  - Map of platformId → { valid, status, errors, warnings }
 */
const ValidationPanel = ({ validationResults }) => {
  const platformIds = Object.keys(validationResults);

  if (platformIds.length === 0) {
    return (
      <div className="validation-panel validation-panel--empty">
        <div className="validation-panel__empty-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M16 10v6M16 18v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="validation-panel__empty-text">Select platforms to see validation</p>
      </div>
    );
  }

  return (
    <div className="validation-panel" role="region" aria-label="Platform validation results">
      {platformIds.map((id) => (
        <ValidationItem key={id} platformId={id} result={validationResults[id]} />
      ))}
    </div>
  );
};

export default ValidationPanel;
