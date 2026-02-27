const axios = require("axios");

async function fetchTikTokData(videoUrl) {
  if (!videoUrl || typeof videoUrl !== "string") {
    throw new Error("Link TikTok harus diisi");
  }

  try {
    // ══════════════════════════════════════════════════
    // API 1: tikwm - بەخۆڕایی و پشتیوانیی زۆر
    // ══════════════════════════════════════════════════
    const { data } = await axios.get(
      `https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        timeout: 15000
      }
    );

    if (data.code === 0 && data.data && data.data.play) {
      const d = data.data;

      const downloads = [];
      if (d.hdplay) downloads.push({ text: "video_hd",  type: "video_hd",  url: d.hdplay });
      if (d.play)   downloads.push({ text: "video_nwm", type: "video_nwm", url: d.play });
      if (d.music)  downloads.push({ text: "audio",     type: "audio",     url: d.music });

      return {
        status:     "success",
        title:      d.title || "TikTok Video",
        author:     d.author?.nickname || null,
        thumbnail:  d.cover || null,
        duration:   d.duration || null,
        view_count: d.play_count || null,
        downloads,
      };
    }

    throw new Error("tikwm failed");

  } catch (firstError) {
    console.warn("[TIKTOK] tikwm failed, trying tiklydown...");

    try {
      // ══════════════════════════════════════════════════
      // API 2: tiklydown - backup
      // ══════════════════════════════════════════════════
      const { data } = await axios.get(
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`,
        { timeout: 15000 }
      );

      if (data && data.video && data.video.noWatermark) {
        const downloads = [
          { text: "video_nwm", type: "video_nwm", url: data.video.noWatermark },
        ];
        if (data.music?.play_url) {
          downloads.push({ text: "audio", type: "audio", url: data.music.play_url });
        }

        return {
          status:     "success",
          title:      data.title || "TikTok Video",
          author:     data.author?.name || null,
          thumbnail:  data.author?.avatar || null,
          duration:   null,
          view_count: null,
          downloads,
        };
      }

      throw new Error("tiklydown failed");

    } catch (secondError) {
      console.error(`[TIKTOK ERROR] Both APIs failed`);
      throw new Error("کارنەکرد. تکایە دووبارە هەوڵبدە.");
    }
  }
}

module.exports = { fetchTikTokData };
