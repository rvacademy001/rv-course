/* ============================================================
   navbar.js — Shared navbar interactions
   ============================================================ */

function initNavbar(){
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if(toggle && navLinks){
    toggle.addEventListener('click', ()=>{
      navLinks.classList.toggle('open');
      toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    // Close on link click (mobile)
    navLinks.querySelectorAll('a, button').forEach(el=>{
      el.addEventListener('click', ()=>{
        navLinks.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
    // Close on outside click
    document.addEventListener('click', (e)=>{
      if(!toggle.contains(e.target) && !navLinks.contains(e.target)){
        navLinks.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  }

  // Update nav auth area
  updateNavAuth();

  // Mark active page
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(el=>{
    el.classList.toggle('active', el.dataset.page === page);
  });
}

function updateNavAuth(){
  const area = document.getElementById('navAuthArea');
  if(!area) return;
  
  // Safely resolve SESSION from global scope to prevent ReferenceError on pages without db.js
  const activeSession = (typeof SESSION !== 'undefined') ? SESSION : null;
  
  if(activeSession && activeSession.type === "student"){
    area.innerHTML = `<button class="navbtn" onclick="window.location.href='student.html'">📊 <span class="si-text">ඩෑශ්බෝඩ්</span><span class="en-text">Dashboard</span></button>`;
  } else if(activeSession && activeSession.type === "admin"){
    area.innerHTML = `<button class="navbtn" onclick="window.location.href='admin.html'">⚙️ Admin</button>`;
  } else {
    area.innerHTML = `<a href="login.html" class="nav-cta"><span class="si-text">ලොගින්</span><span class="en-text">Login</span></a>`;
  }
}
