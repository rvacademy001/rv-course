/* ============================================================
   db.js — Supabase Backend Integration
   Project: https://vmvoofugmmkdvugdewol.supabase.co
   ============================================================ */

const WA_NUMBER = "94765450055";

/* ---------- Supabase Config ---------- */
const SUPABASE_URL  = "https://vmvoofugmmkdvugdewol.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdm9vZnVnbW1rZHZ1Z2Rld29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NDE5NzIsImV4cCI6MjA5ODQxNzk3Mn0.DTtfXQG8QyxBx_8LuVi4o2IljgEZZFRJQWHmpWQ2nNg";

const SB_HEADERS = {
  "Content-Type"  : "application/json",
  "apikey"        : SUPABASE_ANON,
  "Authorization" : "Bearer " + SUPABASE_ANON,
  "Prefer"        : "return=representation",
};

/* ---------- Low-level REST helpers ---------- */
async function sbGet(table, params = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {
    headers: { ...SB_HEADERS, "Prefer": "" },
  });
  if (!res.ok) throw new Error(`GET ${table} failed: ${res.statusText}`);
  return res.json();
}

async function sbUpsert(table, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method : "POST",
    headers: { ...SB_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
    body   : JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`UPSERT ${table} failed: ${res.statusText} — ${txt}`);
  }
  return res.json();
}

