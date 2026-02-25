const axios = require("axios");

async function fetchTikTokData(videoUrl) {
  if (!videoUrl || typeof videoUrl !== "string") {
    throw new Error("Link TikTok harus diisi");
  }

  try {
    // Menembak API Puruboy untuk TikTok (Snaptik)
    const { data } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/snaptik",
      { url: videoUrl },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      }
    );

    // Menangkap hasil respons dari Puruboy
    const result = data.result;

    if (!result || !result.video_info || !result.download_links) {
      throw new Error("Gagal mendapatkan data TikTok dari server pusat.");
    }

    // --- PROSES TRANSLASI DATA ---
    // Mengubah struktur 'type' dari Puruboy menjadi 'text' agar sesuai dengan UI Zeronaut
    const downloads = result.download_links.map((link) => ({
      text: link.type, // <-- Ini kunci agar tombol di web kamu tetap ada teksnya
      url: link.url
    }));

    // Mengembalikan data persis seperti yang diharapkan oleh App.jsx kamu
    return {
      status: result.status || "success",
      title: result.video_info.title || "TikTok Video",
      thumbnail: result.video_info.thumbnail || null,
      downloads: downloads, 
    };

  } catch (error) {
    // Sistem pelacak error jika API menolak
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error(`[TIKTOK ERROR] ${errorMsg}`);
    throw new Error("Gagal memproses link TikTok. Pastikan link benar dan bukan akun private.");
  }
}

module.exports = { fetchTikTokData };