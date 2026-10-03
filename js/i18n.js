/**
 * ================================================================
 * RV ACADEMY - INTERNATIONALIZATION (i18n) ENGINE
 * Supports: Sinhala / English Mix (Default) & Pure English
 * ================================================================
 */

const I18N = {
  currentLang: localStorage.getItem("rv_lang") || "si",

  translations: {
    // Navbar
    nav_home: { si: "මුල් පිටුව", en: "Home" },
    nav_courses: { si: "පාඨමාලා (Courses)", en: "Courses" },
    nav_about: { si: "අප ගැන (About)", en: "About Us" },
    nav_contact: { si: "සම්බන්ධ වන්න", en: "Contact" },
    nav_legal: { si: "නීතිමය කොන්දේසි", en: "Legal" },
    nav_login: { si: "Login / Register", en: "Portal Login" },
    nav_dashboard: { si: "Dashboard", en: "Dashboard" },
    nav_lessons: { si: "වීඩියෝ පාඩම්", en: "Watch Lessons" },
    nav_requests: { si: "පාඩම් ඉල්ලීම්", en: "Requests" },
    nav_affiliate: { si: "Affiliate & ආදායම්", en: "Affiliate" },
    nav_profile: { si: "ගිණුම (Profile)", en: "Profile" },
    nav_admin: { si: "Admin Panel", en: "Admin Panel" },
    nav_logout: { si: "Logout", en: "Logout" },

    // Ticker
    ticker_label: { si: "🔴 සජීවී වෙළඳපල", en: "🔴 LIVE MARKETS" },

    // Footer
    footer_desc: {
      si: "ශ්‍රී ලංකාවේ ප්‍රමුඛතම Institutional Trading Academy. Smart Money Concepts (SMC), Liquidity Engineering සහ Risk Management මගින් ඔබව සාර්ථක Trader කෙනෙකු බවට පත් කරන නිවැරදිම මගපෙන්වීම.",
      en: "Sri Lanka's leading institutional trading academy. Master Smart Money Concepts (SMC), liquidity engineering, and professional risk management."
    },
    footer_rights: {
      si: "සියලුම හිමිකම් ඇවිරිණි. High Risk Trading Disclaimer අදාළ වේ.",
      en: "All rights reserved. High risk investment warning applies."
    }
  },

  get(key) {
    const item = this.translations[key];
    if (!item) return key;
    return item[this.currentLang] || item["si"] || key;
  },

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem("rv_lang", lang);
    this.apply();
  },

  toggle() {
    const newLang = this.currentLang === "si" ? "en" : "si";
    this.setLanguage(newLang);
  },

  apply() {
    document.documentElement.lang = this.currentLang === "si" ? "si" : "en";

    // Switch all elements with data-si and data-en
    document.querySelectorAll("[data-si][data-en]").forEach(el => {
      el.innerHTML = el.getAttribute(`data-${this.currentLang}`);
    });

    // Update Language Toggle Button text
    const langBtnText = document.getElementById("lang-label");
    if (langBtnText) {
      langBtnText.textContent = this.currentLang === "si" ? "English" : "සිංහල / English";
    }

    // Update Nav
    if (typeof renderNav === "function") {
      const active = window.CURRENT_PAGE_KEY || "";
      renderNav(active);
    }
  }
};

window.I18N = I18N;
