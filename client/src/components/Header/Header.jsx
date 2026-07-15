/**
 * Header.jsx — Top navigation bar for SocialHub AI
 *
 * Contains:
 *   - Logo + brand name
 *   - Navigation links (stubs for future pages)
 *   - Responsive hamburger menu
 *
 * Future experiments will add:
 *   - User avatar / profile dropdown
 *   - Notification bell
 *   - Theme toggle
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

// ─── Nav Items (extend as new pages are added in future experiments) ──────────
const NAV_ITEMS = [
  { to: '/', label: 'Composer', icon: '✏️' },
  { to: '/schedule', label: 'Scheduler', icon: '📅' },
  // Future: { to: '/analytics', label: 'Analytics', icon: '📊' },
  // Future: { to: '/team', label: 'Team', icon: '👥' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        {/* ── Brand ────────────────────────────────────────────────────── */}
        <NavLink to="/" className="header__brand" aria-label="SocialHub AI home">
          <div className="header__logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
              <path
                d="M8 16C8 11.582 11.582 8 16 8s8 3.582 8 8-3.582 8-8 8"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="3" fill="#fff" />
              <circle cx="9" cy="21" r="2" fill="rgba(255,255,255,0.7)" />
              <circle cx="23" cy="11" r="2" fill="rgba(255,255,255,0.7)" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#4f8ef7" />
                  <stop offset="100%" stopColor="#a259ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header__brand-text">
            <span className="header__brand-name">SocialHub AI</span>
            <span className="header__brand-tagline">Create Once. Publish Everywhere.</span>
          </div>
        </NavLink>

        {/* ── Desktop Nav ──────────────────────────────────────────────── */}
        <nav className="header__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right Actions ─────────────────────────────────────────────── */}
        <div className="header__actions">
          {/* Future: User avatar, theme toggle, notifications */}
          <div className="header__version-badge">v1.0</div>

          {/* Hamburger (mobile) */}
          <button
            id="menu-toggle"
            className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ── Mobile Nav ─────────────────────────────────────────────────── */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="header__mobile-nav"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
