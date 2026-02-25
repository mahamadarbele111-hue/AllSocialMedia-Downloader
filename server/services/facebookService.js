const axios = require("axios");

async function fetchFacebook(url) {
  // 1. Validasi URL Basic
  if (!url || typeof url !== "string") {
    throw new Error("Link Facebook harus diisi");
  }
  if (!url.includes("facebook.com") && !url.includes("fb.watch")) {
    throw new Error("URL tidak valid. Harap masukkan link Facebook yang benar.");
  }

  try {
    console.log("[FB] Menggunakan Puruboy API untuk:", url);

    // 2. Request ke API Puruboy menggunakan metode POST
    const { data } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/fbdl",
      { url: url },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      }
    );

    // 3. Cek Error/Validasi Data dari Puruboy
    if (!data.success || !data.result) {
      throw new Error("Gagal mengambil data. Pastikan video bersifat Publik.");
    }

    const result = data.result;
    const downloadLinks = [];

    // 4. Parsing Kualitas (HD & SD)
    // Mengecek apakah link video HD tersedia
    if (result.video_hd) {
      downloadLinks.push({
        url: result.video_hd,
        type: 'video',
        label: 'Download Video (HD)' // 'label' digunakan di kode lama, kita pertahankan
      });
    }

    // Mengecek apakah link video SD tersedia
    if (result.video_sd) {
      downloadLinks.push({
        url: result.video_sd,
        type: 'video',
        label: 'Download Video (SD)'
      });
    }

    if (downloadLinks.length === 0) {
      throw new Error("Link download tidak ditemukan atau video tidak didukung.");
    }

    // --- UPDATE THUMBNAIL ---
    // Menggunakan thumbnail dari API jika ada, jika tidak gunakan logo default
    const thumbnailUrl = result.thumbnail || "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png";

    // 5. Mengembalikan data dengan format yang sesuai dengan Frontend Zeronaut
    return {
      title: "Facebook Video",
      author: data.author || "Facebook User",
      thumbnail: thumbnailUrl,
      medias: downloadLinks // Pastikan menggunakan 'medias' sesuai dengan kode lama Anda
    };

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("[FB Service Error]:", errorMsg);
    throw new Error("Gagal mengambil data dari server. Pastikan link valid dan video bersifat publik.");
  }
}

module.exports = { fetchFacebook }; // Pastikan nama fungsi yang diekspor sama dengan yang dipanggil di index.js