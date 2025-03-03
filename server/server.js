const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());11
app.use(express.static(path.join(__dirname, '..', 'public')));
console.log('Serving static files from:', path.join(__dirname, '../public'));

// In-memory storage for high scores (replace with a database for production)
let scores = [];

app.post('/api/scores', (req, res) => {
    const { score } = req.body;
    scores.push({ score, timestamp: new Date() });
    scores.sort((a, b) => b.score - a.score); // Sort descending
    scores = scores.slice(0, 10); // Keep top 10
    res.json({ success: true });
});

app.get('/api/scores', (req, res) => {
    res.json(scores);
});

app.get('/healthcheck', (req, res) => {
    res.send('Server is alive!');
});

app.get('*', (req, res) => {
    console.log('Catch-all route triggered for:', req.url);
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 