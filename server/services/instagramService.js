const axios = require("axios");

async function fetchInstagram(url) {
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
        timeout: 15000 // Batas waktu 15 detik
      }
    );

    // 3. Cek Error dari API
    if (!data.success || !data.result || !data.result.medias || data.result.medias.length === 0) {
      throw new Error("API tidak menemukan media (Mungkin akun Private atau link salah).");
    }

    const result = data.result;
    const downloadLinks = [];

    // 4. Parsing Data Array medias dari Puruboy
    result.medias.forEach(mediaItem => {
      // Periksa apakah format mp4 atau jpg untuk melabeli tombol
      const isVideo = mediaItem.format === 'mp4' || mediaItem.url.includes('.mp4');
      
      // Khusus Puruboy IG API: Jangan tampilkan opsi yang tidak ada suaranya (mute: "yes") jika itu video
      // Tapi jika itu gambar (jpg), biarkan saja.
      if (isVideo && mediaItem.mute === "yes") {
          return; // Skip iterasi ini
      }

      downloadLinks.push({
        url: mediaItem.url,
        type: isVideo ? 'video' : 'image',
        label: isVideo ? `DOWNLOAD VIDEO (${mediaItem.quality})` : `DOWNLOAD IMAGE (${mediaItem.quality})`,
        extension: mediaItem.format || (isVideo ? 'mp4' : 'jpg')
      });
    });

    if (downloadLinks.length === 0) {
       throw new Error("Link download valid tidak ditemukan.");
    }

    // --- UPDATE THUMBNAIL ---
    // Menggunakan thumbnail dari API jika ada, jika tidak gunakan logo default
    const thumbnailUrl = result.thumbnail || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png";

    // 5. Return Format Zeronaut
    return {
      title: result.title || "Instagram Content",
      author: data.author || "Instagram User", 
      thumbnail: thumbnailUrl, 
      medias: downloadLinks
    };

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("[IG Service Error]:", errorMsg);
    throw new Error("Gagal mengambil data dari server. Pastikan link valid dan bukan dari akun private.");
  }
}

module.exports = { fetchInstagram };