require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const plantCardsRoutes = require('./routes/plantCard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/plants', plantCardsRoutes);

/* if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}
*/

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('/{*path}', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});