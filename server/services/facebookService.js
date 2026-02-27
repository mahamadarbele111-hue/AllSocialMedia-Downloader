const axios = require("axios");

function formatViews(n) {
  if (!n) return null;
  const num = parseInt(n);
  if (isNaN(num)) return null;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

function formatDuration(secs) {
  if (!secs) return null;
  const s = parseInt(secs);
  if (isNaN(s)) return null;
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
  return `${m}:${String(s % 60).padStart(2,'0')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(typeof dateStr === 'number' ? dateStr * 1000 : dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("ku", { year:"numeric", month:"long", day:"numeric" });
}

async function fetchFacebook(url) {
  if (!url || typeof url !== "string") throw new Error("Link Facebook harus diisi");
  if (!url.includes("facebook.com") && !url.includes("fb.watch")) {
    throw new Error("URL tidak valid. Harap masukkan link Facebook yang benar.");
  }

  try {
    console.log("[FB] Menggunakan Puruboy API untuk:", url);

    const { data } = await axios.post(
      "https://puruboy-api.vercel.app/api/downloader/fbdl",
      { url },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        timeout: 20000
      }
    );

    if (!data.success || !data.result) {
      throw new Error("Gagal mengambil data. Pastikan video bersifat Publik.");
    }

    const result = data.result;
    const downloadLinks = [];

    if (result.video_hd) downloadLinks.push({ url: result.video_hd, type: 'video', label: 'HD' });
    if (result.video_sd) downloadLinks.push({ url: result.video_sd, type: 'video', label: 'SD' });

    if (downloadLinks.length === 0) throw new Error("Link download tidak ditemukan.");

    const thumbnailUrl = result.thumbnail ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png";

    return {
      title: result.title || "Facebook Video",
      author: result.author || data.author || "Facebook User",
      thumbnail: thumbnailUrl,
      duration: formatDuration(result.duration),
      views: formatViews(result.view_count || result.views),
      date: formatDate(result.timestamp || result.upload_date || result.date),
      medias: downloadLinks,
    };

  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("[FB Service Error]:", errorMsg);
    throw new Error("Gagal mengambil data dari server. Pastikan link valid dan video bersifat publik.");
  }
}

module.exports = { fetchFacebook };
