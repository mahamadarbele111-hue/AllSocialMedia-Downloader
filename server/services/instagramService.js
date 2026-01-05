const axios = require("axios");

async function fetchInstagram(url) {
  // 1. Validasi URL Basic
  if (!url.includes("instagram.com")) {
    throw new Error("URL tidak valid. Harap masukkan link Instagram yang benar.");
  }

  try {
    console.log("[IG] Menggunakan Gimita API untuk:", url);

    // 2. Request ke API Gimita
    // Kita gunakan encodeURIComponent agar URL aman saat dikirim
    const apiUrl = `https://api.gimita.id/api/downloader/instagram?url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(apiUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 15000 // Batas waktu 15 detik
    });

    const result = response.data;

    // 3. Cek Error dari API
    if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("API tidak menemukan media (Mungkin akun Private).");
    }

    // 4. Parsing Data
    // API ini mengembalikan array di dalam 'data'
    const mediaItem = result.data[0];
    
    // Tentukan tipe konten (Video atau Gambar)
    const isVideo = mediaItem.type === 'mp4' || mediaItem.ext === 'mp4';
    
    // Karena API ini tidak memberikan thumbnail di response JSON-nya, 
    // kita pakai default image yang keren biar tampilan tidak kosong.
    const defaultThumbnail = "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop";

    // 5. Return Format Zeronaut
    return {
        title: "Instagram Content",
        author: "Instagram User", 
        thumbnail: defaultThumbnail, 
        medias: [
            {
                url: mediaItem.url,
                type: isVideo ? 'video' : 'image',
                label: isVideo ? 'DOWNLOAD VIDEO' : 'DOWNLOAD IMAGE',
                extension: mediaItem.ext || (isVideo ? 'mp4' : 'jpg')
            }
        ]
    };

  } catch (error) {
    console.error("[IG Service Error]:", error.message);
    // Tampilkan pesan error yang jelas
    throw new Error(error.response?.data?.message || "Gagal mengambil data dari API.");
  }
}

module.exports = { fetchInstagram };