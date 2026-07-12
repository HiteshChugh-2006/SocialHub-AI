/**
 * AppContext.jsx — Global application context for SocialHub AI
 *
 * Currently provides:
 *   - Toast notification system
 *
 * Future experiments will extend this with:
 *   - Authentication state (currentUser, isAuthenticated, login, logout)
 *   - Theme preference (dark/light mode toggle)
 *   - Notification centre
 *   - Team/workspace context
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { TOAST_DURATION } from '../utils/constants';

// ─── Context Creation ─────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  // ── Toast State ────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  /**
   * Add a toast notification.
   * @param {string} message
   * @param {'success'|'error'|'info'|'warning'} type
   */
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  /**
   * Manually dismiss a toast by id.
   * @param {number} id
   */
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Context Value ──────────────────────────────────────────────────────────
  const value = {
    // Toast system
    toasts,
    addToast,
    dismissToast,

    // Future experiment stubs (keeps the API surface stable):
    // currentUser: null,
    // isAuthenticated: false,
    // login: async () => {},
    // logout: () => {},
    // theme: 'dark',
    // toggleTheme: () => {},
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