async function sbDelete(table, column, value) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`, {
    method : "DELETE",
    headers: { ...SB_HEADERS, "Prefer": "" },
  });
  if (!res.ok) throw new Error(`DELETE ${table} failed: ${res.statusText}`);
}

async function sbPatch(table, column, value, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`, {
    method : "PATCH",
    headers: SB_HEADERS,
    body   : JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PATCH ${table} failed: ${res.statusText} — ${txt}`);
  }
  return res.json();
}

/* ---------- Broker / constants ---------- */
const BROKERS = [
  { id:"xm",      name:"XM",      color:"#d4af37", desc:"ග්ලෝබල් වශයෙන් පිළිගත් Forex / CFD බ්‍රෝකර් කෙනෙක්. අඩු spread සහ වේගවත් execution.", link:"https://clicks.pipaffiliates.com/c?c=751050&l=en&p=1", code:"RVFOREX" },
  { id:"exness",  name:"Exness",  color:"#ffd400", desc:"Unlimited leverage සහ ක්ෂණික withdrawal වලින් ප්‍රසිද්ධ Forex බ්‍රෝකර් එකක්.", link:"https://one.exnessonelink.com/a/pjfc0ydtzd", code:"pjfc0ydtzd" },
  { id:"bybit",   name:"Bybit",   color:"#f7a600", desc:"ලෝකයේ ප්‍රමුඛතම Crypto Derivatives Exchange එකක්.", link:"https://partner.bybit.com/b/150382", code:"150382" },
  { id:"binance", name:"Binance", color:"#f0b90b", desc:"ලෝකයේ විශාලතම Cryptocurrency Exchange එක — Spot, Futures, Earn.", link:"https://www.binance.com/join?ref=RVCRYPTOSL", code:"RVCRYPTOSL" },
  { id:"deriv",   name:"Deriv",   color:"#ff444f", desc:"Synthetic Indices සහ Multipliers සඳහා ප්‍රසිද්ධ ට්‍රේඩින් platform එකක්.", link:"https://deriv.partners/rx?sidc=CD7D07E1-74D4-4BE4-A5ED-FB7FB95E588E&utm_campaign=dynamicworks&utm_medium=affiliate&utm_source=CU40035", code:"CU40035" },
  { id:"bitget",  name:"Bitget",  color:"#00f0ff", desc:"Copy Trading සහ Futures සඳහා වේගයෙන් වර්ධනය වන Crypto Exchange එකක්.", link:"https://partner.bitget.site/bg/753DWH", code:"fhud" },
  { id:"mexc",    name:"MEXC",    color:"#1de9b6", desc:"නව coins ඉක්මනින්ම ලබාගත හැකි, අඩු fees සහිත Crypto Exchange එකක්.", link:"https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-RVCRYPTO", code:"mexc-RVCRYPTO" },
];

/* ---------- Default courses (used only if DB is empty) ---------- */
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

/* ---------- Admin credentials ---------- */
const ADMIN_CREDENTIALS = { username:"RV", password:"Prashan2002$Ni" };

/* ---------- In-memory DB (populated by loadDB) ---------- */
let DB = { students:{}, courses:{}, community:[] };

/* ---------- Session ---------- */
let SESSION = JSON.parse(sessionStorage.getItem("rv_session_temp") || "null");
function saveSession(){ sessionStorage.setItem("rv_session_temp", JSON.stringify(SESSION)); }
function clearSession(){ SESSION = null; sessionStorage.removeItem("rv_session_temp"); }

/* ==========================================================
   LOAD — pull all data from Supabase into local DB object
   ========================================================== */
async function loadDB(){
  /* ---- Students ---- */
  try {
    const rows = await sbGet("students", "?select=*");
    DB.students = {};
    rows.forEach(r => {
      DB.students[r.username] = {
        name    : r.name,
        password: r.password,
        courses : r.courses ? r.courses.split(",").filter(Boolean) : [],
        watched : r.watched  || {},
        journal : r.journal  || [],
      };
    });
  } catch(e){
    console.error("loadDB students:", e);
    DB.students = {};
  }

  /* ---- Ensure demo account ---- */
  if(!DB.students["demo"]){
    const demoData = {name:"Demo Student", password:"demo", courses:"basic", watched:{}, journal:[]};
    try { await sbUpsert("students", {...demoData, username:"demo"}); } catch(e){}
    DB.students["demo"] = {name:"Demo Student", password:"demo", courses:["basic"], watched:{}, journal:[]};
  }

  /* ---- Courses ---- */
  try {
    const rows = await sbGet("courses", "?select=*");
    DB.courses = {};
    rows.forEach(r => {
      DB.courses[r.key] = {
        key    : r.key,
        title  : r.title,
        price  : r.price,
        desc   : r.desc,
        feats  : r.feats ? r.feats.split("\n").filter(Boolean) : [],
        videos : [],          // videos stored as JSON inside courses table's feats is text; we keep videos in memory only
      };
    });

    /* seed defaults if empty */
    if(!Object.keys(DB.courses).length){
      for(const c of Object.values(DEFAULT_COURSES)){
        await sbUpsert("courses", {key:c.key, title:c.title, price:c.price, desc:c.desc, feats:c.feats});
        DB.courses[c.key] = {...c, feats:c.feats.split("\n").filter(Boolean)};
      }
    }
  } catch(e){
    console.error("loadDB courses:", e);
    DB.courses = {};
    for(const c of Object.values(DEFAULT_COURSES)){
      DB.courses[c.key] = {...c, feats:c.feats.split("\n").filter(Boolean)};
    }
  }

  /* ---- Community ---- */
  try {
    const rows = await sbGet("community", "?select=*&order=date.asc");
    DB.community = rows.map(r => ({
      id      : r.id,
      username: r.username,
      name    : r.name,
      text    : r.text,
      date    : r.date,
      replies : r.replies || [],
    }));
  } catch(e){
    console.error("loadDB community:", e);
    DB.community = [];
  }

  /* ---- Load videos from courses.videos column (stored as JSON text in feats column is separate) ---- */
  /* Videos are stored in a separate "videos" JSON column inside the courses table.
     We re-read it and merge into DB.courses[key].videos */
  try {
    const rows = await sbGet("courses", "?select=key,videos");
    rows.forEach(r => {
      if(DB.courses[r.key]) DB.courses[r.key].videos = r.videos || [];
    });
  } catch(e){ /* videos column may not yet exist — ignore */ }
}

/* ==========================================================
   SAVE HELPERS
   ========================================================== */

/* Save a single student back to Supabase */
async function saveStudent(username){
  const s = DB.students[username];
  if(!s) return;
  await sbUpsert("students", {
    username,
    name    : s.name,
    password: s.password,
    courses : (s.courses || []).join(","),
    watched : s.watched || {},
    journal : s.journal || [],
  });
}

/* Save ALL students (compatibility shim for admin bulk saves) */
async function saveStudents(){
  for(const username of Object.keys(DB.students)){
    await saveStudent(username);
  }
}

/* Save a single course */
async function saveCourse(key){
  const c = DB.courses[key];
  if(!c) return;
  await sbUpsert("courses", {
    key,
    title  : c.title,
    price  : c.price,
    desc   : c.desc,
    feats  : (c.feats || []).join("\n"),
    videos : c.videos || [],
  });
}

/* Save ALL courses (shim) */
async function saveCourses(){
  for(const key of Object.keys(DB.courses)){
    await saveCourse(key);
  }
}

/* Save community array — upsert every post */
async function saveCommunity(){
  for(const p of DB.community){
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

/* Delete a community post by id */
async function deletePostFromDB(id){
  await sbDelete("community", "id", id);
}

/* Delete a student by username */
async function deleteStudentFromDB(username){
  await sbDelete("students", "username", username);
}

/* ==========================================================
   UTILITY HELPERS  (unchanged from original)
   ========================================================== */
function waLink(text){ return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`; }
function esc(s){ return (s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toEmbed(link){
  if(!link) return "";
  let m = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]{6,})/);
  if(m) return `https://www.youtube.com/embed/${m[1]}`;
  m = link.match(/vimeo\.com\/(\d+)/);
  if(m) return `https://player.vimeo.com/video/${m[1]}`;
  return link;
}
function copyText(t, btn){
  navigator.clipboard?.writeText(t).then(()=>{
    const o = btn.textContent;
    btn.textContent = "✓ Copied!";
    setTimeout(()=>btn.textContent=o, 1400);
  });
}

/* ==========================================================
   NAVIGATION
   ========================================================== */
function goPage(page){ window.location.href = page; }
function logout(){ clearSession(); window.location.href = "index.html"; }
