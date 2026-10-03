/**
 * ================================================================
 * RV ACADEMY - SHARED UI COMPONENTS & TRADING PLATFORM SYSTEM
 * Separate Public Navigation & Dedicated Student LMS Navigation
 * ================================================================
 */

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function showToast(message, type = "info") {
  const existing = document.getElementById("rv-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "rv-toast";
  toast.style.position = "fixed";
  toast.style.bottom = "28px";
  toast.style.right = "28px";
  toast.style.background = type === "error" ? "linear-gradient(135deg, #ef4444, #991b1b)" : type === "success" ? "linear-gradient(135deg, #00f076, #059669)" : "linear-gradient(135deg, #1e293b, #0f172a)";
  toast.style.color = type === "success" ? "#000" : "#fff";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
  toast.style.fontWeight = "600";
  toast.style.zIndex = "99999";
  toast.style.fontSize = "13px";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "8px";
  toast.style.border = "1px solid rgba(255,255,255,0.15)";
  toast.innerHTML = (type === "success" ? "✓ " : type === "error" ? "⚠️ " : "ℹ️ ") + message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// 1. PUBLIC WEBSITE NAVIGATION (Home, Courses, About, Contact, Legal, Payment, Login)
function renderNav(activePage = "") {
  window.CURRENT_PAGE_KEY = activePage;
  const navPlaceholder = document.getElementById("main-nav");
  if (!navPlaceholder) return;

  const me = RV_Auth.getMe();
  const isAdmin = me && me.admin;
  const isStudent = me && !me.admin;
  const lang = window.I18N ? window.I18N.currentLang : (localStorage.getItem("rv_lang") || "si");

  let links = [
    { title: lang === "si" ? "මුල් පිටුව" : "Home", href: "index.html", key: "home", icon: "fa-solid fa-house" },
    { title: lang === "si" ? "පාඨමාලා" : "Courses", href: "courses.html", key: "courses", icon: "fa-solid fa-graduation-cap" },
    { title: lang === "si" ? "අප ගැන" : "About", href: "about.html", key: "about", icon: "fa-solid fa-circle-info" },
    { title: lang === "si" ? "සම්බන්ධ වන්න" : "Contact", href: "contact.html", key: "contact", icon: "fa-solid fa-headset" },
    { title: lang === "si" ? "නීතිමය" : "Legal", href: "legal.html", key: "legal", icon: "fa-solid fa-shield-halved" }
  ];

  if (!me) {
    links.push({ title: lang === "si" ? "Login" : "Sign In", href: "login.html", key: "login", cta: true, icon: "fa-solid fa-arrow-right-to-bracket" });
  } else if (isAdmin) {
    links.push({ title: "Admin Panel", href: "admin.html", key: "admin", cta: true, icon: "fa-solid fa-lock" });
    links.push({ title: "Logout", href: "#", action: "RV_Auth.logout()", key: "logout", icon: "fa-solid fa-power-off" });
  } else if (isStudent) {
    links.push({ title: lang === "si" ? "Student LMS Portal" : "Student LMS Portal", href: "dashboard.html", key: "dashboard", cta: true, icon: "fa-solid fa-gauge-high" });
    links.push({ title: "Logout", href: "#", action: "RV_Auth.logout()", key: "logout", icon: "fa-solid fa-power-off" });
  }

  const linksHtml = links.map(l => {
    const isActive = activePage === l.key ? "active" : "";
    const isCta = l.cta ? "nav-cta" : "";
    const iconHtml = l.icon ? `<i class="${l.icon}" style="font-size:11px;"></i>` : "";
    if (l.action) {
      return `<li><a href="javascript:void(0)" onclick="${l.action}" class="nav-link ${isActive}">${iconHtml} ${l.title}</a></li>`;
    }
    return `<li><a href="${l.href}" class="nav-link ${isActive} ${isCta}">${iconHtml} ${l.title}</a></li>`;
  }).join("");

  const langBtnLabel = lang === "si" ? "English" : "සිංහල";
  const tickerLabelText = lang === "si" ? "🔴 සජීවී" : "🔴 LIVE";

  navPlaceholder.innerHTML = `
    <!-- Live Compact Ticker Tape -->
    <div class="ticker-wrap">
      <div class="ticker-label">
        <span class="pulse-dot"></span> ${tickerLabelText}
      </div>
      <div class="ticker-content">
        <div class="ticker-item"><span class="ticker-pair">BTC/USDT</span> <span class="ticker-val">$96,850.00</span> <span class="ticker-up">+4.12% ▲</span></div>
        <div class="ticker-item"><span class="ticker-pair">EUR/USD</span> <span class="ticker-val">1.08450</span> <span class="ticker-up">+0.22% ▲</span></div>
        <div class="ticker-item"><span class="ticker-pair">XAU/USD (GOLD)</span> <span class="ticker-val">$2,748.20</span> <span class="ticker-up">+1.65% ▲</span></div>
        <div class="ticker-item"><span class="ticker-pair">US30</span> <span class="ticker-val">43,450.0</span> <span class="ticker-down">-0.18% ▼</span></div>
        <div class="ticker-item"><span class="ticker-pair">NAS100</span> <span class="ticker-val">20,890.5</span> <span class="ticker-up">+1.15% ▲</span></div>
        <div class="ticker-item"><span class="ticker-pair">GBP/JPY</span> <span class="ticker-val">198.420</span> <span class="ticker-up">+0.54% ▲</span></div>
      </div>
    </div>

    <!-- Compact Clean Navigation Bar -->
    <header class="site-nav">
      <div class="nav-container">
        <a href="index.html" class="brand">
          <div class="brand-logo-wrap">
            <img src="rvlogo.jpg" alt="RV Academy" class="brand-logo">
          </div>
          <div class="brand-text">
            <span class="brand-name">RV <span class="text-bull">ACADEMY</span></span>
            <span class="brand-tagline">INSTITUTIONAL TRADING</span>
          </div>
        </a>

        <div style="display:flex;align-items:center;gap:8px;">
          <!-- Compact Language Switcher -->
          <button class="lang-toggle-btn" onclick="I18N.toggle()" title="Language Switcher">
            <i class="fa-solid fa-globe" style="font-size:11px;"></i>
            <span id="lang-label">${langBtnLabel}</span>
          </button>

          <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation menu" onclick="toggleMobileNav()">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>

        <ul class="nav-links" id="nav-links-menu">
          ${linksHtml}
        </ul>
      </div>
    </header>
  `;
}

// 2. DEDICATED STUDENT LMS NAVIGATION (Dashboard, Lessons, Downloads, Private Class, Affiliate, Profile)
// Completely separate from public website navbar
function renderStudentNav(activePage = "") {
  window.CURRENT_PAGE_KEY = activePage;
  const navPlaceholder = document.getElementById("main-nav");
  if (!navPlaceholder) return;

  const me = RV_Auth.getMe();
  const lang = window.I18N ? window.I18N.currentLang : (localStorage.getItem("rv_lang") || "si");

  const lmsLinks = [
    { title: lang === "si" ? "Dashboard" : "Dashboard", href: "dashboard.html", key: "dashboard", icon: "fa-solid fa-chart-line" },
    { title: lang === "si" ? "පාඩම්" : "Lessons", href: "lessons.html", key: "lessons", icon: "fa-solid fa-play" },
    { title: lang === "si" ? "බාගත කිරීම්" : "Downloads", href: "downloads.html", key: "downloads", icon: "fa-solid fa-cloud-arrow-down" },
    { title: lang === "si" ? "Private Class" : "Private Class", href: "private-class.html", key: "private-class", icon: "fa-solid fa-chalkboard-user" },
    { title: lang === "si" ? "Affiliate" : "Affiliate", href: "affiliate.html", key: "affiliate", icon: "fa-solid fa-hand-holding-dollar" },
    { title: lang === "si" ? "ගිණුම" : "Profile", href: "profile.html", key: "profile", icon: "fa-solid fa-user-gear" }
  ];

  const linksHtml = lmsLinks.map(l => {
    const isActive = activePage === l.key ? "active" : "";
    return `<li><a href="${l.href}" class="nav-link ${isActive}"><i class="${l.icon}" style="font-size:12px;"></i> ${l.title}</a></li>`;
  }).join("");

  const studentName = me ? (me.name ? me.name.split(" ")[0] : "Student") : "Student";
  const studentCode = me && me.code ? me.code : "";
  const langBtnLabel = lang === "si" ? "English" : "සිංහල";

  navPlaceholder.innerHTML = `
    <header class="site-nav lms-nav" style="border-bottom:1px solid rgba(0,240,118,0.25);background:rgba(8,12,18,0.96);">
      <div class="nav-container">
        
        <!-- LMS Portal Brand -->
        <a href="dashboard.html" class="brand">
          <div class="brand-logo-wrap">
            <img src="rvlogo.jpg" alt="RV Academy" class="brand-logo">
          </div>
          <div class="brand-text">
            <span class="brand-name">RV <span class="text-bull">LMS</span></span>
            <span class="brand-tagline" style="color:var(--bull);letter-spacing:1.5px;">STUDENT PORTAL</span>
          </div>
        </a>

        <!-- Desktop Navigation Items -->
        <ul class="nav-links" id="nav-links-menu">
          ${linksHtml}
        </ul>

        <!-- Right Side: Student Info & Actions -->
        <div style="display:flex;align-items:center;gap:10px;">
          
          <!-- Student Badge -->
          <div class="student-pill" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:20px;padding:4px 12px;font-size:12px;">
            <i class="fa-solid fa-user-graduate text-bull"></i>
            <span style="font-weight:700;color:#fff;">${escapeHtml(studentName)}</span>
            ${studentCode ? `<span style="font-family:var(--font-mono);font-size:10px;color:var(--gold);background:rgba(255,184,0,0.1);padding:1px 6px;border-radius:4px;">${escapeHtml(studentCode)}</span>` : ""}
          </div>

          <!-- Language Switcher -->
          <button class="lang-toggle-btn" onclick="I18N.toggle()" title="Language Switcher">
            <i class="fa-solid fa-globe" style="font-size:11px;"></i>
            <span>${langBtnLabel}</span>
          </button>

          <!-- Logout Button -->
          <button class="btn btn-sm btn-sec" onclick="RV_Auth.logout()" title="Logout" style="padding:6px 12px;font-size:12px;border-color:rgba(239,68,68,0.4);color:#fca5a5;">
            <i class="fa-solid fa-power-off"></i>
          </button>

          <!-- Mobile Nav Hamburger -->
          <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation menu" onclick="toggleMobileNav()">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>

      </div>
    </header>
  `;
}

function toggleMobileNav() {
  const menu = document.getElementById("nav-links-menu");
  if (menu) menu.classList.toggle("show");
}

function renderFooter() {
  const footerPlaceholder = document.getElementById("main-footer");
  if (!footerPlaceholder) return;

  const lang = window.I18N ? window.I18N.currentLang : (localStorage.getItem("rv_lang") || "si");

  footerPlaceholder.innerHTML = `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-top" style="grid-template-columns: 2fr 1fr 1fr;">
          <div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <img src="rvlogo.jpg" alt="RV Academy" style="height:36px;width:36px;border-radius:8px;object-fit:cover;border:1px solid rgba(255,255,255,0.2);">
              <div>
                <span style="font-family:var(--font-heading);font-size:1.2rem;font-weight:800;color:#fff;">RV ACADEMY</span>
                <div style="font-size:10px;color:var(--bull);letter-spacing:1px;font-family:var(--font-mono);">INSTITUTIONAL TRADING</div>
              </div>
            </div>
            <p class="footer-desc">
              ${lang === "si" ? 
                "ශ්‍රී ලංකාවේ ප්‍රමුඛතම Institutional Trading Academy. Smart Money Concepts (SMC), Liquidity Engineering සහ Risk Architecture මගින් සාර්ථක Traders ලා බිහිකිරීම." : 
                "Sri Lanka's leading institutional trading academy. Master Smart Money Concepts (SMC), liquidity engineering, and algorithmic risk architecture."
              }
            </p>
            <div style="margin-top:14px;font-size:13px;color:#fff;display:flex;flex-direction:column;gap:4px;">
              <div><i class="fa-brands fa-whatsapp text-bull"></i> WhatsApp: <strong>0765450055</strong></div>
              <div><i class="fa-solid fa-envelope text-bull"></i> Email: <strong>rvacademyxm@gmail.com</strong></div>
            </div>
          </div>

          <div class="footer-col">
            <h4>${lang === "si" ? "ප්‍රධාන පිටු" : "Navigation"}</h4>
            <ul>
              <li><a href="index.html"><i class="fa-solid fa-chevron-right" style="font-size:9px;color:var(--bull);"></i> ${lang === "si" ? "මුල් පිටුව" : "Home Overview"}</a></li>
              <li><a href="courses.html"><i class="fa-solid fa-chevron-right" style="font-size:9px;color:var(--bull);"></i> ${lang === "si" ? "පාඨමාලා" : "Courses & Syllabus"}</a></li>
              <li><a href="about.html"><i class="fa-solid fa-chevron-right" style="font-size:9px;color:var(--bull);"></i> ${lang === "si" ? "අප ගැන & Socials" : "About & Community"}</a></li>
              <li><a href="contact.html"><i class="fa-solid fa-chevron-right" style="font-size:9px;color:var(--bull);"></i> ${lang === "si" ? "සම්බන්ධ වන්න" : "Contact & WhatsApp"}</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>${lang === "si" ? "නීතිමය & ආරක්ෂාව" : "Legal & Risk"}</h4>
            <ul>
              <li><a href="legal.html"><i class="fa-solid fa-chevron-right" style="font-size:9px;color:var(--bull);"></i> ${lang === "si" ? "Risk Disclosure" : "Risk Warning"}</a></li>
              <li><a href="legal.html"><i class="fa-solid fa-chevron-right" style="font-size:9px;color:var(--bull);"></i> ${lang === "si" ? "Terms & Conditions" : "Terms of Service"}</a></li>
              <li><a href="login.html"><i class="fa-solid fa-chevron-right" style="font-size:9px;color:var(--bull);"></i> ${lang === "si" ? "Student Login" : "Student Login"}</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© ${new Date().getFullYear()} RV Academy. All rights reserved. Leveraged trading involves risk.</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--bull);">
            PRECISION INSTITUTIONAL TRADING
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Ensure no backend notice banners are shown
function renderBackendBanner(containerId = "backend-notice") {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = "";
}

// Auth Guards
function requireAuth() {
  const me = RV_Auth.getMe();
  if (!me) {
    window.location.href = "login.html";
    return null;
  }
  return me;
}

function requireAdmin() {
  const me = RV_Auth.getMe();
  if (!me || !me.admin) {
    alert("Academy Administrator access required.");
    window.location.href = "login.html";
    return null;
  }
  return me;
}

function redirectIfLoggedIn() {
  const me = RV_Auth.getMe();
  if (me) {
    if (me.admin) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  }
}
