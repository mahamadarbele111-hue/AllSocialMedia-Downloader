import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, Youtube, Ghost, Twitter,
  Facebook, Clipboard, CheckCircle, Loader2, FileVideo, 
  FileAudio, Clock, Trash2, Activity, ImageIcon, 
  AlertTriangle, X, Zap, Download, Sun, Moon, Copy, Share2, RefreshCw, Wifi, WifiOff, MessageCircle
} from 'lucide-react';
import axios from 'axios';

/* ── TikTok SVG Icon ── */
const TikTokIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z"/>
  </svg>
);


/* ═══════════════════════════════════════════════
   SOFT UI GLOBAL STYLES  (light + dark)
═══════════════════════════════════════════════ */
const softStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── LIGHT ── */
  :root {
    --bg:       #e8edf2;
    --card:     #e8edf2;
    --shadow-l: #ffffff;
    --shadow-d: #c5cdd8;
    --primary:  #ff6b35;
    --primary2: #ff8c5a;
    --text:     #4a5568;
    --text-sub: #8896a5;
    --white:    #ffffff;
  }

  /* ── DARK ── */
  [data-theme="dark"] {
    --bg:       #1a1f2e;
    --card:     #1e2436;
    --shadow-l: #252b3d;
    --shadow-d: #12151f;
    --primary:  #ff6b35;
    --primary2: #ff8c5a;
    --text:     #e2e8f0;
    --text-sub: #6b7a99;
    --white:    #ffffff;
  }

  body {
    background: var(--bg);
    font-family: 'Nunito', sans-serif;
    color: var(--text);
    min-height: 100vh;
    transition: background 0.4s ease, color 0.4s ease;
  }

  .neu {
    background: var(--card);
    box-shadow: 8px 8px 18px var(--shadow-d), -8px -8px 18px var(--shadow-l);
    border-radius: 20px;
    transition: background 0.4s ease, box-shadow 0.4s ease;
  }
  .neu-sm {
    background: var(--card);
    box-shadow: 4px 4px 10px var(--shadow-d), -4px -4px 10px var(--shadow-l);
    border-radius: 14px;
    transition: background 0.4s ease, box-shadow 0.4s ease;
  }
  .neu-inset {
    background: var(--card);
    box-shadow: inset 5px 5px 12px var(--shadow-d), inset -5px -5px 12px var(--shadow-l);
    border-radius: 14px;
    transition: background 0.4s ease, box-shadow 0.4s ease;
  }
  .neu-btn {
    background: var(--card);
    box-shadow: 5px 5px 12px var(--shadow-d), -5px -5px 12px var(--shadow-l);
    border-radius: 14px;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    color: var(--text);
  }
  .neu-btn:hover { box-shadow: 3px 3px 8px var(--shadow-d), -3px -3px 8px var(--shadow-l); }
  .neu-btn:active { box-shadow: inset 3px 3px 8px var(--shadow-d), inset -3px -3px 8px var(--shadow-l); }

  /* ── Keyboard feel for all clickable elements ── */
  button:active, a.dl-video-btn:active, a.dl-audio-btn:active {
    transform: scale(0.97) translateY(1px) !important;
    transition: transform 0.07s ease !important;
  }
  button:not(:active), a.dl-video-btn:not(:active), a.dl-audio-btn:not(:active) {
    transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease, filter 0.15s ease !important;
  }

  .logo-title {
    font-size: 3rem;
    font-weight: 900;
    color: var(--text);
    letter-spacing: -1px;
    line-height: 1;
    transition: color 0.4s ease;
  }
  .logo-title sup {
    font-size: 1.2rem;
    color: var(--primary);
    font-weight: 900;
    vertical-align: super;
    margin-left: 2px;
  }

  .platform-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-sub);
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .platform-btn.active {
    color: var(--white);
    box-shadow: inset 3px 3px 8px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.08);
  }
  .platform-btn:hover:not(.active) { color: var(--text); }
  .platform-btn:active {
    transform: scale(0.95) !important;
    box-shadow: inset 3px 3px 8px var(--shadow-d), inset -3px -3px 8px var(--shadow-l) !important;
  }

  .neu-input {
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    width: 100%;
    transition: color 0.4s ease;
  }
  .neu-input::placeholder { color: var(--text-sub); }

  .dl-video-btn {
    background: linear-gradient(135deg, var(--primary), var(--primary2));
    color: white;
    border: none;
    border-radius: 14px;
    padding: 14px 20px;
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.05em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 5px 5px 15px rgba(255,107,53,0.4), -3px -3px 8px rgba(255,255,255,0.1), 0 0 0 rgba(255,107,53,0);
    transition: all 0.2s ease;
    text-decoration: none;
    width: 100%;
    position: relative;
    overflow: hidden;
    animation: btnGlow 2.5s ease-in-out infinite;
  }
  .dl-video-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
    animation: shimmer 2.5s ease-in-out infinite;
    pointer-events: none;
  }
  .dl-video-btn:hover {
    box-shadow: 4px 4px 20px rgba(255,107,53,0.65), -3px -3px 10px rgba(255,255,255,0.15), 0 0 30px rgba(255,107,53,0.3);
    transform: translateY(-2px) scale(1.01);
    filter: brightness(1.08);
  }
  .dl-video-btn:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: inset 3px 3px 8px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.05);
    filter: brightness(0.95);
  }
  @keyframes shimmer {
    0%   { left: -100%; opacity: 0; }
    20%  { opacity: 1; }
    60%  { left: 160%; opacity: 0; }
    100% { left: 160%; opacity: 0; }
  }
  @keyframes btnGlow {
    0%,100% { box-shadow: 5px 5px 15px rgba(255,107,53,0.4), -3px -3px 8px rgba(255,255,255,0.1); }
    50%      { box-shadow: 5px 5px 22px rgba(255,107,53,0.65), -3px -3px 8px rgba(255,255,255,0.15), 0 0 18px rgba(255,107,53,0.25); }
  }

  .dl-audio-btn {
    background: var(--card);
    color: var(--primary);
    border: none;
    border-radius: 14px;
    padding: 14px 20px;
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.05em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 5px 5px 12px var(--shadow-d), -5px -5px 12px var(--shadow-l);
    transition: all 0.2s ease;
    text-decoration: none;
    width: 100%;
  }
  .dl-audio-btn:hover { transform: translateY(-2px); box-shadow: 6px 6px 14px var(--shadow-d), -6px -6px 14px var(--shadow-l); }
  .dl-audio-btn:active { transform: scale(0.97) translateY(1px); box-shadow: inset 3px 3px 8px var(--shadow-d), inset -3px -3px 8px var(--shadow-l); }

  .badge-online {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--card);
    box-shadow: 4px 4px 10px var(--shadow-d), -4px -4px 10px var(--shadow-l);
    border-radius: 30px;
    padding: 6px 14px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-sub);
    transition: background 0.4s ease, box-shadow 0.4s ease;
  }

  .thumb-wrap {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 6px 6px 16px var(--shadow-d), -6px -6px 16px var(--shadow-l);
  }

  /* ── Skeleton Loading ── */
  .skeleton {
    background: linear-gradient(90deg, var(--shadow-d) 25%, var(--shadow-l) 50%, var(--shadow-d) 75%);
    background-size: 200% 100%;
    animation: skeletonShimmer 1.4s ease infinite;
    border-radius: 10px;
  }
  @keyframes skeletonShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── PWA install banner ── */
  .pwa-banner {
    background: var(--card);
    box-shadow: 4px 4px 10px var(--shadow-d), -4px -4px 10px var(--shadow-l);
    border-radius: 16px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 11px;
    font-weight: 800;
    color: var(--text-sub);
  }

  /* ── Offline banner ── */
  .offline-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: #e53e3e;
    color: white;
    text-align: center;
    padding: 8px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .online-bar {
    background: #48bb78;
  }

  /* ── Theme Toggle ── */
  .theme-toggle {
    width: 54px;
    height: 28px;
    background: var(--card);
    box-shadow: 4px 4px 10px var(--shadow-d), -4px -4px 10px var(--shadow-l);
    border-radius: 30px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 3px;
    transition: background 0.4s ease, box-shadow 0.4s ease;
  }
  .toggle-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b35, #ff8c5a);
    box-shadow: 2px 2px 6px rgba(255,107,53,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    flex-shrink: 0;
  }
  .toggle-thumb.on { transform: translateX(26px); }

  /* ── Logo float animation ── */
  @keyframes logoFloat {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-7px); }
  }
  @keyframes logoGlow {
    0%,100% { box-shadow: 8px 8px 18px var(--shadow-d), -8px -8px 18px var(--shadow-l); }
    50%      { box-shadow: 8px 8px 18px var(--shadow-d), -8px -8px 18px var(--shadow-l), 0 0 28px rgba(255,107,53,0.25); }
  }
  .logo-wrap {
    animation: logoFloat 3s ease-in-out infinite, logoGlow 3s ease-in-out infinite;
  }

  /* ── Logo image spin on hover ── */
  .logo-img {
    transition: transform 0.7s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease;
    cursor: pointer;
  }
  .logo-img:hover {
    transform: rotate(360deg) scale(1.15);
    filter: drop-shadow(0 0 10px rgba(255,107,53,0.6));
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--shadow-d); border-radius: 10px; }

  /* ── Conic Extract Button ── */
  .extract-btn-wrap {
    position: relative;
    border-radius: 16px;
    padding: 2px;
    flex-shrink: 0;
    background: conic-gradient(from var(--angle, 0deg), var(--c1, #ff6b35), var(--c2, #ff0050), var(--c3, #ff6b35), var(--c1, #ff6b35));
    animation: conicSpin 2.5s linear infinite;
  }
  .extract-btn-wrap.loading {
    animation: conicSpin 0.8s linear infinite;
  }
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes conicSpin {
    to { --angle: 360deg; }
  }
  .extract-btn-inner {
    display: flex;
    align-items: center;
    gap: 7px;
    height: 42px;
    padding: 0 20px;
    background: var(--card);
    border: none;
    border-radius: 14px;
    color: var(--text);
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.05em;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s, transform 0.07s;
    position: relative;
    overflow: hidden;
  }
  .extract-btn-inner:active {
    transform: scale(0.96) translateY(1px);
  }
  .extract-btn-inner.loading {
    opacity: 0.75;
    cursor: not-allowed;
  }
`;

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const platforms = [
  { id: 'tiktok',    name: 'TikTok',    name_ku: 'تیکتۆک',     icon: <TikTokIcon />, color: '#ff0050' },
  { id: 'youtube',   name: 'YouTube',   name_ku: 'یوتیوب',       icon: <Youtube />,   color: '#FF0000' },
  { id: 'instagram', name: 'Instagram', name_ku: 'ئینستاگرام',   icon: <Instagram />, color: '#E1306C' },
  { id: 'facebook',  name: 'Facebook',  name_ku: 'فەیسبووک',     icon: <Facebook />,  color: '#1877F2' },
  { id: 'twitter',   name: 'Twitter/X', name_ku: 'تویتەر',       icon: <Twitter />,   color: '#1DA1F2' },
  { id: 'snapchat',  name: 'Snapchat',  name_ku: 'سناپچات',      icon: <Ghost />,     color: '#f5a623' },
];

const loadingLogs = {
  en: ["Handshake initialized...","Requesting content data...","Bypassing token security...","Parsing media stream...","Finalizing extraction..."],
  ku: ["پەیوەندی دەستپێکرا...","داتای ناوەڕۆک داواکرا...","دەربازبوون لە پاراستن...","ڕووخسارە میدیاکە پارسکرا...","کۆتایی هێنانەکە ئامادەیە..."]
};

const i18n = {
  en: {
    dir: 'ltr', langBtn: 'کوردی', systemOk: 'System Operational',
    subtitle: 'Download your videos with ease ⚡', target: 'TARGET', universal: 'Universal',
    ready: 'READY', placeholder: 'Paste link here...', extract: 'EXTRACT',
    processing: 'PROCESSING', extracted: 'SUCCESSFULLY EXTRACTED',
    dlVideo: 'DOWNLOAD VIDEO', dlImage: 'DOWNLOAD IMAGE', dlReel: 'DOWNLOAD REEL',
    dlAudio: 'MP3', noVideo: 'NO VIDEO', noImage: 'NO IMAGE', noPost: 'NO POST', noAudio: 'NO AUDIO',
    by: 'By', history: 'Recent History', clear: 'CLEAR', paste: 'Paste', openLink: 'OPEN',
    errUrl: 'Please insert URL first!', errPlatform: 'Please select a platform first!',
    errClip: 'Clipboard access denied', errServer: 'Failed to connect to server.',
    footer1: '© 2026 ARBILI. All rights reserved.', footer2: 'Powered by Save',
    selectPlatform: 'Select a platform to get started',
    darkMode: 'Dark', lightMode: 'Light',
    clearUrl: 'Clear',
    dlImage: 'DOWNLOAD IMAGE',
    dlAudio2: 'DOWNLOAD AUDIO',
    copyLink: 'COPY', share: 'SHARE', retry: 'RETRY', copied: 'COPIED!', offline: 'No Internet', online: 'Back Online',
    noTitle: 'No title available',
    duration: 'Duration',
    views: 'Views',
  },
  ku: {
    dir: 'rtl', langBtn: 'English', systemOk: 'سیستەم کار دەکات',
    subtitle: 'ڤیدیۆکانت بە ئاسانی دابەزێنە ⚡', target: 'ئامانج', universal: 'گشتی',
    ready: 'ئامادەیە', placeholder: 'لینکەکە لێرە دابنێ...', extract: 'داگرە',
    processing: 'پرۆسەکردن...', extracted: 'بە سەرکەوتوویی دەرهێنرا',
    dlVideo: 'ڤیدیۆ داگرە', dlImage: 'وێنە داگرە', dlReel: 'ریل داگرە',
    dlAudio: 'MP3 داگرە', noVideo: 'ڤیدیۆ نەدۆزرایەوە', noImage: 'وێنە نەدۆزرایەوە',
    noPost: 'پۆست نەدۆزرایەوە', noAudio: 'دەنگ نەدۆزرایەوە',
    by: 'لەلایەن', history: 'مێژووی دوایین', clear: 'سڕینەوە', paste: 'پەیست', openLink: 'کردنەوە',
    errUrl: 'تکایە لینکەکە دابنێ!', errPlatform: 'تکایە پلاتفۆرمێک هەڵبژێرە!',
    errClip: 'مەترسی: دەسترسی کلیپبۆرد نەدرا', errServer: 'پەیوەندی بە سێرڤەر سەرنەکەوت.',
    footer1: '© ٢٠٢٦ ئەربیلی. هەموو مافەکان پارێزراون.', footer2: 'کارپێکراوی Save',
    selectPlatform: 'پلاتفۆرمێک هەڵبژێرە بۆ دەستپێکردن',
    darkMode: 'تاریک', lightMode: 'ڕوناک',
    clearUrl: 'سڕینەوە',
    dlImage: 'وێنە داگرە',
    dlAudio2: 'دەنگ داگرە',
    copyLink: 'کۆپی', share: 'بەشداری', retry: 'دووبارە', copied: 'کۆپی کرا!', offline: 'ئینتەرنێت نییە', online: 'پەیوەندی گەڕایەوە',
    noTitle: 'ناونیشان نەدۆزرایەوە',
    duration: 'ماوە',
    views: 'بینراوەکان',
  }
};

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function App() {
  const [selected,     setSelected]     = useState(null);
  const [url,          setUrl]          = useState("");
  const [isLoading,    setIsLoading]    = useState(false);
  const [result,       setResult]       = useState(null);
  const [logIndex,     setLogIndex]     = useState(0);
  const [history,      setHistory]      = useState([]);
  const [notification, setNotification] = useState(null);
  const [lang,         setLang]         = useState('ku');
  const [dark,         setDark]         = useState(true);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const [copied,       setCopied]       = useState(null);   // which url was copied
  const [isOnline,     setIsOnline]     = useState(true);
  const [onlineBanner, setOnlineBanner] = useState(null);   // null | 'offline' | 'online'
  const [deferredPrompt, setDeferredPrompt] = useState(null); // PWA install

  const t    = i18n[lang];
  const logs = loadingLogs[lang];

  const activePlatform = selected ? platforms.find(p => p.id === selected) : null;
  const activeColor    = activePlatform?.color || '#ff6b35';
  const activeName     = activePlatform?.name  || t.universal;
  const endpoint       = selected ? `/api/${selected}` : '';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  // ── LocalStorage: save & restore theme + lang ──
  useEffect(() => {
    const savedDark = localStorage.getItem('arbili_dark');
    const savedLang = localStorage.getItem('arbili_lang');
    if (savedDark !== null) setDark(savedDark === 'true');
    if (savedLang)          setLang(savedLang);
  }, []);
  useEffect(() => { localStorage.setItem('arbili_dark', dark); }, [dark]);
  useEffect(() => { localStorage.setItem('arbili_lang', lang); }, [lang]);

  // ── Online / Offline detection ──
  useEffect(() => {
    const goOffline = () => { setIsOnline(false); setOnlineBanner('offline'); };
    const goOnline  = () => {
      setIsOnline(true);
      setOnlineBanner('online');
      setTimeout(() => setOnlineBanner(null), 3000);
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online',  goOnline);
    };
  }, []);

  // ── PWA install prompt ──
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // ── Typing animation for placeholder ──
  useEffect(() => {
    const full = t.placeholder;
    let i = 0;
    let timeoutId;
    setTypedPlaceholder('');

    const typeChar = () => {
      i++;
      setTypedPlaceholder(full.slice(0, i));
      if (i < full.length) {
        timeoutId = setTimeout(typeChar, 130);
      } else {
        // وەستان ٤ چرکە پێش سڕینەوە
        timeoutId = setTimeout(deleteChar, 4000);
      }
    };

    const deleteChar = () => {
      i--;
      setTypedPlaceholder(full.slice(0, i));
      if (i > 0) {
        timeoutId = setTimeout(deleteChar, 70);
      } else {
        // وەستان ٢ چرکە پێش دووبارە
        timeoutId = setTimeout(typeChar, 2000);
      }
    };

    timeoutId = setTimeout(typeChar, 800);
    return () => clearTimeout(timeoutId);
  }, [t.placeholder]);

  useEffect(() => {
    document.documentElement.dir  = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      setLogIndex(0);
      interval = setInterval(() => {
        setLogIndex(prev => prev < logs.length - 1 ? prev + 1 : prev);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLoading, logs]);

  const showNotify = (message, type = 'error', showRetry = false) => {
    setNotification({ message, type, showRetry });
    setTimeout(() => setNotification(null), 6000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      showNotify(t.errClip, "error");
    }
  };

  const addToHistory = (data) => setHistory(prev => [data, ...prev].slice(0, 3));
  const clearHistory = () => setHistory([]);

  const getDownloadLink = (type) => {
    if (!result) return null;
    if (Array.isArray(result)) {
      if (type === 'video') {
        const vid = result.find(x => x.type === 'video' || x.type === 'mp4');
        return vid ? vid.url : (result[0]?.url || null);
      }
      return null;
    }
    const list = result.formats || result.downloads || result.videoLinks || result.medias || result.downloadLinks;
    if (list && Array.isArray(list)) {
      if (type === 'video') {
        // TikTok API: prefer video_nwm (no watermark), then video_hd, then any video
        let video = list.find(item => {
          const label = String(item.text || item.label || item.quality || item.type || "").toLowerCase();
          return label === 'video_nwm' || label.includes('no_watermark') || label.includes('nowm') || label.includes('nwm');
        });
        if (!video) video = list.find(item => {
          const label = String(item.text || item.label || item.quality || item.type || "").toLowerCase();
          return label === 'video_hd' || label.includes('hd');
        });
        if (!video) video = list.find(item => {
          const label = String(item.text || item.label || item.quality || item.type || "").toLowerCase();
          const u     = String(item.url || "").toLowerCase();
          return (label.includes('video') || label.includes('mp4') || item.extension === 'mp4') && !u.includes('.m3u8') && !label.includes('audio') && !label.includes('mp3');
        });
        if (!video) video = list.find(item => item.url && String(item.url).includes('.mp4'));
        if (!video && list.length > 0) {
          const first = list[0];
          const label = String(first.label || first.type || first.text || "").toLowerCase();
          if (!label.includes('profile') && !label.includes('audio') && !label.includes('mp3')) video = first;
        }
        return video ? video.url : null;
      }
      if (type === 'audio') {
        // پێشیاری: type یان text ی ڕاستەوخۆ === 'audio'/'mp3'/'music'
        let audio = list.find(item => {
          const t = String(item.type || item.text || "").toLowerCase();
          return t === 'audio' || t === 'mp3' || t === 'music';
        });
        // fallback: هەر label یان URL کە audio/mp3 تێدابێت
        if (!audio) audio = list.find(item => {
          const label = String(item.text || item.label || item.type || item.extension || item.quality || "").toLowerCase();
          const u = String(item.url || "").toLowerCase();
          return label.includes('mp3') || label.includes('audio') || label.includes('music')
            || u.includes('.mp3');
        });
        return audio ? audio.url : null;
      }
    }
    // Array result (some APIs return array directly)
    if (Array.isArray(result)) {
      if (type === 'audio') {
        const a = result.find(x => x.type === 'audio' || x.type === 'mp3'
          || String(x.url || '').includes('.mp3') || String(x.url || '').includes('audio'));
        return a ? a.url : null;
      }
    }
    if (type === 'video') return result.videoUrl || result.download || result.video || result.url || null;
    // audio fallback — check root-level fields
    if (type === 'audio') {
      return result.audioUrl || result.audio || result.mp3 || result.music
        || result.musicUrl || result.sound || result.soundUrl || null;
    }
    return null;
  };

  const getButtonConfig = () => {
    const videoLink = getDownloadLink('video');
    const isImage   = videoLink && /\.(jpg|webp|png)/i.test(String(videoLink));
    if (selected === 'instagram') return { label: isImage ? t.dlImage : t.dlReel, icon: isImage ? <ImageIcon size={14} /> : <Instagram size={14} />, noData: t.noPost };
    if (selected === 'tiktok')    return { label: t.dlVideo, icon: <FileVideo size={14} />, noData: t.noVideo };
    return { label: t.dlVideo, icon: <FileVideo size={14} />, noData: t.noVideo };
  };

  const btnConfig       = getButtonConfig();
  const primaryLink     = getDownloadLink('video');
  const imageLink       = (() => {
    if (!result) return null;
    const list = result.formats || result.downloads || result.medias || result.downloadLinks;
    if (list && Array.isArray(list)) {
      const img = list.find(item => {
        const u = String(item.url || '').toLowerCase();
        const l = String(item.label || item.type || item.extension || '').toLowerCase();
        return l.includes('image') || l.includes('photo') || l.includes('cover') || /\.(jpg|jpeg|png|webp)/.test(u);
      });
      return img ? img.url : null;
    }
    return result?.cover || result?.image || result?.thumbnail || null;
  })();
  const showAudioButton = selected !== 'instagram';
  const showImageButton = selected === 'tiktok';

  const handleCopy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  const handleShare = async (url, title) => {
    if (navigator.share) {
      try { await navigator.share({ title: title || 'Save+', url }); } catch {}
    } else {
      handleCopy(url, 'share');
    }
  };

  const handlePWAInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const handleExtract = async () => {
    if (!url)      return showNotify(t.errUrl, "error");
    if (!selected) return showNotify(t.errPlatform, "error");
    setIsLoading(true); setResult(null);
    try {
      const response = await axios.post(endpoint, { url });
      setResult(response.data);
      addToHistory(response.data);
    } catch (error) {
      let msg = t.errServer;
      if (error.response?.data) {
        const d = error.response.data;
        msg = d.message || d.error || d.details || JSON.stringify(d);
        if (typeof msg === 'object') msg = JSON.stringify(msg);
      } else if (error.message) {
        msg = error.message;
      }
      showNotify(`ERROR: ${msg.substring(0, 100)}`, "error", true);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── RENDER ── */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: softStyles }} />

      <div style={{ minHeight: '100vh', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg)', transition: 'background 0.4s ease' }}>

        {/* ── NOTIFICATION ── */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              style={{ position: 'fixed', top: 20, left: 0, right: 0, margin: '0 auto', width: '90%', maxWidth: 420, zIndex: 100 }}
            >
              <div className="neu" style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 12, borderLeft: `4px solid ${notification.type === 'error' ? '#e53e3e' : '#ff6b35'}` }}>
                <AlertTriangle size={18} color={notification.type === 'error' ? '#e53e3e' : '#ff6b35'} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', flex: 1 }}>{notification.message}</p>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {notification.showRetry && (
                    <button onClick={() => { setNotification(null); handleExtract(); }} className="neu-btn" style={{ padding: '6px 10px', fontSize: 10, fontWeight: 800, color: '#ff6b35', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RefreshCw size={12} /> {t.retry}
                    </button>
                  )}
                  <button onClick={() => setNotification(null)} className="neu-btn" style={{ padding: 6 }}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 36, width: '100%', maxWidth: 680 }}
        >
          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'nowrap', overflowX: 'auto', padding: '0 4px' }}>
            <span className="badge-online">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#48bb78', display: 'inline-block' }} />
              {t.systemOk}
            </span>

            {/* Lang toggle */}
            <button
              onClick={() => setLang(l => l === 'ku' ? 'en' : 'ku')}
              className="neu-btn"
              style={{ padding: '6px 14px', fontSize: 11, fontWeight: 800, color: '#ff6b35', borderRadius: 30 }}
            >
              {t.langBtn}
            </button>

            {/* ── Dark / Light toggle ── */}
            <button
              className="neu-btn"
              onClick={() => setDark(d => !d)}
              style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 800, color: dark ? '#a0b0cc' : '#ff6b35', borderRadius: 30 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.span key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
                    <Moon size={14} />
                  </motion.span>
                ) : (
                  <motion.span key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
                    <Sun size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
              <span>{dark ? t.darkMode : t.lightMode}</span>
            </button>
          </div>

          {/* ── Logo (floats + image spins on hover) ── */}
          <div className="neu logo-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '18px 36px', marginBottom: 16, borderRadius: 28 }}>
            <img
              src="/logo.png"
              alt="logo"
              className="logo-img"
              style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <h1 className="logo-title">Save<sup>+</sup></h1>
          </div>

          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-sub)', marginTop: 12 }}>
            {t.subtitle}
          </p>
        </motion.header>

        {/* ── PLATFORM GRID ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ width: '100%', maxWidth: 760, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, marginBottom: 28 }}
        >
          {platforms.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSelected(p.id); setResult(null); }}
              className={`neu-sm platform-btn ${selected === p.id ? 'active' : ''}`}
              style={selected === p.id ? { background: p.color, color: '#fff', boxShadow: `4px 4px 12px ${p.color}55, -2px -2px 8px rgba(255,255,255,0.1)` } : {}}
            >
              <span style={{ color: selected === p.id ? '#fff' : p.color, display: 'flex' }}>
                {React.cloneElement(p.icon, { size: 16 })}
              </span>
              <span style={{ fontSize: 10, fontWeight: 800 }}>{lang === 'ku' ? p.name_ku : p.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {!selected && (
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sub)', marginBottom: 12, opacity: 0.7 }}>
            ↑ {t.selectPlatform}
          </p>
        )}

        {/* ── INPUT AREA ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ width: '100%', maxWidth: 680, marginBottom: 24 }}
        >
          <div className="neu" style={{ padding: 20, borderRadius: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-sub)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeColor, display: 'inline-block' }} />
                {t.target}: <span style={{ color: activeColor }}>{activeName}</span>
              </span>
              <span style={{ color: isLoading ? '#ff6b35' : 'var(--text-sub)' }}>
                {isLoading ? `> ${logs[logIndex]}` : t.ready}
              </span>
            </div>

            {/* ── URL input row ── */}
            <div className="neu-inset" style={{ display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6, height: 50, marginBottom: 12 }}>
              <input
                className="neu-input"
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExtract()}
                placeholder={url ? '' : typedPlaceholder}
                style={{ height: 50, flex: 1, minWidth: 0, fontSize: 13 }}
              />
              {url && (
                <button
                  onClick={() => setUrl('')}
                  className="neu-btn"
                  title={t.clearUrl}
                  style={{ padding: '5px 7px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                >
                  <X size={13} color="#e53e3e" />
                </button>
              )}
              <div style={{ width: 1, height: 22, background: 'var(--shadow-d)', flexShrink: 0, opacity: 0.5 }} />
              <button onClick={handlePaste} className="neu-btn" title={t.paste} style={{ padding: '7px 10px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 800, color: 'var(--text-sub)' }}>
                <Clipboard size={15} color="var(--text-sub)" />
                <span style={{ fontSize: 10 }}>{t.paste}</span>
              </button>
            </div>

            {/* ── Extract button full width ── */}
            <div
              className={`extract-btn-wrap ${isLoading ? 'loading' : ''}`}
              style={{ '--c1': activeColor, '--c2': activeColor + 'aa', '--c3': '#ffffff44', width: '100%' }}
            >
              <button
                className={`extract-btn-inner ${isLoading ? 'loading' : ''}`}
                onClick={handleExtract}
                disabled={isLoading}
                style={{ color: activeColor, width: '100%', justifyContent: 'center', height: 46 }}
              >
                {isLoading
                  ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite', color: activeColor }} />
                  : <Zap size={15} color={activeColor} />
                }
                {isLoading ? t.processing : t.extract}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── SKELETON while loading ── */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ width: '100%', maxWidth: 680, marginBottom: 24 }}
          >
            <div className="neu" style={{ padding: 20, borderRadius: 24 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div className="skeleton" style={{ width: 120, height: 120, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 16, width: '80%' }} />
                  <div className="skeleton" style={{ height: 12, width: '50%' }} />
                  <div className="skeleton" style={{ height: 12, width: '35%' }} />
                  <div className="skeleton" style={{ height: 44, width: '100%', marginTop: 8 }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ width: '100%', maxWidth: 680, marginBottom: 24 }}
            >
              <div className="neu" style={{ padding: 20, borderRadius: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#48bb78' }}>
                  <CheckCircle size={14} /> {t.extracted}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
                  {result.thumbnail && (
                    <div className="thumb-wrap" style={{ width: 120, height: 120, flexShrink: 0 }}>
                      <img src={result.thumbnail} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      {/* Title — try multiple possible field names */}
                      <h3 style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', marginBottom: 6, lineHeight: 1.5 }}>
                        {result.title || result.caption || result.description || result.videoTitle || result.name || result.text || t.noTitle}
                      </h3>
                      {/* Author */}
                      {(result.author || result.uploader || result.channel || result.username || result.creator || result.nickname) && (
                        <p style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeColor, display: 'inline-block', flexShrink: 0 }} />
                          {result.author || result.uploader || result.channel || result.username || result.creator || result.nickname}
                        </p>
                      )}
                      {/* Duration + views row */}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 2 }}>
                        {(result.duration || result.duration_string) && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-sub)', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                            ⏱ {result.duration_string || result.duration}
                          </span>
                        )}
                        {(result.view_count || result.views || result.playCount) && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-sub)', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                            👁 {Number(result.view_count || result.views || result.playCount).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* Video button + Copy + Share */}
                      {primaryLink ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <a href={primaryLink} target="_blank" rel="noreferrer" className="dl-video-btn" style={{ flex: 1 }}>
                            <Download size={14} /> {btnConfig.label}
                          </a>
                          <button onClick={() => handleCopy(primaryLink, 'video')} className="neu-btn" title={t.copyLink}
                            style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: copied === 'video' ? '#48bb78' : activeColor, flexShrink: 0, height: '100%', minHeight: 46 }}>
                            {copied === 'video' ? <CheckCircle size={14} /> : <Copy size={14} />}
                          </button>
                          {typeof navigator !== 'undefined' && navigator.share && (
                            <button onClick={() => handleShare(primaryLink, result?.title)} className="neu-btn" title={t.share}
                              style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: activeColor, flexShrink: 0, height: '100%', minHeight: 46 }}>
                              <Share2 size={14} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <button disabled className="dl-video-btn" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                          {btnConfig.icon} {btnConfig.noData}
                        </button>
                      )}
                      {/* TikTok: image + audio row */}
                      {(showImageButton || (showAudioButton && getDownloadLink('audio'))) && (
                        <div style={{ display: 'grid', gridTemplateColumns: showImageButton && (showAudioButton && getDownloadLink('audio')) ? '1fr 1fr' : '1fr', gap: 8 }}>
                          {showImageButton && imageLink && (
                            <a href={imageLink} target="_blank" rel="noreferrer" className="dl-audio-btn" style={{ color: '#E1306C' }}>
                              <ImageIcon size={14} /> {t.dlImage}
                            </a>
                          )}
                          {showAudioButton && getDownloadLink('audio') && (
                            <a href={getDownloadLink('audio')} target="_blank" rel="noreferrer" className="dl-audio-btn">
                              <FileAudio size={14} /> {t.dlAudio}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HISTORY ── */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ width: '100%', maxWidth: 680, marginBottom: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingInline: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={12} /> {t.history}
                </span>
                <button onClick={clearHistory} className="neu-btn" style={{ padding: '5px 12px', fontSize: 10, fontWeight: 800, color: '#e53e3e', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Trash2 size={10} /> {t.clear}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {history.map((item, idx) => (
                  <motion.div key={idx} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className="neu-sm" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div className="neu-btn" style={{ padding: 8 }}>
                      <Activity size={14} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{ fontWeight: 800, fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                      {item.author && <p style={{ fontSize: 10, color: 'var(--text-sub)', fontWeight: 600 }}>{t.by} {item.author}</p>}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', background: 'rgba(255,107,53,0.1)', padding: '4px 10px', borderRadius: 8 }}>{t.openLink}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER ── */}
        <footer style={{ textAlign: 'center', paddingBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: 4 }}>
            {t.footer1}
          </p>
          <p style={{ fontSize: 9, color: 'var(--text-sub)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14 }}>
            {t.footer2} <sup style={{ color: '#ff6b35', fontSize: '0.7em' }}>+</sup>
          </p>
          {/* ── WhatsApp Feedback Footer ── */}
          <a
            href="https://wa.me/9647511060708"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#25D366', textDecoration: 'none', opacity: 0.75, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {lang === 'ku' ? 'فیدباک بنێرە' : 'Send Feedback'}
          </a>
        </footer>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
