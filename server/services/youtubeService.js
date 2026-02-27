const axios = require("axios");

// ── یارمەتی: چوارچێوەی ماوە دروست بکە (PT4M13S → 4:13)
function formatDuration(iso) {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

// ── یارمەتی: ژمارەی بینەر جوان بکە (1234567 → 1.2M)
function formatViews(n) {
  if (!n) return null;
  const num = parseInt(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

// ── یارمەتی: بەروار جوان بکە
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("ku", { year:"numeric", month:"long", day:"numeric" });
}

async function fetchYouTubeData(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Link YouTube harus diisi");
  }

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
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  };

  // ── بەشی ID ڤیدیۆ لە URL دەرببە
  const videoId = url.match(/(?:v=|youtu\.be\/|shorts\/)([^&\n?#]+)/)?.[1];

  // ==========================================
  // 1. YouTube oEmbed API (بەخۆڕایی - key پێویست نیە)
  // ==========================================
  if (videoId) {
    try {
      const { data: oembed } = await axios.get(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { timeout: 8000 }
      );
      if (oembed.title) videoTitle = oembed.title;
      if (oembed.author_name) videoAuthor = oembed.author_name;
      if (oembed.thumbnail_url) videoThumbnail = oembed.thumbnail_url;
    } catch (err) {
      console.warn("[oEmbed] failed:", err.message);
    }
  }

  // ==========================================
  // 2. YouTube noembed (views + duration + date)
  // ==========================================
  if (videoId) {
    try {
      const { data: noe } = await axios.get(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
        { timeout: 8000 }
      );
      if (noe.title && videoTitle === "YouTube Media") videoTitle = noe.title;
      if (noe.author_name && videoAuthor === "YouTube") videoAuthor = noe.author_name;
    } catch(e) {}
  }

  // ==========================================
  // 3. YouTube Data API v3 (views + duration + date)
  //    ئەگەر YOUTUBE_API_KEY لە .env هەیە
  // ==========================================
  if (videoId && process.env.YOUTUBE_API_KEY) {
    try {
      const { data: ytApi } = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            id: videoId,
            part: "snippet,statistics,contentDetails",
            key: process.env.YOUTUBE_API_KEY
          },
          timeout: 8000
        }
      );
      const item = ytApi.items?.[0];
      if (item) {
        videoTitle     = item.snippet.title || videoTitle;
        videoAuthor    = item.snippet.channelTitle || videoAuthor;
        videoThumbnail = item.snippet.thumbnails?.high?.url || videoThumbnail;
        videoDuration  = formatDuration(item.contentDetails?.duration);
        videoViews     = formatViews(item.statistics?.viewCount);
        videoDate      = formatDate(item.snippet?.publishedAt);
      }
    } catch (err) {
      console.warn("[YouTube API v3] failed:", err.message);
    }
  }

  // ==========================================
  // 4. EKSTRAK VIDEO (MP4) - Puruboy
  // ==========================================
  try {
    const { data: videoData } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/youtube",
      { url },
      { headers, timeout: 20000 }
    );
    const resultVideo = videoData.result || videoData.data;
    if (resultVideo && resultVideo.downloadUrl) {
      if (videoTitle === "YouTube Media") videoTitle = resultVideo.title || videoTitle;
      if (!videoThumbnail) videoThumbnail = resultVideo.thumbnail;
      if (videoAuthor === "YouTube") videoAuthor = resultVideo.author || videoData.author || videoAuthor;
      formats.push({
        type: "video",
        quality: resultVideo.quality || "HD",
        extension: "mp4",
        url: resultVideo.downloadUrl,
      });
    }
  } catch (err) {
    console.error("[VIDEO ERROR]", err.message);
  }

  // ==========================================
  // 5. EKSTRAK AUDIO (MP3)
  // ==========================================
  try {
    const { data: audioData } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/ytmp3",
      { url },
      { headers, timeout: 20000 }
    );
    const resultAudio = audioData.result || audioData.data || audioData;
    const audioLink = resultAudio?.download_url || resultAudio?.downloadUrl || resultAudio?.url || resultAudio?.link || resultAudio?.media;
    if (audioLink) {
      formats.push({ type: "audio", quality: "128kbps", extension: "mp3", url: audioLink });
    }
  } catch (err) {
    console.error("[AUDIO ERROR]", err.message);
  }

  if (formats.length === 0) {
    throw new Error("Gagal mengekstrak Video dan Audio. Server pusat mungkin sedang penuh.");
  }

  return {
    title: videoTitle,
    thumbnail: videoThumbnail,
    author: videoAuthor,
    duration: videoDuration,
    views: videoViews,
    date: videoDate,
    formats,
  };
}

module.exports = { fetchYouTubeData };
