/*
SETUP
*/
const express = require('express');
const path = require('path');
const app = express();
const PORT = 7349;

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'dist')));

/*
    ROUTES
*/
// Serve index.html for all routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Frontend started on http://localhost:5173; press Ctrl-C to terminate.')
});