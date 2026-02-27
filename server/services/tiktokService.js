const axios = require("axios");

async function fetchTikTokData(videoUrl) {
  if (!videoUrl || typeof videoUrl !== "string") {
    throw new Error("Link TikTok harus diisi");
  }

  try {
    const { data } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/snaptik",
      { url: videoUrl },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 15000
      }
    );

    // ══════════════════════════════════════════════════
    // ✅ فۆرماتی یەکەم: {error:false, url:"...", filename:"..."}
    // ئەمە ڕاستەوخۆ لە snaptik دێت
    // ══════════════════════════════════════════════════
    if (data.error === false && data.url && typeof data.url === 'string') {
      console.log("[TIKTOK] Snaptik direct URL format detected");

      const downloads = [
        { text: "video_nwm", type: "video_nwm", url: data.url },
        { text: "audio",     type: "audio",     url: data.url },
      ];

      return {
        status:     "success",
        title:      data.filename || "TikTok Video",
        author:     null,
        thumbnail:  null,
        duration:   null,
        view_count: null,
        downloads:  downloads,
      };
    }

    // ══════════════════════════════════════════════════
    // ✅ فۆرماتی دووەم: {result: {video_info, download_links}}
    // ══════════════════════════════════════════════════
    const result = data.result;

    if (!result || !result.video_info || !result.download_links) {
      throw new Error("Gagal mendapatkan data TikTok dari server pusat.");
    }

    const downloads = result.download_links.map((link) => ({
      text: link.type,
      type: link.type,
      url:  link.url,
    }));

    // ئەگەر audio نەبوو، لە video_nwm یان video_hd دروستی بکە
    const hasAudio = downloads.some(d =>
      ["audio", "mp3", "music"].includes(String(d.type).toLowerCase())
    );

    if (!hasAudio) {
      const bestVideo =
        downloads.find(d => d.type === "video_nwm") ||
        downloads.find(d => d.type === "video_hd")  ||
        downloads[0];

      if (bestVideo) {
        downloads.push({
          text: "audio",
          type: "audio",
          url:  bestVideo.url,
        });
      }
    }

    return {
      status:     result.status || "success",
      title:      result.video_info.title || result.video_info.desc || "TikTok Video",
      author:     result.video_info.author || result.video_info.nickname || null,
      thumbnail:  result.video_info.thumbnail || result.video_info.cover || null,
      duration:   result.video_info.duration || null,
      view_count: result.video_info.play_count || result.video_info.views || null,
      downloads:  downloads,
    };

  } catch (error) {
    const errorMsg = error.response
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error(`[TIKTOK ERROR] ${errorMsg}`);
    throw new Error("Gagal memproses link TikTok. Pastikan link benar dan bukan akun private.");
  }
}

module.exports = { fetchTikTokData };
