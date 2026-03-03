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
        const [rows] = await db.promise().query('SELECT * FROM Plants');
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
            'SELECT * FROM Plants WHERE plantID = ?',
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
    try {
        const [result] = await db.promise().query(
            'INSERT INTO Plants (name, scientific, image, room, light, lastWatered, waterFreq, lastFed, health, careLink, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, scientific, image, room, light, lastWatered, waterFreq, lastFed, health, careLink, color]
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