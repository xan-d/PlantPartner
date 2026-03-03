const db = require('../db');
const https = require('https');
const http = require('http');

// ─── Fetch raw HTML from a URL ────────────────────────────────────────────────
function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            // Follow redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchHTML(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// ─── Parse gardenish.co care fields from HTML ─────────────────────────────────
function parseGardenishCare(html) {
    const care = {};

    // Helper: extract value after a label
    function extract(label) {
        // Match label text followed by value in nearby tag
        const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(
            escaped + '[^<]*<\\/[^>]+>\\s*<[^>]+>([^<]+)<', 'i'
        );
        const match = html.match(pattern);
        return match ? match[1].trim() : null;
    }

    // Helper: extract text between two tag occurrences near a label
    function extractNear(label) {
        const idx = html.toLowerCase().indexOf(label.toLowerCase());
        if (idx === -1) return null;
        const chunk = html.slice(idx, idx + 300);
        const match = chunk.match(/>([^<]{2,80})</g);
        if (!match) return null;
        // Return first non-label, non-empty match
        for (const m of match) {
            const text = m.replace(/[<>]/g, '').trim();
            if (text && text.toLowerCase() !== label.toLowerCase() && text.length > 1) {
                return text;
            }
        }
        return null;
    }

    care.sun = extractNear('Preferred Sun') || extractNear('Sun Exposure') || extractNear('Light');
    care.water = extractNear('Water Needs') || extractNear('Watering');
    care.temp = extractNear('Temp Range') || extractNear('Temperature');
    care.zones = extractNear('USDA Zones') || extractNear('Hardiness Zone');
    care.soil = extractNear('Soil Type') || extractNear('Soil');
    care.toxicity = extractNear('Toxicity');
    care.drought = extractNear('Drought');
    care.type = extractNear('Plant Type');
    care.fertilizer = extractNear('Fertilizer') || extractNear('Feeding');
    care.pruning = extractNear('Pruning');
    care.lifespan = extractNear('Lifespan');
    care.size = extractNear('Mature Size');
    care.ph = extractNear('Ideal Soil pH') || extractNear('Soil pH');
    care.difficulty = extractNear('Difficulty');

    // Remove nulls
    Object.keys(care).forEach(k => { if (!care[k]) delete care[k]; });

    return care;
}

// ─── GET /plants/:id/care ─────────────────────────────────────────────────────
exports.getPlantCare = async (req, res) => {
    const plantId = req.params.id;

    try {
        const [rows] = await db.promise().query(
            'SELECT careLink FROM Plants WHERE plantID = ?',
            [plantId]
        );

        if (!rows.length) return res.status(404).json({ error: 'Plant not found' });

        const { careLink } = rows[0];
        if (!careLink) return res.status(400).json({ error: 'No care link set for this plant' });

        const html = await fetchHTML(careLink);
        const care = parseGardenishCare(html);

        if (Object.keys(care).length === 0) {
            return res.status(422).json({ error: 'Could not parse care info from that page' });
        }

        res.json(care);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};