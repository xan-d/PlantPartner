require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');

const plantCardsRoutes = require('./routes/plantCard');
const authRoutes = require('./routes/auth');
const pushRoutes = require('./routes/push');
const userStatsRoutes = require('./routes/userStats');
const bugRoutes = require('./routes/bugReport');

const { sendWateringNotifications } = require('./controllers/pushController');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

// routes — all after middleware
app.use('/api/plants', plantCardsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/user/stats', userStatsRoutes);
app.use('/api/bugs', bugRoutes);

setInterval(async () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    console.log('Checking notifications for time:', currentTime);

    try {
        const [users] = await db.promise().query(
            'SELECT userID FROM Users WHERE notify_time = ?', [currentTime]
        );
        console.log('Users matched:', users.length);
        for (const user of users) {
            await sendWateringNotifications(user.userID);
        }
    } catch (err) {
        console.error('Notification check error:', err);
    }
}, 60 * 1000);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('/{*path}', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});