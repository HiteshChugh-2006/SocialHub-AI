/**
 * App.jsx — Root application component for SocialHub AI
 *
 * Sets up:
 *   - React Router DOM routing
 *   - Global layout (Header, main content, Toast)
 *
 * Route stubs are provided for future experiment pages.
 * They render a simple "Coming Soon" placeholder until implemented.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header/Header';
import Toast from './components/Toast/Toast';
import BackgroundCanvas from './components/BackgroundCanvas/BackgroundCanvas';
import ComposerPage from './pages/ComposerPage/ComposerPage';
import './styles/global.css';

// ─── Coming Soon placeholder (used for future route stubs) ───────────────────
const ComingSoon = ({ pageName }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1rem',
      color: 'var(--color-text-secondary)',
      fontFamily: 'var(--font-family)',
    }}
  >
    <div style={{ fontSize: '3rem' }}>🚧</div>
    <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-2xl)' }}>
      {pageName}
    </h2>
    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
      Coming in a future experiment
    </p>
  </div>
);

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-layout">
          {/* ── Animated 3D background (sits at z-index 0) ────────────── */}
          <BackgroundCanvas />

          {/* ── Global Header ─────────────────────────────────────────── */}
          <Header />

          {/* ── Main Content ──────────────────────────────────────────── */}
          <div className="main-content">
            <Routes>
              {/* ── Active Routes ──────────────────────────────────── */}
              <Route path="/" element={<ComposerPage />} />

              {/* ── Future Experiment Stubs ─────────────────────────── */}
              {/* Uncomment and implement these routes in future experiments */}
              {/* <Route path="/schedule"  element={<ComingSoon pageName="Content Scheduler" />} /> */}
              {/* <Route path="/analytics" element={<ComingSoon pageName="Analytics Dashboard" />} /> */}
              {/* <Route path="/team"      element={<ComingSoon pageName="Team Collaboration" />} /> */}
              {/* <Route path="/profile"   element={<ComingSoon pageName="User Profile" />} /> */}
              {/* <Route path="/login"     element={<ComingSoon pageName="Login" />} /> */}

              {/* ── 404 Fallback ─────────────────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* ── Global Toast Notifications ────────────────────────────── */}
          <Toast />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
