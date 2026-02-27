const axios = require("axios");

function formatDuration(secs) {
  if (!secs) return null;
  const s = parseInt(secs);
  if (isNaN(s)) return null;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

function formatDurationISO(iso) {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function formatViews(n) {
  if (!n) return null;
  const num = parseInt(n);
  if (isNaN(num)) return null;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("ku", { year:"numeric", month:"long", day:"numeric" });
}

async function fetchYouTubeData(url) {
  if (!url || typeof url !== "string") throw new Error("Link YouTube harus diisi");

  const formats = [];
  let videoTitle = "YouTube Media";
  let videoThumbnail = null;
  let videoAuthor = "YouTube";
  let videoDuration = null;
  let videoViews = null;
  let videoDate = null;

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  };

  const videoId = url.match(/(?:v=|youtu\.be\/|shorts\/)([^&\n?#]+)/)?.[1];

  // ══════════════════════════════════════════
  // 1. oEmbed — title, author, thumbnail
  // ══════════════════════════════════════════
  if (videoId) {
    try {
      const { data } = await axios.get(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { timeout: 8000 }
      );
      if (data.title) videoTitle = data.title;
      if (data.author_name) videoAuthor = data.author_name;
      if (data.thumbnail_url) videoThumbnail = data.thumbnail_url;
    } catch (e) { console.warn("[oEmbed]", e.message); }
  }

  // ══════════════════════════════════════════
  // 2. Youtubei.js API (بەخۆڕایی — views + duration + date)
  // ══════════════════════════════════════════
  if (videoId) {
    try {
      const { data } = await axios.get(
        `https://yt.lemnoslife.com/noKey/videos?part=statistics,contentDetails,snippet&id=${videoId}`,
        { timeout: 10000 }
      );
      const item = data?.items?.[0];
      if (item) {
        if (!videoDuration) videoDuration = formatDurationISO(item.contentDetails?.duration);
        if (!videoViews) videoViews = formatViews(item.statistics?.viewCount);
        if (!videoDate) videoDate = formatDate(item.snippet?.publishedAt);
        if (videoTitle === "YouTube Media") videoTitle = item.snippet?.title || videoTitle;
        if (videoAuthor === "YouTube") videoAuthor = item.snippet?.channelTitle || videoAuthor;
        if (!videoThumbnail) videoThumbnail = item.snippet?.thumbnails?.high?.url;
      }
    } catch (e) { console.warn("[lemnoslife]", e.message); }
  }

  // ══════════════════════════════════════════
  // 3. yt-api.p.rapidapi.com (بەخۆڕایی — backup)
  // ══════════════════════════════════════════
  if (videoId && (!videoDuration || !videoViews)) {
    try {
      const { data } = await axios.get(
        `https://youtube-v31.p.rapidapi.com/videos?part=contentDetails,statistics&id=${videoId}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "SIGN-UP-FOR-FREE-KEY",
            "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com"
          },
          timeout: 8000
        }
      );
      const item = data?.items?.[0];
      if (item) {
        if (!videoDuration) videoDuration = formatDurationISO(item.contentDetails?.duration);
        if (!videoViews) videoViews = formatViews(item.statistics?.viewCount);
      }
    } catch (e) { console.warn("[RapidAPI]", e.message); }
  }

  // ══════════════════════════════════════════
  // 4. YouTube Data API v3 (ئەگەر KEY هەیە)
  // ══════════════════════════════════════════
  if (videoId && process.env.YOUTUBE_API_KEY && (!videoDuration || !videoViews)) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        { params: { id: videoId, part: "snippet,statistics,contentDetails", key: process.env.YOUTUBE_API_KEY }, timeout: 8000 }
      );
      const item = data.items?.[0];
      if (item) {
        videoTitle     = item.snippet.title || videoTitle;
        videoAuthor    = item.snippet.channelTitle || videoAuthor;
        videoThumbnail = item.snippet.thumbnails?.high?.url || videoThumbnail;
        videoDuration  = formatDurationISO(item.contentDetails?.duration);
        videoViews     = formatViews(item.statistics?.viewCount);
        videoDate      = formatDate(item.snippet?.publishedAt);
      }
    } catch (e) { console.warn("[YouTube API v3]", e.message); }
  }

  // ══════════════════════════════════════════
  // 5. Puruboy — لینکی داگرتن
  // ══════════════════════════════════════════
  try {
    const { data: videoData } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/youtube",
      { url }, { headers, timeout: 20000 }
    );
    const r = videoData.result || videoData.data;
    if (r?.downloadUrl) {
      if (videoTitle === "YouTube Media") videoTitle = r.title || videoTitle;
      if (!videoThumbnail) videoThumbnail = r.thumbnail;
      if (videoAuthor === "YouTube") videoAuthor = r.author || videoData.author || videoAuthor;
      // ── duration لە Puruboy ئەگەر بەردەستە
      if (!videoDuration && r.duration) videoDuration = formatDuration(r.duration);
      formats.push({ type:"video", quality: r.quality || "HD", extension:"mp4", url: r.downloadUrl });
    }
  } catch (e) { console.error("[VIDEO ERROR]", e.message); }

  // ══════════════════════════════════════════
  // 6. Puruboy — MP3
  // ══════════════════════════════════════════
  try {
    const { data: audioData } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/ytmp3",
      { url }, { headers, timeout: 20000 }
    );
    const r = audioData.result || audioData.data || audioData;
    const audioLink = r?.download_url || r?.downloadUrl || r?.url || r?.link || r?.media;
    if (audioLink) formats.push({ type:"audio", quality:"128kbps", extension:"mp3", url: audioLink });
  } catch (e) { console.error("[AUDIO ERROR]", e.message); }

  if (formats.length === 0) throw new Error("Gagal mengekstrak Video dan Audio.");

  return { title: videoTitle, thumbnail: videoThumbnail, author: videoAuthor, duration: videoDuration, views: videoViews, date: videoDate, formats };
}

module.exports = { fetchYouTubeData };
