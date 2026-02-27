const axios = require("axios");

// ── هەڵەست بە چەند API ──
const API_LIST = [
  {
    name: "snapinsta",
    fetch: async (url) => {
      const { data } = await axios.post(
        "https://snapinsta.app/action.php",
        new URLSearchParams({ url, lang: "en" }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": "https://snapinsta.app/",
            "Origin": "https://snapinsta.app"
          },
          timeout: 12000
        }
      );

      const mp4Matches = [...(data.match(/href="(https?:\/\/[^"]+\.mp4[^"]*)"/g) || [])];
      const imgMatches = [...(data.match(/href="(https?:\/\/[^"]+\.(jpg|jpeg|png)[^"]*)"/g) || [])];

      const medias = [];
      mp4Matches.forEach(m => {
        const u = m.replace(/href="|"/g, '');
        if (u.startsWith('http')) medias.push({ url: u, format: 'mp4', mute: 'no' });
      });
      imgMatches.forEach(m => {
        const u = m.replace(/href="|"/g, '');
        if (u.startsWith('http')) medias.push({ url: u, format: 'jpg', mute: 'no' });
      });

      if (medias.length === 0) throw new Error("snapinsta: no media found");
      return { medias, thumbnail: null, title: "Instagram Content" };
    }
  },
  {
    name: "puruboy",
    fetch: async (url) => {
      const { data } = await axios.post(
        "https://puruboy-api.vercel.app/api/downloader/instagram",
        { url },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
          },
          timeout: 12000
        }
      );
      if (!data.success || !data.result?.medias?.length) throw new Error("puruboy: no media");
      return {
        medias: data.result.medias,
        thumbnail: data.result.thumbnail || null,
        title: data.result.title || "Instagram Content"
      };
    }
  },
  {
    name: "igram",
    fetch: async (url) => {
      const { data } = await axios.post(
        "https://igram.world/api/convert",
        { url },
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://igram.world/",
            "Origin": "https://igram.world"
          },
          timeout: 12000
        }
      );
      const items = data?.result || data?.medias || data?.links || [];
      if (!items.length) throw new Error("igram: no media");
      const medias = items.map(i => ({
        url: i.url || i.link,
        format: (i.type || i.ext || '').includes('mp4') ? 'mp4' : 'jpg',
        mute: 'no'
      }));
      return { medias, thumbnail: null, title: "Instagram Content" };
    }
  },
  {
    name: "savefrom",
    fetch: async (url) => {
      const { data } = await axios.get(
        `https://worker.sf-tools.com/savefrom.php?sf_url=${encodeURIComponent(url)}&lang=en`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json"
          },
          timeout: 12000
        }
      );
      const links = data?.url || [];
      if (!links.length) throw new Error("savefrom: no media");
      const medias = links.map(l => ({
        url: l.url,
        format: l.ext || 'mp4',
        mute: 'no'
      }));
      return { medias, thumbnail: data.thumb || null, title: data.meta?.title || "Instagram Content" };
    }
  }
];

// ══════════════════════════════════════════════════
// fetchInstagram(url, res)
// بەکاردەهێنرێت لە: POST /api/instagram/download
// ══════════════════════════════════════════════════
async function fetchInstagram(url, res) {
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "لینکی ئینستاگرام پێویستە" });
  }
  if (!url.includes("instagram.com")) {
    return res.status(400).json({ error: "لینکی ئینستاگرام دروست نییە" });
  }

  let lastError = null;
  let resultData = null;

  for (const api of API_LIST) {
    try {
      console.log(`[IG] Trying: ${api.name}`);
      resultData = await api.fetch(url);
      console.log(`[IG] ✅ ${api.name} — medias: ${resultData.medias.length}`);
      break;
    } catch (err) {
      console.warn(`[IG] ❌ ${api.name}:`, err.message);
      lastError = err;
    }
  }

  if (!resultData || !resultData.medias?.length) {
    return res.status(500).json({
      error: "هیچ API یەک کارنەکرد. لینکەکە private نەبێت.",
      detail: lastError?.message
    });
  }

  // ── بەهترین مێدیا هەڵبژێرە ──
  let selectedMedia = null;
  for (const mediaItem of resultData.medias) {
    const isVideo =
      mediaItem.format === "mp4" ||
      String(mediaItem.url || "").includes(".mp4") ||
      String(mediaItem.type || "").toLowerCase() === "video";

    if (isVideo && mediaItem.mute === "yes") {
      const hasNonMuted = resultData.medias.some(m => {
        const iv = m.format === "mp4" || String(m.url || "").includes(".mp4");
        return iv && m.mute !== "yes";
      });
      if (hasNonMuted) continue;
    }
    selectedMedia = mediaItem;
    break;
  }
  if (!selectedMedia) selectedMedia = resultData.medias[0];

  const isVideo =
    selectedMedia.format === "mp4" ||
    String(selectedMedia.url || "").includes(".mp4") ||
    String(selectedMedia.type || "").toLowerCase() === "video";

  const extension = selectedMedia.format || (isVideo ? "mp4" : "jpg");
  const filename  = `instagram_${Date.now()}.${extension}`;
  const mimeType  = isVideo ? "video/mp4" : "image/jpeg";

  console.log(`[IG] Streaming: ${selectedMedia.url.substring(0, 80)}...`);

  // ── Stream ڕاستەوخۆ بۆ کلاینت ──
  try {
    const fileStream = await axios.get(selectedMedia.url, {
      responseType: "stream",
      timeout: 60000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://www.instagram.com/"
      }
    });

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");

    if (fileStream.headers["content-length"]) {
      res.setHeader("Content-Length", fileStream.headers["content-length"]);
    }

    fileStream.data.pipe(res);

    fileStream.data.on("error", (err) => {
      console.error("[Stream Error]:", err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: "Stream شکست" });
      }
    });

  } catch (streamErr) {
    console.error("[Stream Fallback]:", streamErr.message);
    if (!res.headersSent) {
      res.redirect(302, selectedMedia.url);
    }
  }
}

module.exports = { fetchInstagram };
