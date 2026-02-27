const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const services = {
    tiktok:    require('./services/tiktokService'),
    youtube:   require('./services/youtubeService'),
    instagram: require('./services/instagramService'),
    facebook:  require('./services/facebookService'),
    twitter:   require('./services/twitterService'),
    snapchat:  require('./services/snapchatService'),
};

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ══════════════════════════════════════════════════════
// ✅ PROXY ROUTE — ڤیدیۆ لە سێرڤەر داگیر دەکات
// بەبێ ئەمە براوزەر CORS بلۆک دەکات و play دەکات
// ══════════════════════════════════════════════════════
app.get('/api/proxy', async (req, res) => {
    const { url, filename } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'url required' });
    }

    try {
        console.log(`[PROXY] Downloading: ${decodeURIComponent(url).substring(0, 80)}...`);

        const response = await axios.get(decodeURIComponent(url), {
            responseType: 'stream',
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.tiktok.com/',
                'Accept': '*/*',
            }
        });

        const safeFilename = (filename || 'video.mp4').replace(/[^a-zA-Z0-9._-]/g, '_');
        const contentType  = response.headers['content-type'] || 'video/mp4';

        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }

        response.data.pipe(res);

        response.data.on('error', (err) => {
            console.error('[PROXY] Stream error:', err.message);
            if (!res.headersSent) res.status(500).json({ error: 'stream error' });
        });

    } catch (e) {
        console.error('[PROXY ERROR]', e.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'proxy failed', details: e.message });
        }
    }
});

// ══════════════════════════════════════════════════════
// ✅ ئینستاگرام: ڕاستەوخۆ داونلۆد
// ══════════════════════════════════════════════════════
app.post('/api/instagram/download', async (req, res) => {
    const { url } = req.body;
    console.log('[SERVER] Instagram direct download:', url);
    try {
        await services.instagram.fetchInstagram(url, res);
    } catch (error) {
        console.error('[Instagram Download ERROR]', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});

// ══════════════════════════════════════════════════════
// ROUTE UNIVERSAL
// ══════════════════════════════════════════════════════
app.post('/api/:platform', async (req, res) => {
    const { platform } = req.params;
    const { url } = req.body;
    console.log(`[SERVER] Request: ${platform}`);

    const serviceModule = services[platform];
    if (!serviceModule) {
        return res.status(404).json({ error: `Service '${platform}' نەدۆزرایەوە.` });
    }

    try {
        const functionName = Object.keys(serviceModule).find(
            key => typeof serviceModule[key] === 'function'
        );
        if (!functionName) throw new Error(`هیچ فەنکشنێک نەدۆزرایەوە لە ${platform}Service.js`);
        console.log(`[SERVER] Running: ${functionName}`);
        const data = await serviceModule[functionName](url);
        res.json(data);
    } catch (error) {
        console.error(`[ERROR]`, error.message);
        res.status(500).json({ error: "Gagal memproses.", details: error.message });
    }
});

app.get('/', (req, res) => res.send('ARBILI ENGINE READY 🚀'));

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`>> SERVER: http://localhost:${PORT}`));
}

module.exports = app;
