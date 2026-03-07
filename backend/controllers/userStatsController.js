const db = require('../db');

async function getStats(req, res) {
    try {
        const [rows] = await db.promise().query(
            'SELECT timesWatered, inspectionDueDate FROM Users WHERE userID = ?',
            [req.session.userID]
        );
        if (!rows.length) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
}

async function updateStats(req, res) {
    try {
        const { inspectionDueDate, incrementWatered } = req.body;

        if (incrementWatered) {
            await db.promise().query(
                'UPDATE Users SET timesWatered = timesWatered + 1 WHERE userID = ?',
                [req.session.userID]
            );
        }

        if (inspectionDueDate !== undefined) {
            await db.promise().query(
                'UPDATE Users SET inspectionDueDate = ? WHERE userID = ?',
                [inspectionDueDate, req.session.userID]
            );
        }

        const [rows] = await db.promise().query(
            'SELECT timesWatered, inspectionDueDate FROM Users WHERE userID = ?',
            [req.session.userID]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update stats' });
    }
}

module.exports = { getStats, updateStats };