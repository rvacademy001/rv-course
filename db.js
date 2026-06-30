/* ============================================================
   db.js — Supabase Backend Integration  (SOURCE — readable)
   Project: https://vmvoofugmmkdvugdewol.supabase.co
   ============================================================ */

/* ---------- Supabase Config ---------- */
const SUPABASE_URL  = "https://vmvoofugmmkdvugdewol.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdm9vZnVnbW1rZHZ1Z2Rld29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NDE5NzIsImV4cCI6MjA5ODQxNzk3Mn0.DTtfXQG8QyxBx_8LuVi4o2IljgEZZFRJQWHmpWQ2nNg";

const SB_HEADERS = {
  "Content-Type"  : "application/json",
  "apikey"        : SUPABASE_ANON,
  "Authorization" : "Bearer " + SUPABASE_ANON,
  "Prefer"        : "return=representation",
};

/* ---------- System Settings (editable via Admin Panel) ---------- */
let SYSTEM_SETTINGS = {
  waNumber: "94765450055",
  bankName: "Bank of Ceylon — Urubokka Branch",
  bankAccount: "91653327",
  bankNameHolder: "P K Abesinghe"
};

/* ---------- Safe JSON parse — never throws ---------- */
function safeJson(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "object") return val;     // already parsed (JSONB)
  if (typeof val !== "string") return null;
  try { return JSON.parse(val); } catch { return null; }
}

/* ==========================================================
   LOW-LEVEL REST HELPERS
   ========================================================== */

async function sbGet(table, params) {
  params = params || "";
  const url = `${SUPABASE_URL}/rest/v1/${table}${params}`;
  const res = await fetch(url, {
    headers : { ...SB_HEADERS, "Prefer": "", "Cache-Control": "no-cache" },
    cache   : "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`GET ${table} [${res.status}]: ${txt}`);
  }
  return res.json();
}

async function sbUpsert(table, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method  : "POST",
    headers : { ...SB_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
    body    : JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`UPSERT ${table} [${res.status}]: ${txt}`);
  }
  return res.json();
}

