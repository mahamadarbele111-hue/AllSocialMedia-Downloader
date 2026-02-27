import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Instagram, Youtube, Ghost, Twitter,
  Facebook, Clipboard, CheckCircle, Loader2, FileVideo, 
  FileAudio, Clock, Trash2, Activity, ImageIcon, 
  AlertTriangle, X, Zap, Download, Sun, Moon
} from 'lucide-react';
import axios from 'axios';

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
`;

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const platforms = [
  { id: 'tiktok',    name: 'TikTok',    name_ku: 'تیکتۆک',     icon: <Music />,     color: '#ff0050' },
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
    subtitle: 'ARBILI DOWNLOADER', target: 'TARGET', universal: 'Universal',
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
  },
  ku: {
    dir: 'rtl', langBtn: 'English', systemOk: 'سیستەم کار دەکات',
    subtitle: 'داگرتنی ئەربیلی', target: 'ئامانج', universal: 'گشتی',
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
  const [dark,         setDark]         = useState(false);

  const t    = i18n[lang];
  const logs = loadingLogs[lang];

  const activePlatform = selected ? platforms.find(p => p.id === selected) : null;
  const activeColor    = activePlatform?.color || '#ff6b35';
  const activeName     = activePlatform?.name  || t.universal;
  const endpoint       = selected ? `/api/${selected}` : '';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

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

  const showNotify = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
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
        let video = list.find(item => {
          const label = String(item.text || item.label || item.quality || "").toLowerCase();
          const u     = String(item.url || "").toLowerCase();
          return (label.includes('video') || label.includes('mp4') || item.extension === 'mp4') && !u.includes('.m3u8');
        });
        if (!video) video = list.find(item => item.url && String(item.url).includes('.mp4'));
        if (!video && list.length > 0) {
          const first = list[0];
          const label = String(first.label || first.type || "").toLowerCase();
          if (!label.includes('profile') && !label.includes('audio')) video = first;
        }
        return video ? video.url : null;
      }
      if (type === 'audio') {
        const audio = list.find(item => {
          const label = String(item.text || item.label || item.type || item.extension || "").toLowerCase();
          return label.includes('mp3') || label.includes('audio') || label.includes('music');
        });
        return audio ? audio.url : null;
      }
    }
    if (type === 'video') return result.videoUrl || result.download || result.video || result.url || null;
    return null;
  };

  const getButtonConfig = () => {
    const videoLink = getDownloadLink('video');
    const isImage   = videoLink && /\.(jpg|webp|png)/i.test(String(videoLink));
    if (selected === 'instagram') return { label: isImage ? t.dlImage : t.dlReel, icon: isImage ? <ImageIcon size={14} /> : <Instagram size={14} />, noData: t.noPost };
    return { label: t.dlVideo, icon: <FileVideo size={14} />, noData: t.noVideo };
  };

  const btnConfig       = getButtonConfig();
  const primaryLink     = getDownloadLink('video');
  const showAudioButton = selected !== 'instagram';

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
      showNotify(`ERROR: ${msg.substring(0, 100)}`, "error");
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
                <button onClick={() => setNotification(null)} className="neu-btn" style={{ padding: 6 }}>
                  <X size={14} />
                </button>
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
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

          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-sub)', marginTop: 12 }}>
            — &nbsp; {t.subtitle} &nbsp; —
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

            <div style={{ display: 'flex', gap: 10 }}>
              <div className="neu-inset" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
                <input
                  className="neu-input"
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleExtract()}
                  placeholder={t.placeholder}
                  style={{ height: 48 }}
                />
                <button onClick={handlePaste} className="neu-btn" title={t.paste} style={{ padding: '8px 10px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 800, color: 'var(--text-sub)' }}>
                  <Clipboard size={16} color="var(--text-sub)" />
                  <span style={{ fontSize: 10 }}>{t.paste}</span>
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleExtract}
                disabled={isLoading}
                style={{
                  height: 48, padding: '0 24px',
                  background: `linear-gradient(135deg, ${activeColor}, #ff8c5a)`,
                  border: 'none', borderRadius: 14, color: '#fff',
                  fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 900,
                  letterSpacing: '0.05em', cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: `4px 4px 14px ${activeColor}55, -3px -3px 8px rgba(255,255,255,0.1)`,
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} />}
                {isLoading ? t.processing : t.extract}
              </motion.button>
            </div>
          </div>
        </motion.div>

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
                      <h3 style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', marginBottom: 4, lineHeight: 1.4 }}>{result.title}</h3>
                      {result.author && <p style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 700 }}>{t.by} {result.author}</p>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: showAudioButton && getDownloadLink('audio') ? '1fr 1fr' : '1fr', gap: 10 }}>
                      {primaryLink ? (
                        <a href={primaryLink} target="_blank" rel="noreferrer" className="dl-video-btn">
                          <Download size={14} /> {btnConfig.label}
                        </a>
                      ) : (
                        <button disabled className="dl-video-btn" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                          {btnConfig.icon} {btnConfig.noData}
                        </button>
                      )}
                      {showAudioButton && getDownloadLink('audio') && (
                        <a href={getDownloadLink('audio')} target="_blank" rel="noreferrer" className="dl-audio-btn">
                          <FileAudio size={14} /> {t.dlAudio}
                        </a>
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
        <footer style={{ textAlign: 'center', paddingBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: 4 }}>
            {t.footer1}
          </p>
          <p style={{ fontSize: 9, color: 'var(--text-sub)', fontWeight: 600, letterSpacing: '0.1em' }}>
            {t.footer2} <sup style={{ color: '#ff6b35', fontSize: '0.7em' }}>+</sup>
          </p>
        </footer>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
