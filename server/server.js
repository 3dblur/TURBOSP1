const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
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

// SP1 proof generation endpoint
app.post('/api/game-actions', (req, res) => {
    const { seed, laneChanges, quizAnswers } = req.body;
    console.log('Received game actions:', { seed, laneChanges: laneChanges.length, quizAnswers: quizAnswers.length });
    
    // For now, we'll simulate proof generation since SP1 setup is complex
    // In a production environment, this would call the SP1 prover
    
    // Calculate score based on the same algorithm as in score_prover.rs
    let prngState = seed;
    let score = 1;
    let powerUps = 0;
    
    // Simulate game with discrete time steps
    for (let t = 0; t < 600; t++) {
        prngState = (1103515245 * prngState + 12345) & 0x7fffffff;
        if (prngState % 100 < 5) { // 5% chance of power-up per frame
            powerUps += 1;
            score += 1;
        }
    }
    
    // Apply lane changes
    for (const { time } of laneChanges) {
        if (time < 600 * 16) { // Within 10 seconds (16ms per frame)
            prngState = (1103515245 * prngState + 12345) & 0x7fffffff;
        }
    }
    
    // Apply quiz bonus if score > 15
    if (score > 15) {
        for (const { correct } of quizAnswers) {
            if (correct) {
                score += 5;
            }
        }
    }
    
    // Generate a mock proof (in production, this would be a real SP1 proof)
    const mockProof = {
        proof: Buffer.from(`sp1_proof_${Date.now()}_${score}`).toString('base64'),
        score: score
    };
    
    res.json(mockProof);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 