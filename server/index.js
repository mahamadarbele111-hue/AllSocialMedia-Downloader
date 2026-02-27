const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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

// ✅ ئینستاگرام: ڕاستەوخۆ داونلۆد
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

// ROUTE UNIVERSAL
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
