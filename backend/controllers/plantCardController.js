const db = require('../db');
const multer = require('multer');
const path = require('path');

// ─── Multer Image Upload Setup ────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../frontend/public/plantImages/'),
    filename: (req, file, cb) => {
        const name = file.originalname.replace(/\s+/g, '_');
        cb(null, `${Date.now()}-${name}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        if (ext) cb(null, true);
        else cb(new Error('Images only (jpg, png, webp)'));
    }
});

exports.upload = upload;

// ─── GET all plants ───────────────────────────────────────────────────────────
exports.getAllPlants = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            'SELECT *, DATEDIFF(CURDATE(), lastWatered) AS lastWatered FROM Plants ORDER BY lastWatered DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── GET a single plant by ID ─────────────────────────────────────────────────
exports.getPlantById = async (req, res) => {
    const plantId = req.params.id;
    try {
        const [rows] = await db.promise().query(
            'SELECT *, DATEDIFF(CURDATE(), lastWatered) AS lastWatered FROM Plants WHERE plantID = ?',
            [plantId]
        );
        if (!rows.length) return res.status(404).json({ error: 'Plant not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── CREATE a new plant (with image upload) ───────────────────────────────────
exports.createPlant = async (req, res) => {
    const { name, scientific, room, light, lastWatered, waterFreq, lastFed, health, careLink, color } = req.body;
    const image = req.file ? `/plantImages/${req.file.filename}` : null;

    // Convert "days ago" number to an actual date
    const lastWateredDate = new Date();
    lastWateredDate.setDate(lastWateredDate.getDate() - parseInt(lastWatered || 0));
    const lastWateredFormatted = lastWateredDate.toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        const [result] = await db.promise().query(
            'INSERT INTO Plants (name, scientific, image, room, light, lastWatered, waterFreq, lastFed, health, careLink, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, scientific, image, room, light, lastWateredFormatted, waterFreq, lastFed, health, careLink, color]
        );
        res.status(201).json({ plantID: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── UPDATE an existing plant ─────────────────────────────────────────────────
exports.updatePlant = async (req, res) => {
    const plantId = req.params.id;
    const { name, scientific, room, light, lastWatered, waterFreq, lastFed, health, careLink, color } = req.body;
    try {
        const [result] = await db.promise().query(
            'UPDATE Plants SET name=?, scientific=?, room=?, light=?, lastWatered=?, waterFreq=?, lastFed=?, health=?, careLink=?, color=? WHERE plantID=?',
            [name, scientific, room, light, lastWatered, waterFreq, lastFed, health, careLink, color, plantId]
        );
        if (!result.affectedRows) return res.status(404).json({ error: 'Plant not found' });
        res.json({ message: 'Plant updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── DELETE a plant ───────────────────────────────────────────────────────────
exports.deletePlant = async (req, res) => {
    const plantId = req.params.id;
    try {
        const [result] = await db.promise().query(
            'DELETE FROM Plants WHERE plantID=?',
            [plantId]
        );
        if (!result.affectedRows) return res.status(404).json({ error: 'Plant not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Mark plant as watered ------------------------------------------------------
exports.waterPlant = async (req, res) => {
    const plantId = req.params.id;
    try {
        await db.promise().query(
            'UPDATE Plants SET lastWatered = CURDATE() WHERE plantID = ?',
            [plantId]
        );
        res.json({ message: 'Plant watered' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── GET care info by scraping careLink ───────────────────────────────────────
const https = require('https');
const http = require('http');

function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchHTML(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function parseGardenishCare(html) {
    const care = {};
    function extractNear(label) {
        const idx = html.toLowerCase().indexOf(label.toLowerCase());
        if (idx === -1) return null;
        const chunk = html.slice(idx, idx + 300);
        const match = chunk.match(/>([^<]{2,80})</g);
        if (!match) return null;
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
    Object.keys(care).forEach(k => { if (!care[k]) delete care[k]; });
    return care;
}

const puppeteer = require('puppeteer');

async function fetchRenderedHTML(url) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    const html = await page.content();
    await browser.close();
    return html;
}

exports.getPlantCare = async (req, res) => {
    const plantId = req.params.id;
    try {
        const [rows] = await db.promise().query(
            'SELECT careLink FROM Plants WHERE plantID = ?',
            [plantId]
        );
        if (!rows.length) return res.status(404).json({ error: 'Plant not found' });

        const careLink = rows[0].careLink;
        if (!careLink) return res.status(400).json({ error: 'No care link set for this plant' });

        const html = await fetchRenderedHTML(careLink);
        console.log('HTML length:', html?.length);
        const care = parseGardenishCare(html);
        console.log('Parsed care:', care);

        if (Object.keys(care).length === 0) {
            return res.status(422).json({ error: 'Could not parse care info from that page' });
        }
        res.json(care);
    } catch (err) {
        console.error('getPlantCare error:', err.message);
        res.status(500).json({ error: err.message });
    }
};
// <-- make sure this line exists