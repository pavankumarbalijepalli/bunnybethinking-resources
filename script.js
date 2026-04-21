/* ============================================================
   @bunnybethinking Resource Hub — script.js
   ============================================================ */

/* ── Year in footer ──────────────────────────────────────── */
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Animated counter utility ─────────────────────────────── */
function animateCounter(el, target, suffix = '', duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ── Intersection Observer for stats strip ────────────────── */
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const postEl  = document.getElementById('stat-posts');
      const toolEl  = document.getElementById('stat-tools');
      const topicEl = document.getElementById('stat-topics');

      if (postEl)  animateCounter(postEl,  50, '+');
      if (toolEl)  animateCounter(toolEl,  30, '+');
      if (topicEl) animateCounter(topicEl, 10, '+');

      statsObserver.disconnect();
    });
  },
  { threshold: 0.4 }
);

const statsEl = document.querySelector('.stats-strip');
if (statsEl) statsObserver.observe(statsEl);

/* ── Staggered card reveal on scroll ──────────────────────── */
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
);

document.querySelectorAll('.link-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.04}s`;
  cardObserver.observe(card);
});

/* ── Tilt effect on cards (subtle, desktop only) ──────────── */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.link-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      card.style.transform = `translateY(-3px) scale(1.01) rotateX(${y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Featured banner shimmer on mount ─────────────────────── */
const banner = document.getElementById('featured-banner');
if (banner) {
  setTimeout(() => banner.classList.add('shimmer-ready'), 500);
}

/* ── Smooth scroll for any hash anchors ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Click ripple effect on cards ─────────────────────────── */
document.querySelectorAll('.link-card').forEach((card) => {
  card.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
      background: rgba(167, 139, 250, 0.18);
      transform: scale(0);
      animation: ripple-anim 0.55s ease-out forwards;
      pointer-events: none;
      z-index: 10;
    `;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* Inject ripple keyframe once */
if (!document.getElementById('ripple-style')) {
  const style = document.createElement('style');
  style.id = 'ripple-style';
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
