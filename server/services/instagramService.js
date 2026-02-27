const axios = require("axios");

async function fetchInstagram(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Link Instagram harus diisi");
  }
  if (!url.includes("instagram.com")) {
    throw new Error("URL tidak valid. Harap masukkan link Instagram yang benar.");
  }

  try {
    console.log("[IG] Fetching:", url);

    const { data } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/instagram",
      { url },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 15000
      }
    );

    if (!data.success || !data.result || !data.result.medias || data.result.medias.length === 0) {
      throw new Error("API tidak menemukan media (akun Private atau link salah).");
    }

    const result = data.result;
    const downloads = [];

    result.medias.forEach(mediaItem => {
      const isVideo = mediaItem.format === 'mp4'
        || String(mediaItem.url || '').includes('.mp4')
        || String(mediaItem.type || '').toLowerCase() === 'video';

      // ── بەرێوەچوونی ڤیدیۆ بەبێ دەنگ ──
      // ئەگەر ڤیدیۆی mute بوو بەڵام تر هیچ ڤیدیۆی تر نییە، زیادی بکە
      // ئەگەر ڤیدیۆی دەنگدار هەیە ئەوکات mute skip بکە
      if (isVideo && mediaItem.mute === "yes") {
        const hasNonMutedVideo = result.medias.some(m => {
          const iv = m.format === 'mp4' || String(m.url || '').includes('.mp4');
          return iv && m.mute !== "yes";
        });
        if (hasNonMutedVideo) return; // skip muted if better exists
      }

      downloads.push({
        url:       mediaItem.url,
        type:      isVideo ? 'video' : 'image',
        text:      isVideo ? 'video' : 'image',   // ← frontend type detection
        label:     isVideo
          ? `ڤیدیۆ (${mediaItem.quality || 'HD'})`
          : `وێنە (${mediaItem.quality || 'Original'})`,
        extension: mediaItem.format || (isVideo ? 'mp4' : 'jpg'),
        quality:   mediaItem.quality || null,
      });
    });

    // ── مطمئن ببە لانیکەم یەک دانە هەیە ──
    if (downloads.length === 0) {
      // fallback: هەموویان زیادبکە بەبێ skip
      result.medias.forEach(mediaItem => {
        const isVideo = mediaItem.format === 'mp4' || String(mediaItem.url || '').includes('.mp4');
        downloads.push({
          url:       mediaItem.url,
          type:      isVideo ? 'video' : 'image',
          text:      isVideo ? 'video' : 'image',
          label:     isVideo ? 'ڤیدیۆ' : 'وێنە',
          extension: mediaItem.format || (isVideo ? 'mp4' : 'jpg'),
        });
      });
    }

    if (downloads.length === 0) {
      throw new Error("هیچ لینکی داونلۆدی دۆزرایەوە.");
    }

    const thumbnailUrl = result.thumbnail
      || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png";

    return {
      title:     result.title    || "Instagram Content",
      author:    data.author     || result.author || "Instagram User",
      thumbnail: thumbnailUrl,
      downloads: downloads,   // ← frontend دەگەڕێت بەدوای 'downloads' دا
    };

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("[IG Error]:", errorMsg);
    throw new Error("Gagal mengambil data. Pastikan link valid dan bukan akun private.");
  }
}

module.exports = { fetchInstagram };
