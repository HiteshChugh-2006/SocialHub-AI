/**
 * client/src/pages/Home.jsx
 * ─────────────────────────────────────────────────────────────────
 * Landing page for Experiment 1.1.1.
 *
 * Future experiments:
 *   - Add <StatsRow> with quick analytics cards    – Exp: Analytics
 *   - Add <PostFeed> of recent posts               – Exp: Feed view
 *   - Add <NotificationBanner>                     – Exp: Notifications
 * ─────────────────────────────────────────────────────────────────
 */

import styles from './Home.module.css';
import PostComposer from '../components/PostComposer/PostComposer';
import { PLATFORM_RULES, PLATFORM_ORDER } from '../utils/platformRules';

// Hex → rgb for CSS variable
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const Home = () => {
  return (
    <main className={styles.page} id="main-content">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroBadge} aria-label="Current experiment">
          ✦ Experiment 1.1.1
        </div>

        <h1 id="hero-heading" className={styles.heroTitle}>
          Manage all your{' '}
          <span className={styles.heroGradient}>social platforms</span>{' '}
          from one place
        </h1>

        <p className={styles.heroSub}>
          Compose once, publish everywhere. SocialHub AI handles character
          limits, hashtag rules, and media restrictions for every platform — automatically.
        </p>

        {/* Platform strip */}
        <div className={styles.platformStrip} aria-label="Supported platforms">
          {PLATFORM_ORDER.map((id) => {
            const p = PLATFORM_RULES[id];
            return (
              <span
                key={id}
                className={styles.stripBadge}
                style={{
                  '--platform-color':     p.accentColor,
                  '--platform-color-rgb': hexToRgb(p.accentColor),
                }}
              >
                <span aria-hidden="true">{p.icon}</span>
                {p.label}
              </span>
            );
          })}
        </div>
      </section>

      {/* ── Post Composer ─────────────────────────────────────── */}
      <section className={styles.composerSection} aria-label="Post composer">
        <PostComposer />
      </section>

      {/* Future: <StatsRow />     – Exp: Analytics     */}
      {/* Future: <PostFeed />     – Exp: Feed view     */}
    </main>
  );
};

export default Home;
