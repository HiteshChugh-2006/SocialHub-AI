/**
 * main.jsx — React application entry point for SocialHub AI
 *
 * Mounts the React app into the #root DOM element.
 * StrictMode is enabled to surface potential issues during development.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
