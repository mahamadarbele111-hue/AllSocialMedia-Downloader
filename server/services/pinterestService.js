const axios = require("axios");

async function fetchPinterestMedia(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Link Pinterest harus diisi");
  }

  try {
    console.log("[PINTEREST] Menggunakan Ryzumi API untuk:", url);

    // 1. Menyusun URL API (Metode GET sesuai dokumentasi Ryzumi)
    const apiUrl = `https://api.ryzumi.net/api/downloader/pinterest?url=${encodeURIComponent(url)}`;

    const { data } = await axios.get(apiUrl, {
      headers: {
        "Accept": "application/json"
      }
    });

    // 2. Validasi Respons
    if (!data || (!data.image && !data.video)) {
      throw new Error("Gagal mendapatkan data media dari Pinterest.");
    }

    const downloads = [];
    
    // Mengambil thumbnail (Prioritaskan gambar, jika tidak ada pakai poster video)
    let thumbnail = data.image?.url || data.video?.poster || null;

    // 3. Mapping Data berdasarkan tipe media (Gambar atau Video)
    if (data.isImage && data.image?.url) {
      // Jika media berupa Foto/Gambar
      downloads.push({
        quality: "HD",
        format: "jpg",
        url: data.image.url
      });
    } else if (!data.isImage && data.video) {
      // Jika media berupa Video
      // (Asumsi: API Ryzumi meletakkan link video di dalam data.video.url)
      const videoUrl = data.video.url || data.video.downloadUrl || data.url;
      
      if (videoUrl) {
        downloads.push({
          quality: data.video.quality || "HD",
          format: "mp4",
          url: videoUrl
        });
      }
    }

    if (downloads.length === 0) {
        throw new Error("Sistem berhasil menghubungi API, tetapi link unduhan kosong.");
    }

    // 4. Return Data sesuai format UI Zeronaut
    return {
      title: data.title || "Pinterest Media",
      thumbnail: thumbnail,
      downloads: downloads // Sesuai dengan App.jsx Pinterest yang menggunakan properti 'downloads'
    };

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("[PINTEREST ERROR]:", errorMsg);
    throw new Error("Gagal memproses link Pinterest. Pastikan link valid dan bukan private board.");
  }
}

module.exports = { fetchPinterestMedia };