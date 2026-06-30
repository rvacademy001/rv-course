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
  if(SESSION && SESSION.type === "student"){
    area.innerHTML = `<button class="navbtn" onclick="window.location.href='student.html'">📊 ඩෑශ්බෝඩ්</button>`;
  } else if(SESSION && SESSION.type === "admin"){
    area.innerHTML = `<button class="navbtn" onclick="window.location.href='admin.html'">⚙️ Admin</button>`;
  } else {
    area.innerHTML = `<a href="login.html" class="nav-cta">ලොගින්</a>`;
  }
}
