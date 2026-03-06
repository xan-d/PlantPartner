const db = require('../db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

// POST /auth/register
exports.register = async (req, res) => {
    const { email, password, displayName } = req.body;
    

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [existing] = await db.promise().query(
            'SELECT userID FROM Users WHERE email = ?', [email]
        );
        if (existing.length) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await db.promise().query(
            'INSERT INTO Users (email, passwordHash, displayName) VALUES (?, ?, ?)',
            [email, passwordHash, displayName || null]
        );

        req.session.userID = result.insertId;
        res.status(201).json({ userID: result.insertId, email, displayName });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM Users WHERE email = ?', [email]
        );

        if (!rows.length) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.passwordHash);

        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.userID = user.userID;
        res.json({ userID: user.userID, email: user.email, displayName: user.displayName });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /auth/logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
};

// GET /auth/me  ← useful for frontend to check if session is still alive
exports.me = (req, res) => {
    if (!req.session.userID) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ userID: req.session.userID });
};