/* ============================================================
   animations.js — Shared scroll-reveal & interactive animations
   Include on every public page AFTER styles.css loads
   ============================================================ */

(function(){
  'use strict';

  /* ---- Page progress bar ---- */
  const bar = document.createElement('div');
  bar.id = 'pageProgress';
  document.body.prepend(bar);
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---- Scroll-reveal Intersection Observer ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function bindReveal() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => io.observe(el));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindReveal);
  } else {
    bindReveal();
  }
  window.rebindReveal = bindReveal;

  /* ---- Button ripple effect ---- */
  function addRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const rip = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    rip.style.cssText = `
      position:absolute;border-radius:50%;pointer-events:none;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,0.18);
      transform:scale(0);animation:rippleAnim .5s ease-out forwards;
    `;
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
  }

  /* Add ripple CSS once */
  if (!document.getElementById('rippleStyle')) {
    const s = document.createElement('style');
    s.id = 'rippleStyle';
    s.textContent = '@keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}';
    document.head.appendChild(s);
  }

  function bindRipples() {
    document.querySelectorAll('.btn, .btn-gold, .btn-ghost, .btn-green').forEach(btn => {
      if (!btn.dataset.ripple) {
        btn.dataset.ripple = '1';
        btn.addEventListener('click', addRipple);
      }
    });
  }

  /* ---- Floating particle canvas ---- */
  function initParticles() {
    const isMobile = window.innerWidth < 768;
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.3;will-change:auto';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });
    let W, H, raf;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    }, { passive: true });

    /* Fewer particles on mobile for performance */
    const COUNT = isMobile ? 14 : 26;
    function mkParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.4,
        dx: (Math.random() - 0.5) * 0.28,
        dy: (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.35 + 0.08,
        color: Math.random() > 0.5 ? '212,175,55' : '31,203,107',
      };
    }
    let particles = Array.from({ length: COUNT }, mkParticle);

    /* Pause when tab is hidden (saves CPU) */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        draw();
      }
    });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
  }

  if (!document.body.classList.contains('no-particles')) {
    initParticles();
  }

  /* ---- Number counter animation ---- */
  window.animateCount = function(el, target, duration, prefix, suffix) {
    duration = duration || 1400; prefix = prefix || ''; suffix = suffix || '';
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
      el.textContent = prefix + val + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  /* ---- Count animation on scroll ---- */
  function bindCounters() {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const raw = el.dataset.count;
          if (raw) {
            animateCount(el, parseFloat(raw), 1600, el.dataset.prefix || '', el.dataset.suffix || '');
          }
          so.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => so.observe(el));
  }

  /* ---- Card tilt effect ---- */
  function bindTilts() {
    document.querySelectorAll('.card-tilt').forEach(card => {
      if (card.dataset.tilt) return;
      card.dataset.tilt = '1';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .4s ease';
        card.style.transform = '';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform .1s ease';
      });
    });
  }

  /* ---- Init all on DOM ready ---- */
  function onReady() {
    bindCounters();
    bindTilts();
    bindRipples();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  /* ---- Re-bind after SPA-style dynamic renders ---- */
  const _rebind = window.rebindReveal;
  window.rebindReveal = function() {
    _rebind();
    bindRipples();
    bindTilts();
  };

})();
