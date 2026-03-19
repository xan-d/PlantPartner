const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Quick connectivity check
db.getConnection((err, conn) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        console.error('DB_HOST:', process.env.DB_HOST);
        console.error('DB_USER:', process.env.DB_USER);
        console.error('DB_NAME:', process.env.DB_NAME);
        return;
    }
    console.log('Connected to MySQL successfully');
    conn.release();
});

module.exports = db;