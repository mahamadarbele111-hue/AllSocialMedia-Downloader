const axios = require("axios");

async function fetchInstagram(url, res) {
  // 1. Validasi URL Basic
  if (!url || typeof url !== "string") {
    throw new Error("Link Instagram harus diisi");
  }
  if (!url.includes("instagram.com")) {
    throw new Error("URL tidak valid. Harap masukkan link Instagram yang benar.");
  }

  try {
    console.log("[IG] Menggunakan Puruboy API untuk:", url);

    // 2. Request ke API Puruboy menggunakan metode POST
    const { data } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/instagram",
      { url: url },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 15000
      }
    );

    // 3. Cek Error dari API
    if (!data.success || !data.result || !data.result.medias || data.result.medias.length === 0) {
      throw new Error("API tidak menemukan media (Mungkin akun Private atau link salah).");
    }

    const result = data.result;

    // 4. هەڵبژاردنی باشترین مێدیا (هەمان لۆجیکی کۆنە)
    let selectedMedia = null;

    for (const mediaItem of result.medias) {
      const isVideo = mediaItem.format === 'mp4' ||
                      String(mediaItem.url || '').includes('.mp4');

      // Skip ڤیدیۆی bێ دەنگ ئەگەر ڤیدیۆی دەنگدار هەیە
      if (isVideo && mediaItem.mute === "yes") {
        const hasNonMuted = result.medias.some(m => {
          const iv = m.format === 'mp4' || String(m.url || '').includes('.mp4');
          return iv && m.mute !== "yes";
        });
        if (hasNonMuted) continue;
      }

      selectedMedia = mediaItem;
      break;
    }

    if (!selectedMedia) {
      throw new Error("Link download valid tidak ditemukan.");
    }

    const isVideo = selectedMedia.format === 'mp4' ||
                    String(selectedMedia.url || '').includes('.mp4');
    const extension = selectedMedia.format || (isVideo ? 'mp4' : 'jpg');
    const filename  = `instagram_${Date.now()}.${extension}`;
    const mimeType  = isVideo ? 'video/mp4' : 'image/jpeg';

    console.log("[IG] Streaming:", selectedMedia.url.substring(0, 80));

    // 5. ✅ ڕاستەوخۆ Stream بکە بۆ کلاینت (داونلۆدی ڕاستەوخۆ)
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

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("[IG Service Error]:", errorMsg);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Gagal mengambil data dari server. Pastikan link valid dan bukan dari akun private.",
        details: errorMsg
      });
    }
  }
}

module.exports = { fetchInstagram };
