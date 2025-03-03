const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
console.log('Serving static files from:', path.join(__dirname, '../public'));

// In-memory storage for high scores (replace with a database for production)
let scores = [];

app.post('/api/scores', (req, res) => {
    const { username, score } = req.body;
    
    console.log('Received score data:', req.body);
    
    if (!score) {
        return res.status(400).json({ error: 'Score is required' });
    }

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    
    // Add the new score with username
    scores.push({
        username: username,
        score: parseInt(score),
        date: new Date()
    });
    
    console.log('Updated scores array:', scores);
    
    res.status(201).json({ message: 'Score saved successfully' });
});

app.get('/api/scores', (req, res) => {
    console.log('Sending scores:', scores);
    // Sort scores by highest first
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    // Return top 10 scores
    res.json(sortedScores.slice(0, 10));
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