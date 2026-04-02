const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const IMAGE_DIR = path.join(__dirname, '../../frontend/public/plantImages');

/** Silently remove an image file from disk given its DB path (e.g. /plantImages/foo.jpg) */
function removeImageFile(dbPath) {
    if (!dbPath) return;
    const filePath = path.join(IMAGE_DIR, path.basename(dbPath));
    fs.unlink(filePath, () => {});
}

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
    const userID = req.session.userID;
    try {
        const [rows] = await db.promise().query(
            'SELECT *, DATEDIFF(CURDATE(), lastWatered) AS daysSinceWatered FROM Plants WHERE userID = ? ORDER BY daysSinceWatered DESC',
            [userID]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── GET a single plant by ID ─────────────────────────────────────────────────
exports.getPlantById = async (req, res) => {
    const plantId = req.params.id;
    const userID = req.session.userID;
    try {
        const [rows] = await db.promise().query(
            'SELECT *, DATEDIFF(CURDATE(), lastWatered) AS daysSinceWatered FROM Plants WHERE plantID = ? AND userID = ?',
            [plantId, userID]
        );
        if (!rows.length) return res.status(404).json({ error: 'Plant not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── CREATE a new plant (with image upload) ───────────────────────────────────
exports.createPlant = async (req, res) => {
    const userID = req.session.userID;
    const { name, scientific, room, light, lastWatered, waterFreq, lastFed, health, careLink, color } = req.body;
    const image = req.file ? `/plantImages/${req.file.filename}` : null;

    // Convert "days ago" to actual dates
    const lastWateredDate = new Date();
    lastWateredDate.setDate(lastWateredDate.getDate() - parseInt(lastWatered || 0));
    const lastWateredFormatted = lastWateredDate.toISOString().split('T')[0];

    const lastFedDate = new Date();
    lastFedDate.setDate(lastFedDate.getDate() - parseInt(lastFed || 0));
    const lastFedFormatted = lastFedDate.toISOString().split('T')[0];

    try {
        const [result] = await db.promise().query(
            'INSERT INTO Plants (userID, name, scientific, image, room, light, lastWatered, waterFreq, lastFed, health, careLink, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userID, name, scientific, image, room, light, lastWateredFormatted, waterFreq, lastFedFormatted, health, careLink, color]
        );
        res.status(201).json({ plantID: result.insertId });
    } catch (err) {
        console.error('createPlant error:', err.message);
        if (err.message.includes('Incorrect integer value')) {
            return res.status(400).json({ error: 'Please enter valid number for Water Every (Days).' });
        }
        res.status(500).json({ error: 'Failed to create plant' });
    }
};

// ─── UPDATE an existing plant ─────────────────────────────────────────────────
exports.updatePlant = async (req, res) => {
    const plantId = req.params.id;
    const userID = req.session.userID;
    const { name, scientific, room, light, lastWatered, waterFreq, lastFed, health, careLink, color } = req.body;

    // Convert "days ago" to actual dates
    const lastWateredDate = new Date();
    lastWateredDate.setDate(lastWateredDate.getDate() - parseInt(lastWatered || 0));
    const lastWateredFormatted = lastWateredDate.toISOString().split('T')[0];

    const lastFedDate = new Date();
    lastFedDate.setDate(lastFedDate.getDate() - parseInt(lastFed || 0));
    const lastFedFormatted = lastFedDate.toISOString().split('T')[0];

    try {
        // 1. Start building the query and parameters
        let sql = `UPDATE Plants SET 
            name=?, scientific=?, room=?, light=?, lastWatered=?, 
            waterFreq=?, lastFed=?, health=?, careLink=?, color=?`;
        
        let params = [
            name, scientific, room, light, lastWateredFormatted, 
            waterFreq, lastFedFormatted, health, careLink, color
        ];

        // 2. Fetch existing plant data if needed (for old image path and careLink comparison)
        let oldImage = null;
        let existingCareLink = null;
        if (req.file || careLink !== undefined) {
            const [rows] = await db.promise().query(
                'SELECT image, careLink FROM Plants WHERE plantID=? AND userID=?',
                [plantId, userID]
            );
            if (rows.length) {
                oldImage = rows[0]?.image;
                existingCareLink = rows[0]?.careLink;
            }
        }
        if (req.file) {
            sql += `, image=?`;
            params.push(`/plantImages/${req.file.filename}`);
        }

        // 3. Clear care cache if careLink changed
        if (careLink !== undefined && existingCareLink !== null && existingCareLink !== careLink) {
            sql += `, careCache=NULL`;
        }

        // 4. Complete the query with the WHERE clause
        sql += ` WHERE plantID=? AND userID=?`;
        params.push(plantId, userID);

        const [result] = await db.promise().query(sql, params);

        if (!result.affectedRows) {
            return res.status(404).json({ error: 'Plant not found' });
        }

        // Remove old image file if it was replaced
        if (req.file && oldImage) removeImageFile(oldImage);

        res.json({ message: 'Plant updated' });
    } catch (err) {
        console.error('updatePlant error:', err.message);
        res.status(500).json({ error: 'Failed to update plant' });
    }
};
// ─── DELETE a plant ───────────────────────────────────────────────────────────
exports.deletePlant = async (req, res) => {
    const plantId = req.params.id;
    const userID = req.session.userID;
    try {
        // Grab the image path before deleting the row
        const [rows] = await db.promise().query(
            'SELECT image FROM Plants WHERE plantID=? AND userID=?',
            [plantId, userID]
        );
        const [result] = await db.promise().query(
            'DELETE FROM Plants WHERE plantID=? AND userID=?',
            [plantId, userID]
        );
        if (!result.affectedRows) return res.status(404).json({ error: 'Plant not found' });
        if (rows[0]?.image) removeImageFile(rows[0].image);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── Mark plant as watered ────────────────────────────────────────────────────
exports.waterPlant = async (req, res) => {
    const plantId = req.params.id;
    const userID = req.session.userID;
    if (!plantId || !userID) {
        console.error('Missing plantId or userID', { plantId, userID, session: req.session });
        return res.status(400).json({ error: 'Missing plantId or userID in request.' });
    }
    let conn;
    try {
        conn = await db.promise().getConnection();
        await conn.beginTransaction();
        const [plantResult] = await conn.query(
            'UPDATE Plants SET lastWatered = CURDATE() WHERE plantID = ? AND userID = ?',
            [plantId, userID]
        );
        if (plantResult.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ error: 'Plant not found or not owned by user.' });
        }
        const [userResult] = await conn.query(
            'UPDATE Users SET timesWatered = timesWatered + 1 WHERE userID = ?',
            [userID]
        );
        if (userResult.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ error: 'User not found.' });
        }
        await conn.commit();
        res.json({ message: 'Plant watered' });
    } catch (err) {
        if (conn) {
            try { await conn.rollback(); } catch (rollbackErr) { console.error('Rollback failed:', rollbackErr); }
        }
        console.error('waterPlant error:', {
            message: err.message,
            stack: err.stack,
            plantId,
            userID,
            session: req.session,
            body: req.body
        });
        res.status(500).json({ error: 'Failed to water plant', details: err.message });
    } finally {
        if (conn) conn.release();
    }
};

// TODO: Check if section below is duplicate, I don't think pupeteer is
//          being used anymore.

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

    // Extract h1 for common name
    const h1Match = html.match(/<h1[^>]*class="[^"]*text-3xl[^"]*"[^>]*>([^<]+)<\/h1>/);
    if (h1Match) care.commonName = h1Match[1].trim();

    // Extract scientific name from italic paragraph
    const sciMatch = html.match(/<p[^>]*class="[^"]*italic[^"]*"[^>]*>([^<]+)<\/p>/);
    if (sciMatch) care.scientificName = sciMatch[1].trim();

    // Extract image - grab the firebase URL from srcset
    const imgMatch = html.match(/url=(https%3A%2F%2Ffirebasestorage\.googleapis\.com[^&"]+)/);
    if (imgMatch) care.imageUrl = decodeURIComponent(imgMatch[1]);


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

exports.proxyImage = async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/webp';
        res.set('Content-Type', contentType);
        res.send(Buffer.from(buffer));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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

exports.getPlantCarePreview = async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    if (!url.startsWith('https://gardenish.co/plants/')) {
        return res.status(400).json({ error: 'URL must be a gardenish.co/plants/ link' });
    }

    try {
        const html = await fetchRenderedHTML(url);
        const care = parseGardenishCare(html);

        if (Object.keys(care).length === 0) {
            return res.status(422).json({ error: 'Could not parse care info from that page' });
        }
        res.json(care);
    } catch (err) {
        console.error('getPlantCarePreview error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getPlantCare = async (req, res) => {
    const plantId = req.params.id;
    const userID = req.session.userID;
    try {
        const [rows] = await db.promise().query(
            'SELECT careLink, careCache FROM Plants WHERE plantID = ? AND userID = ?',
            [plantId, userID]
        );
        if (!rows.length) return res.status(404).json({ error: 'Plant not found' });

        const { careLink, careCache } = rows[0];
        if (!careLink) return res.status(400).json({ error: 'No care link set for this plant' });

        // Return cached data if available (handle both object and string forms)
        const parsedCache = typeof careCache === 'string' ? JSON.parse(careCache) : careCache;
        if (parsedCache && typeof parsedCache === 'object' && Object.keys(parsedCache).length > 0) {
            return res.json(parsedCache);
        }

        const html = await fetchRenderedHTML(careLink);
        console.log('HTML length:', html?.length);
        const care = parseGardenishCare(html);
        console.log('Parsed care:', care);

        if (Object.keys(care).length === 0) {
            return res.status(422).json({ error: 'Could not parse care info from that page' });
        }

        // Persist care data to DB for future requests
        await db.promise().query(
            'UPDATE Plants SET careCache = ? WHERE plantID = ? AND userID = ?',
            [JSON.stringify(care), plantId, userID]
        );

        res.json(care);
    } catch (err) {
        console.error('getPlantCare error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateNotes = async (req, res) => {
    const plantId = req.params.id;
    const userID = req.session.userID;
    const { notes } = req.body;
    try {
        await db.promise().query(
            'UPDATE Plants SET notes = ? WHERE plantID = ? AND userID = ?',
            [notes, plantId, userID]
        );
        res.json({ message: 'Notes saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};