async function sbDelete(table, column, value) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`,
    { method: "DELETE", headers: { ...SB_HEADERS, "Prefer": "" } }
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`DELETE ${table} [${res.status}]: ${txt}`);
  }
}

/* ==========================================================
   BROKER DATA
   ========================================================== */
const BROKERS = [
  { id:"xm",      name:"XM",      color:"#d4af37", desc:"ග්ලෝබල් වශයෙන් පිළිගත් Forex / CFD බ්‍රෝකර් කෙනෙක්. අඩු spread සහ වේගවත් execution.", link:"https://clicks.pipaffiliates.com/c?c=751050&l=en&p=1", code:"RVFOREX" },
  { id:"exness",  name:"Exness",  color:"#ffd400", desc:"Unlimited leverage සහ ක්ෂණික withdrawal වලින් ප්‍රසිද්ධ Forex බ්‍රෝකර් එකක්.", link:"https://one.exnessonelink.com/a/pjfc0ydtzd", code:"pjfc0ydtzd" },
  { id:"bybit",   name:"Bybit",   color:"#f7a600", desc:"ලෝකයේ ප්‍රමුඛතම Crypto Derivatives Exchange එකක්.", link:"https://partner.bybit.com/b/150382", code:"150382" },
  { id:"binance", name:"Binance", color:"#f0b90b", desc:"ලෝකයේ විශාලතම Cryptocurrency Exchange එක — Spot, Futures, Earn.", link:"https://www.binance.com/join?ref=RVCRYPTOSL", code:"RVCRYPTOSL" },
  { id:"deriv",   name:"Deriv",   color:"#ff444f", desc:"Synthetic Indices සහ Multipliers සඳහා ප්‍රසිද්ධ ට්‍රේඩින් platform එකක්.", link:"https://deriv.partners/rx?sidc=CD7D07E1-74D4-4BE4-A5ED-FB7FB95E588E&utm_campaign=dynamicworks&utm_medium=affiliate&utm_source=CU40035", code:"CU40035" },
  { id:"bitget",  name:"Bitget",  color:"#00f0ff", desc:"Copy Trading සහ Futures සඳහා වේගයෙන් වර්ධනය වන Crypto Exchange එකක්.", link:"https://partner.bitget.site/bg/753DWH", code:"fhud" },
  { id:"mexc",    name:"MEXC",    color:"#1de9b6", desc:"නව coins ඉක්මනින්ම ලබාගත හැකි, අඩු fees සහිත Crypto Exchange එකක්.", link:"https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-RVCRYPTO", code:"mexc-RVCRYPTO" },
];

/* ==========================================================
   DEFAULT COURSES (seeded when DB is empty)
   ========================================================== */
const DEFAULT_COURSES = {
  basic: {
    key:"basic", title:"Basic Course", price:"7,500",
    desc:"Forex / Trading ලෝකයට අලුතින් එන අයට. මූලික සංකල්ප, chart reading, සහ risk management.",
    feats:"Trading මූලික සංකල්ප\nCandlestick & Chart Reading\nDemo Account Setup\nLifetime Signal Group Access",
    videos:[]
  },
  advance: {
    key:"advance", title:"Advance Course", price:"15,000",
    desc:"Basic දැනුම ඇති අයට. Strategy, Technical Analysis සහ Money Management ගැඹුරින්.",
    feats:"Technical Analysis ගැඹුරින්\nStrategy Building\nMoney & Risk Management\nLive Market Sessions\nLifetime Signal Group Access",
    videos:[]
  },
  full: {
    key:"full", title:"Full Course", price:"25,000",
    desc:"Zero සිට Pro Trader කෙනෙක් වෙනකම් සම්පූර්ණ Journey එක. Basic + Advance + Mentorship.",
    feats:"Basic + Advance සම්පූර්ණයෙන්\n1-on-1 Mentorship\nTrading Psychology\nPersonal Trade Reviews\nLifetime Signal Group Access",
    videos:[]
  },
};

/* ==========================================================
   IN-MEMORY STATE
   ========================================================== */
let DB = { students:{}, courses:{}, community:[] };

/* ---------- Track whether the `videos` column exists ---------- */
let DB_HAS_VIDEOS_COL = true;

/* ---------- Session ---------- */
let SESSION = JSON.parse(sessionStorage.getItem("rv_session_temp") || "null");
function saveSession()  { sessionStorage.setItem("rv_session_temp", JSON.stringify(SESSION)); }
function clearSession() { SESSION = null; sessionStorage.removeItem("rv_session_temp"); }

/* ==========================================================
   LOAD  —  pull all data from Supabase
   ========================================================== */
async function loadDB() {

  /* ---- Students ---- */
  try {
    let params = "?select=username,name,courses,watched,journal";
    // Security Restriction: If a student is logged in, only retrieve their own record!
    if (SESSION && SESSION.type === "student") {
      params += `&username=eq.${encodeURIComponent(SESSION.username)}`;
    }
    const rows = await sbGet("students", params);
    DB.students = {};
    rows.forEach(function(r) {
      DB.students[r.username] = {
        name    : r.name,
        courses : r.courses ? r.courses.split(",").filter(Boolean) : [],
        watched : safeJson(r.watched) || {},
        journal : safeJson(r.journal) || [],
      };
    });
  } catch(e) {
    console.error("loadDB students failed:", e.message);
  }

  /* ---- Ensure logged-in student exists in local student database ---- */
  if (SESSION && SESSION.type === "student" && !DB.students[SESSION.username]) {
    DB.students[SESSION.username] = {
      name: SESSION.username,
      courses: [],
      watched: {},
      journal: []
    };
  }

  /* ---- Courses (without videos first — always safe) ---- */
  try {
    const rows = await sbGet("courses", "?select=key,title,price,desc,feats");
    DB.courses = {};
    rows.forEach(function(r) {
      if (r.key === "settings") {
        try {
          const cfg = JSON.parse(r.desc);
          if (cfg && cfg.waNumber) {
            SYSTEM_SETTINGS = { ...SYSTEM_SETTINGS, ...cfg };
          }
        } catch(err) {
          console.error("Error parsing settings row:", err);
        }
        return;
      }

      var featsList = [];
      var videosList = [];
      if (r.feats) {
        var parts = r.feats.split("===VIDEOS===");
        featsList = parts[0].split("\n").map(s => s.trim()).filter(Boolean);
        if (parts[1]) {
          try {
            videosList = JSON.parse(parts[1].trim()) || [];
          } catch(err) {
            console.error("Error parsing videos JSON from feats:", err);
          }
        }
      }

      DB.courses[r.key] = {
        key   : r.key,
        title : r.title,
        price : r.price,
        desc  : r.desc,
        feats : featsList,
        videos: videosList,
      };
    });

    /* seed defaults if table empty */
    const courseKeys = Object.keys(DB.courses).filter(k => k !== "settings");
    if (!courseKeys.length) {
      for (var k in DEFAULT_COURSES) {
        var c = DEFAULT_COURSES[k];
        await sbUpsert("courses", {
          key:c.key, title:c.title, price:c.price,
          desc:c.desc, feats:c.feats.split("\n").filter(Boolean).join("\n")
        });
        DB.courses[c.key] = {
          key:c.key, title:c.title, price:c.price, desc:c.desc,
          feats:c.feats.split("\n").filter(Boolean), videos:[]
        };
      }
    }
  } catch(e) {
    console.error("loadDB courses failed:", e.message);
    const courseKeys = Object.keys(DB.courses).filter(k => k !== "settings");
    if (!courseKeys.length) {
      for (var k2 in DEFAULT_COURSES) {
        var c2 = DEFAULT_COURSES[k2];
        DB.courses[c2.key] = {
          key:c2.key, title:c2.title, price:c2.price, desc:c2.desc,
          feats:c2.feats.split("\n").filter(Boolean), videos:[]
        };
      }
    }
  }

  /* ---- Videos (jsonb fallback load) ---- */
  if (DB_HAS_VIDEOS_COL) {
    try {
      const vrows = await sbGet("courses", "?select=key,videos");
      vrows.forEach(function(r) {
        if (!DB.courses[r.key]) return;
        var vids = safeJson(r.videos);
        if (Array.isArray(vids) && vids.length > 0) {
          DB.courses[r.key].videos = vids;
        }
      });
    } catch(e) {
      DB_HAS_VIDEOS_COL = false;
    }
  }

  /* ---- Community ---- */
  try {
    const posts = await sbGet("community", "?select=*&order=date.asc");
    DB.community = posts.map(function(r) {
      return {
        id      : r.id,
        username: r.username,
        name    : r.name,
        text    : r.text,
        date    : r.date,
        replies : safeJson(r.replies) || [],
      };
    });
  } catch(e) {
    console.error("loadDB community failed:", e.message);
    if (!DB.community) DB.community = [];
  }
}

/* ==========================================================
   SAVE HELPERS
   ========================================================== */

async function saveStudent(username) {
  var s = DB.students[username];
  if (!s) return;
  await sbUpsert("students", {
    username,
    name    : s.name,
    courses : (s.courses || []).join(","),
    watched : s.watched || {},
    journal : s.journal || [],
  });
}

async function saveStudents() {
  var keys = Object.keys(DB.students);
  for (var i = 0; i < keys.length; i++) {
    await saveStudent(keys[i]);
  }
}

async function saveCourse(key) {
  var c = DB.courses[key];
  if (!c) return;

  var featsText = (c.feats || []).join("\n");
  if (c.videos && c.videos.length > 0) {
    featsText += "\n===VIDEOS===\n" + JSON.stringify(c.videos);
  }

  var body = {
    key,
    title : c.title,
    price : c.price,
    desc  : c.desc,
    feats : featsText,
  };

  if (DB_HAS_VIDEOS_COL) {
    body.videos = c.videos || [];
  }

  try {
    await sbUpsert("courses", body);
  } catch(e) {
    if (e.message.indexOf("videos") >= 0 || e.message.indexOf("42703") >= 0) {
      DB_HAS_VIDEOS_COL = false;
      delete body.videos;
      await sbUpsert("courses", body);
    } else {
      throw e;
    }
  }
}

async function saveCourses() {
  var keys = Object.keys(DB.courses);
  for (var i = 0; i < keys.length; i++) {
    await saveCourse(keys[i]);
  }
}

async function saveSystemSettings() {
  await sbUpsert("courses", {
    key: "settings",
    title: "System Settings",
    desc: JSON.stringify(SYSTEM_SETTINGS),
    feats: ""
  });
}

async function saveCommunity() {
  for (var i = 0; i < DB.community.length; i++) {
    var p = DB.community[i];
    await sbUpsert("community", {
      id      : p.id,
      username: p.username,
      name    : p.name,
      text    : p.text,
      date    : p.date,
      replies : p.replies || [],
    });
  }
}

async function deletePostFromDB(id)      { await sbDelete("community", "id", id); }
async function deleteStudentFromDB(user) { await sbDelete("students", "username", user); }

/* ==========================================================
   UTILITY HELPERS
   ========================================================== */
function waLink(text) { return "https://wa.me/" + SYSTEM_SETTINGS.waNumber + "?text=" + encodeURIComponent(text); }
function esc(s) {
  return (s || "").replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function toEmbed(link) {
  if (!link) return "";
  var m = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]{6,})/);
  if (m) return "https://www.youtube.com/embed/" + m[1];
  m = link.match(/vimeo\.com\/(\d+)/);
  if (m) return "https://player.vimeo.com/video/" + m[1];
  return link;
}
function copyText(t, btn) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t).then(function() {
      var o = btn.textContent;
      btn.textContent = "✓ Copied!";
      setTimeout(function() { btn.textContent = o; }, 1400);
    });
  }
}

/* ==========================================================
   NAVIGATION
   ========================================================== */
function goPage(page) { window.location.href = page; }
function logout() { clearSession(); window.location.href = "index.html"; }
