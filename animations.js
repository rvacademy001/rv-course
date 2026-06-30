/* ============================================================
   animations.js — Shared scroll-reveal & interactive animations
   Include on every public page AFTER styles.css loads
   ============================================================ */

(function(){

  /* ---- Page progress bar ---- */
  const bar = document.createElement('div');
  bar.id = 'pageProgress';
  document.body.prepend(bar);
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, {passive:true});

  /* ---- Scroll-reveal Intersection Observer ---- */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function bindReveal(){
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => io.observe(el));
  }
  // Run on DOM ready and after any dynamic renders
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bindReveal);
  } else {
    bindReveal();
  }
  // Re-bind when new content is injected (for SPA-style tabs)
  window.rebindReveal = bindReveal;

  /* ---- Floating particle canvas (subtle trading dots) ---- */
  function initParticles(){
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize(){
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, {passive:true});

    const COUNT = 28;
    function mkParticle(){
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '212,175,55' : '31,203,107'
      };
    }
    particles = Array.from({length: COUNT}, mkParticle);

    function draw(){
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if(p.x < 0 || p.x > W) p.dx *= -1;
        if(p.y < 0 || p.y > H) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }
  // Only init on pages that opt in (not dashboard pages)
  if(!document.body.classList.contains('no-particles')){
    initParticles();
  }

  /* ---- Number counter animation ---- */
  window.animateCount = function(el, target, duration=1400, prefix='', suffix=''){
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function step(now){
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = isFloat ? (target*ease).toFixed(1) : Math.round(target*ease);
      el.textContent = prefix + val + suffix;
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  /* ---- Trigger count on stat elements ---- */
  document.addEventListener('DOMContentLoaded', ()=>{
    const statObserver = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const el = e.target;
          const raw = el.dataset.count;
          if(raw){
            const num = parseFloat(raw);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            animateCount(el, num, 1600, prefix, suffix);
          }
          statObserver.unobserve(el);
        }
      });
    }, {threshold: 0.5});
    document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));
  });

  /* ---- Smooth hover tilt for cards ---- */
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.card-tilt').forEach(card=>{
      card.addEventListener('mousemove', e=>{
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', ()=>{
        card.style.transform = '';
        card.style.transition = 'transform .4s ease';
      });
      card.addEventListener('mouseenter', ()=>{
        card.style.transition = 'transform .1s ease';
      });
    });
  });

})();
