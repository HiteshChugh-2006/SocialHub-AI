/**
 * BackgroundCanvas.jsx — Animated 3D visual background for SocialHub AI
 *
 * Renders three layered effects via canvas + CSS:
 *   1. Particle network (interconnected floating nodes)
 *   2. Aurora orbs (large animated gradient blobs)
 *   3. Perspective grid floor (3D CSS transform)
 */

import { useEffect, useRef } from 'react';
import './BackgroundCanvas.css';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── Resize handler ─────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Particle system ────────────────────────────────────────────────────
    const PARTICLE_COUNT = 150;
    const CONNECTION_DIST = 160;

    const palette = [
      'rgba(16,185,129,',    // green
      'rgba(162,89,255,',    // purple
      'rgba(34,211,238,',    // cyan
    ];

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x  = Math.random() * canvas.width;
        this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = -(Math.random() * 0.4 + 0.15);
        this.r  = Math.random() * 2.5 + 1;
        this.alpha = Math.random() * 0.7 + 0.3;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.04;
        this.alpha = (Math.sin(this.pulse) * 0.3 + 0.5);
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
        // Add a slight glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.8)';
      }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    // ── Animation loop ─────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      particles.forEach(p => p.update());
      particles.forEach(p => p.draw());

      // Reset shadow for lines
      ctx.shadowBlur = 0;

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(16,185,129,${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="bg-scene" aria-hidden="true">
      {/* ── Layer 1: Canvas particle network ──────────────────────────── */}
      <canvas ref={canvasRef} className="bg-scene__canvas" />

      {/* ── Layer 2: Aurora orbs ──────────────────────────────────────── */}
      <div className="bg-scene__orbs">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
        <div className="bg-orb bg-orb--4" />
        <div className="bg-orb bg-orb--5" />
      </div>

      {/* ── Layer 3: 3D perspective grid ──────────────────────────────── */}
      <div className="bg-scene__grid-wrap">
        <div className="bg-scene__grid" />
      </div>

      {/* ── Layer 4: Scan line / noise overlay ───────────────────────── */}
      <div className="bg-scene__noise" />
      <div className="bg-scene__vignette" />
    </div>
  );
};

export default BackgroundCanvas;
