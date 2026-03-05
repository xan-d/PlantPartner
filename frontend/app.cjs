require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('connect-mysql2')(session);
const db = require('./db');

const plantCardsRoutes = require('./routes/plantCard');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust Cloudflare proxy so secure cookies work
app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.FRONTEND_URL,  // e.g. https://plantpartner.com
    credentials: true                   // required for cookies cross-origin
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({}, db),
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    }
}));

app.use('/api/plants', plantCardsRoutes);
app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('/{*path}', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});