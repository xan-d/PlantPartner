const webpush = require('web-push');
const db = require('../db');

webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

exports.getVapidPublicKey = (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

exports.subscribe = async (req, res) => {
    console.log('subscribe hit!');
    const { endpoint, keys } = req.body;
    const userID = req.session.userID;

    if (!userID) return res.status(401).json({ error: 'Not logged in' });

    try {
        const result = await db.promise().query(
            'INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) VALUES (?,?,?,?)',
            [userID, endpoint, keys.p256dh, keys.auth]
        );
        console.log('insert result:', result[0].insertId);

        const [check] = await db.promise().query(
            'SELECT * FROM push_subscriptions WHERE id = ?', [result[0].insertId]
        );
        console.log('check:', check);

        res.json({ success: true });
    } catch (err) {
        console.error('Insert error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.sendWateringNotifications = async () => {
    const [rows] = await db.promise().query(`
        SELECT p.name, p.userID as user_id
        FROM Plants p
        WHERE DATE_ADD(p.lastWatered, INTERVAL p.waterFreq DAY) <= CURDATE()
    `);
    console.log('plants due:', rows);

    const byUser = {};
    for (const row of rows) {
        if (!byUser[row.user_id]) byUser[row.user_id] = [];
        byUser[row.user_id].push(row.name);
    }
    console.log('byUser:', byUser);

    for (const [userID, plants] of Object.entries(byUser)) {
        const [subs] = await db.promise().query(
            'SELECT * FROM push_subscriptions WHERE user_id = ?', [userID]
        );
        console.log('subs for user', userID, ':', subs.length);
        for (const sub of subs) {
            try {
                await webpush.sendNotification(
                    { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                    JSON.stringify({
                        title: 'Plant Partner 🌿',
                        body: `Time to water: ${plants.join(', ')}`,
                        url: '/plants'
                    })
                );
            } catch (err) {
                if (err.statusCode === 410) {
                    await db.promise().query('DELETE FROM push_subscriptions WHERE id = ?', [sub.id]);
                }
            }
        }
    }
};