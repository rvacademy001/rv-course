/**
 * ================================================================
 * RV ACADEMY - CONFIGURATION & CREDENTIALS
 * Secure Cloud Config
 * ================================================================
 */

const SUPABASE_CONFIG = {
  // Supabase Cloud Project URL & Key
  url: "https://agfujrflehdodiofkemp.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZnVqcmZsZWhkb2Rpb2ZrZW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTY5MjQsImV4cCI6MjA5MjkzMjkyNH0.YYZorR-iNNYnA0tsEZY4v_GcZ-WpfMDN-aAEPuNcG_w",
  projectId: "agfujrflehdodiofkemp",

  // Master Admin Username
  adminUsername: "rvmainadmin",

  // Official Contact
  whatsappNumber: "0765450055",
  whatsappInternational: "94765450055",
  email: "rvacademyxm@gmail.com",

  // Real Payment Details
  paymentDetails: {
    bank: {
      bankName: "Bank of Ceylon",
      branch: "Urubokka",
      accountNumber: "91653327",
      accountName: "P k Abesinghe"
    },
    binance: {
      binanceId: "521745199",
      payMethod: "Binance Pay / USDT"
    },
    skrill: {
      email: "prashankavinda200207@gmail.com"
    }
  },

  // Official Social Media & Community Links
  socials: {
    facebook: "https://web.facebook.com/profile.php?id=61585815602168",
    tiktok: "https://www.tiktok.com/@rv_forex",
    whatsappChannel: "https://whatsapp.com/channel/0029VbBeQltHgZWUAxtv252k",
    whatsappGroups: [
      { name: "WhatsApp Group 01", link: "https://chat.whatsapp.com/LTl2OEZtbWn9PQiQiuNXLm", tag: "Market Structure & SMC" },
      { name: "WhatsApp Group 02", link: "https://chat.whatsapp.com/IVk5ACechIK4L13TLB6jAf", tag: "Order Blocks & FVG" },
      { name: "WhatsApp Group 03", link: "https://chat.whatsapp.com/K6GEt8UXTXxJ4x99SshLll", tag: "Live Session Setups" },
      { name: "WhatsApp Group 04", link: "https://chat.whatsapp.com/DBJtFR4ivsP3WoxZmWWpZ0", tag: "Gold & Indices" },
      { name: "WhatsApp Group 05", link: "https://chat.whatsapp.com/E9kKqh8UA9sE3RdL2w1ZVe", tag: "Crypto & Scalping" }
    ]
  }
};

window.SUPABASE_CONFIG = SUPABASE_CONFIG;
