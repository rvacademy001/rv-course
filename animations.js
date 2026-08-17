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
        color: Math.random() > 0.5 ? '255,59,69' : '0,230,118',
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

  /* ---- Premium Unique Features (Cursor Glow, Spotlight, Logo formatting, Bilingual i18n) ---- */
  function initUniqueFeatures() {
    // 1. Add card-tilt class dynamically to cards for 3D tilt
    document.querySelectorAll('.card, .testimonial-card, .broker-card').forEach(card => {
      card.classList.add('card-tilt');
    });

    // 2. Logo R & V text styling split
    document.querySelectorAll('.mark, .logo-mark').forEach(mark => {
      if (mark.textContent.trim() === 'RV') {
        mark.innerHTML = '<span class="logo-r">R</span><span class="logo-v">V</span>';
      }
    });

    document.querySelectorAll('.brand > span:not(.mark), .footer-brand .name').forEach(span => {
      if (span.textContent.trim().startsWith('RV')) {
        span.innerHTML = '<span class="logo-r">R</span><span class="logo-v">V</span> <span class="rv">ACADEMY</span>';
      }
    });

    // 3. Mouse spotlight glow effect on cards
    function updateCardGlows() {
      document.querySelectorAll('.card, .testimonial-card, .broker-card').forEach(card => {
        if (card.dataset.glowBound) return;
        card.dataset.glowBound = '1';
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--x', `${x}px`);
          card.style.setProperty('--y', `${y}px`);
        });
      });
    }
    updateCardGlows();
    window.bindCardGlows = updateCardGlows;

    // 4. Custom Cursor Ambient Spotlight (Desktop Only)
    if (!document.getElementById('customCursorGlow') && !window.matchMedia('(pointer: coarse)').matches) {
      const glow = document.createElement('div');
      glow.id = 'customCursorGlow';
      document.body.appendChild(glow);
      
      let cursorX = -500, cursorY = -500;
      let targetX = -500, targetY = -500;
      
      document.addEventListener('mousemove', e => {
        targetX = e.clientX;
        targetY = e.clientY;
      });
      
      function lerpCursor() {
        cursorX += (targetX - cursorX) * 0.08;
        cursorY += (targetY - cursorY) * 0.08;
        glow.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        requestAnimationFrame(lerpCursor);
      }
      lerpCursor();
    }

    // 5. Bilingual Language Switching Engine
    const navLinks = document.getElementById('navLinks');
    if (navLinks && !document.getElementById('langToggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'langToggle';
      toggleBtn.className = 'lang-toggle-btn';
      toggleBtn.style.marginLeft = '12px';
      
      const currentLang = localStorage.getItem('lang') || 'si';
      toggleBtn.innerHTML = `🌐 ${currentLang === 'si' ? 'English' : 'සිංහල'}`;
      
      toggleBtn.addEventListener('click', () => {
        const lang = localStorage.getItem('lang') || 'si';
        const nextLang = lang === 'si' ? 'en' : 'si';
        
        document.body.classList.remove('lang-si', 'lang-en');
        document.body.classList.add('lang-' + nextLang);
        localStorage.setItem('lang', nextLang);
        
        toggleBtn.innerHTML = `🌐 ${nextLang === 'si' ? 'English' : 'සිංහල'}`;
        
        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('langChanged', { detail: nextLang }));
      });
      
      navLinks.appendChild(toggleBtn);
      
      // Auto-wrap translations for navbar and footer links across all pages
      const navTranslations = {
        "මුල් පිටුව": { si: "මුල් පිටුව", en: "Home" },
        "Home": { si: "මුල් පිටුව", en: "Home" },
        "Affiliate ලින්ක්": { si: "Affiliate ලින්ක්", en: "Affiliates" },
        "Affiliates": { si: "Affiliate ලින්ක්", en: "Affiliates" },
        "කෝස්": { si: "කෝස්", en: "Courses" },
        "Courses": { si: "කෝස්", en: "Courses" },
        "About": { si: "අපි ගැන", en: "About Us" },
        "About Us": { si: "අපි ගැන", en: "About Us" },
        "අපි ගැන": { si: "අපි ගැන", en: "About Us" },
        "FAQ": { si: "FAQ", en: "FAQ" },
        "Contact": { si: "සම්බන්ධ වන්න", en: "Contact" },
        "Contact Us": { si: "සම්බන්ධ වන්න", en: "Contact" },
        "Legal": { si: "නීතිමය", en: "Legal" },
        "Legal Info": { si: "නීතිමය", en: "Legal" },
        "ලොගින්": { si: "ලොගින්", en: "Login" },
        "Login": { si: "ලොගින්", en: "Login" },
        "ඩෑශ්බෝඩ්": { si: "ඩෑශ්බෝඩ්", en: "Dashboard" },
        "Dashboard": { si: "ඩෑශ්බෝඩ්", en: "Dashboard" }
      };

      const footerTranslations = {
        "ශ්රී ලංකාවේ #1 Trading Education Platform. Forex සහ Crypto Trading ඉගෙන ගන්න.": {
          si: "ශ්‍රී ලංකාවේ #1 Trading Education Platform. Forex සහ Crypto Trading ඉගෙන ගන්න.",
          en: "Sri Lanka's #1 Trading Education Platform. Learn Forex and Crypto Trading."
        },
        "ශ්‍රී ලංකාවේ #1 Trading Education Platform. Forex සහ Crypto Trading ඉගෙන ගන්න.": {
          si: "ශ්‍රී ලංකාවේ #1 Trading Education Platform. Forex සහ Crypto Trading ඉගෙන ගන්න.",
          en: "Sri Lanka's #1 Trading Education Platform. Learn Forex and Crypto Trading."
        }
      };

      // Auto-wrap nav links
      document.querySelectorAll('.nav-links a').forEach(a => {
        const text = a.textContent.trim();
        if (navTranslations[text] && !a.querySelector('.si-text')) {
          const trans = navTranslations[text];
          a.innerHTML = `<span class="si-text">${trans.si}</span><span class="en-text">${trans.en}</span>`;
        }
      });

      // Auto-wrap footer brand description
      document.querySelectorAll('.footer-brand p').forEach(p => {
        const text = p.textContent.trim();
        if (footerTranslations[text] && !p.querySelector('.si-text')) {
          const trans = footerTranslations[text];
          p.innerHTML = `<span class="si-text">${trans.si}</span><span class="en-text">${trans.en}</span>`;
        }
      });

      // Auto-wrap footer links
      document.querySelectorAll('.footer-grid a').forEach(a => {
        const text = a.textContent.trim();
        if (navTranslations[text] && !a.querySelector('.si-text')) {
          const trans = navTranslations[text];
          a.innerHTML = `<span class="si-text">${trans.si}</span><span class="en-text">${trans.en}</span>`;
        }
      });
      
      // Set initial body language class
      document.body.classList.remove('lang-si', 'lang-en');
      document.body.classList.add('lang-' + currentLang);
    }
  }

  /* ---- Init all on DOM ready ---- */
  function onReady() {
    initUniqueFeatures();
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
    document.querySelectorAll('.card, .testimonial-card, .broker-card').forEach(card => {
      card.classList.add('card-tilt');
    });
    if (window.bindCardGlows) window.bindCardGlows();
    bindRipples();
    bindTilts();
  };

})();
