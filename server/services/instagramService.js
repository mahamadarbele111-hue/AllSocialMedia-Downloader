const axios = require("axios");
const path = require("path");

async function fetchInstagram(url, res) {
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

    // ── بەهترین مێدیا هەڵبژێرە ──
    let selectedMedia = null;

    for (const mediaItem of result.medias) {
      const isVideo =
        mediaItem.format === "mp4" ||
        String(mediaItem.url || "").includes(".mp4") ||
        String(mediaItem.type || "").toLowerCase() === "video";

      if (isVideo && mediaItem.mute === "yes") {
        const hasNonMuted = result.medias.some(m => {
          const iv = m.format === "mp4" || String(m.url || "").includes(".mp4");
          return iv && m.mute !== "yes";
        });
        if (hasNonMuted) continue;
      }

      selectedMedia = mediaItem;
      break;
    }

    if (!selectedMedia) {
      selectedMedia = result.medias[0];
    }

    const isVideo =
      selectedMedia.format === "mp4" ||
      String(selectedMedia.url || "").includes(".mp4") ||
      String(selectedMedia.type || "").toLowerCase() === "video";

    const extension = selectedMedia.format || (isVideo ? "mp4" : "jpg");
    const filename = `instagram_download_${Date.now()}.${extension}`;
    const mimeType = isVideo ? "video/mp4" : "image/jpeg";

    // ── ڕاستەوخۆ Stream بکە بۆ کلاینت ──
    const fileStream = await axios.get(selectedMedia.url, {
      responseType: "stream",
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", mimeType);

    if (fileStream.headers["content-length"]) {
      res.setHeader("Content-Length", fileStream.headers["content-length"]);
    }

    // ── Stream داتا بۆ کلاینت ──
    fileStream.data.pipe(res);

    fileStream.data.on("error", (err) => {
      console.error("[Stream Error]:", err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: "Stream شکست" });
      }
    });

  } catch (error) {
    const errorMsg = error.response
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error("[IG Error]:", errorMsg);

    if (!res.headersSent) {
      throw new Error("Gagal mengambil data. Pastikan link valid dan bukan akun private.");
    }
  }
}

module.exports = { fetchInstagram };
چۆن بەکاری بهێنیت لە Router دا:
// routes/instagram.js
const express = require("express");
const router = express.Router();
const { fetchInstagram } = require("../services/instagram");

router.post("/download", async (req, res) => {
  const { url } = req.body;
  try {
    await fetchInstagram(url, res); // ← res دەدەیت بۆ فەنکشن
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
});

module.exports = router;
