# 3D Turbo Racing Game Setup Guide

This guide will help you set up and run the 3D side-scrolling bike racing game using HTML and Three.js. The game features a 3D bike navigating green lanes, avoiding orange obstacles, collecting pink power-ups, and includes a scoring system, game-over screen, leaderboard, and more.

## Project Structure

First, create the following folder structure:

```
turbo-racing-3d/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server/
│   └── server.js
└── package.json
```

## Step 1: Create the files

### File 1: `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Turbo Racing 3D</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="ui">
        <div id="score">1</div>
        <button id="leaderboard-btn">🏆 Leaderboard</button>
        <button id="garage-btn">🚗 Garage</button>
    </div>
    <canvas id="gameCanvas"></canvas>
    <div id="gameOverScreen" style="display: none;">
        <h1>Game Over!</h1>
        <p>Score: <span id="finalScore">0</span></p>
        <p>Press ENTER to play again</p>
        <p>High Score: <span id="highScore">1</span></p>
        <button id="shareBtn">Share on X</button>
        <button id="lockInBtn">Lock In</button>
    </div>
    <div id="leaderboard" style="display: none;">
        <h2>Leaderboard</h2>
        <ul id="leaderboardList"></ul>
        <button id="closeLeaderboard">Close</button>
    </div>
    <div id="garage" style="display: none;">
        <h2>Garage</h2>
        <p>Coming Soon!</p>
        <button id="closeGarage">Close</button>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

### File 2: `public/styles.css`

```css
body {
    margin: 0;
    overflow: hidden;
    background: #000000;
}

#gameCanvas {
    width: 100vw;
    height: 100vh;
    display: block;
}

#ui {
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 16px;
    background: rgba(255, 0, 0, 0.8);
    padding: 5px 10px;
    border-radius: 3px;
    display: flex;
    gap: 10px;
}

#ui button {
    background: #ff0000;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 3px;
}

#gameOverScreen, #leaderboard, #garage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}

#gameOverScreen button, #leaderboard button, #garage button {
    background: #ff0000;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    margin: 5px;
    border-radius: 3px;
}

#leaderboardList {
    list-style: none;
    padding: 0;
}
```

### File 3: `public/script.js`

```javascript
// Optimized 3D Turbo Racing Game with Three.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // For 2D UI overlay
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScore');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const garageBtn = document.getElementById('garage-btn');
const shareBtn = document.getElementById('shareBtn');
const lockInBtn = document.getElementById('lockInBtn');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboardList');
const garage = document.getElementById('garage');

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Track (green lanes as planes)
const laneGeometry = new THREE.PlaneGeometry(1, 1000);
const laneMaterial = new THREE.MeshBasicMaterial({ color: 0x006400, side: THREE.DoubleSide });
const lanes = [];
for (let i = 0; i < 3; i++) {
    const lane = new THREE.Mesh(laneGeometry, laneMaterial);
    lane.position.x = (i - 1) * 2; // Three lanes at -2, 0, 2
    lane.position.z = -500;
    lane.rotation.y = Math.PI / 2;
    lanes.push(lane);
    scene.add(lane);
}

// Bike (red 3D box)
const bikeGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
const bikeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const bike = new THREE.Mesh(bikeGeometry, bikeMaterial);
bike.position.set(0, 0.25, 0); // Start in middle lane
scene.add(bike);

// Obstacles and Power-Ups (orange and pink boxes)
const obstacleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const powerUpGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const obstacles = [];
const powerUps = [];

const objects = [];

function spawnObject() {
    if (Math.random() < 0.02) { // 2% chance per frame
        const lane = Math.floor(Math.random() * 3) * 2 - 2; // -2, 0, 2
        const type = Math.random() < 0.7 ? 'obstacle' : 'powerUp';
        const object = {
            mesh: new THREE.Mesh(
                type === 'obstacle' ? obstacleGeometry : powerUpGeometry,
                new THREE.MeshBasicMaterial({ color: type === 'obstacle' ? 0xffa500 : 0xff00ff })
            ),
            type,
            z: 50
        };
        object.mesh.position.set(lane, 0.25, object.z);
        objects.push(object);
        scene.add(object.mesh);
    }
}

// Game State
const state = {
    speed: 0.1,
    bikeLane: 1, // 0, 1, 2 for left, middle, right
    score: 1,
    highScore: 1,
    gameOver: false
};

const keys = {};
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

function updateControls() {
    if (keys['ArrowUp'] && state.bikeLane > 0) state.bikeLane--;
    if (keys['ArrowDown'] && state.bikeLane < 2) state.bikeLane++;
    bike.position.x = (state.bikeLane - 1) * 2; // Update bike position
}

function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

// Animation Loop
function animate() {
    if (state.gameOver) return;

    requestAnimationFrame(animate);

    updateControls();

    // Move objects
    objects.forEach((obj, index) => {
        obj.z -= state.speed;
        obj.mesh.position.z = obj.z;
        if (obj.z < -50) {
            scene.remove(obj.mesh);
            objects.splice(index, 1);
        }
        // Collision detection
        if (checkCollision(bike, obj.mesh)) {
            if (obj.type === 'obstacle') {
                state.score = Math.max(0, state.score - 1);
                scene.remove(obj.mesh);
                objects.splice(index, 1);
                if (state.score === 0) gameOver();
            } else {
                state.score += 1;
                scene.remove(obj.mesh);
                objects.splice(index, 1);
            }
        }
    });

    // Spawn new objects
    spawnObject();

    // Update camera
    camera.position.set(bike.position.x, 5, 10);
    camera.lookAt(bike.position);

    // Update UI
    scoreDisplay.textContent = state.score;

    renderer.render(scene, camera);
}
animate();

// Game Over Logic
function gameOver() {
    state.gameOver = true;
    finalScoreDisplay.textContent = state.score;
    if (state.score > state.highScore) {
        state.highScore = state.score;
        highScoreDisplay.textContent = state.highScore;
        saveHighScore(state.highScore);
    }
    gameOverScreen.style.display = 'block';
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && state.gameOver) {
        resetGame();
    }
});

function resetGame() {
    state.gameOver = false;
    state.score = 1;
    scoreDisplay.textContent = state.score;
    bike.position.set(0, 0.25, 0);
    objects.forEach(obj => scene.remove(obj.mesh));
    objects.length = 0;
    gameOverScreen.style.display = 'none';
    animate();
}

// UI Interactions
leaderboardBtn.addEventListener('click', () => {
    leaderboard.style.display = 'block';
    fetchLeaderboard();
});

garageBtn.addEventListener('click', () => {
    garage.style.display = 'block';
});

document.getElementById('closeLeaderboard').addEventListener('click', () => {
    leaderboard.style.display = 'none';
});

document.getElementById('closeGarage').addEventListener('click', () => {
    garage.style.display = 'none';
});

shareBtn.addEventListener('click', () => {
    const message = `I scored ${state.score} in Turbo Racing 3D! Play now: [Your URL]`;
    // Simulate sharing on X (simplified, no real API call here)
    alert(`Sharing on X: ${message}`);
});

lockInBtn.addEventListener('click', () => {
    alert('Score locked in!');
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Backend Integration (fetch/save high scores)
async function saveHighScore(score) {
    try {
        await fetch('http://localhost:3000/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score })
        });
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

async function fetchLeaderboard() {
    try {
        const response = await fetch('http://localhost:3000/api/scores');
        const scores = await response.json();
        leaderboardList.innerHTML = scores.map((s, i) => `<li>${i + 1}. ${s.score}</li>`).join('');
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}
```

### File 4: `server/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

### File 5: `package.json`

```json
{
    "name": "turbo-racing-3d",
    "version": "1.0.0",
    "description": "3D Turbo Racing Game",
    "main": "server/server.js",
    "scripts": {
        "start": "node server/server.js"
    },
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5"
    }
}
```

## Step 2: Set Up and Run the Project in Cursor

Here's how to execute the project using Cursor:

1. **Create a New Folder in Cursor:**
   - Open Cursor and create a new folder called `turbo-racing-3d`

2. **Create the File Structure:**
   - Inside the `turbo-racing-3d` folder, create the `public` and `server` subfolders
   - Create each file with the content shown above in their respective locations

3. **Install Dependencies:**
   - Open a terminal in Cursor (Terminal → New Terminal)
   - Navigate to your project root folder (if not already there)
   - Run the following commands:
   ```bash
   npm init -y
   npm install express cors
   ```
   - Alternatively, you can just create the `package.json` file with the content provided above

4. **Start the Backend Server:**
   - In the terminal, run:
   ```bash
   node server/server.js
   ```
   - You should see: `Server running at http://localhost:3000`

5. **Run the Frontend:**
   - You have two options:
     
     **Option 1:** Use Cursor's Live Preview
     - Right-click on the `index.html` file
     - Select "Open Live Preview" or similar option in Cursor
     - This will open a browser window with your game
     
     **Option 2:** Use a local server extension
     - If you have the "Live Server" extension in Cursor, right-click on `index.html` and select "Open with Live Server"

6. **Play the Game:**
   - Use the Up and Down arrow keys to navigate between lanes
   - Avoid orange obstacles (they reduce your score)
   - Collect pink power-ups (they increase your score)
   - Game ends when your score reaches 0

## Game Controls and Features:

- **Controls:** Up/Down arrow keys to navigate between lanes
- **Scoring:** 
  - Pink power-ups increase your score by 1
  - Orange obstacles decrease your score by 1
  - Game over when score reaches 0
- **UI Elements:**
  - Score display in the top-left corner
  - Leaderboard button to view high scores
  - Garage button (coming soon feature)
  - Game over screen with final score and options to replay or share

## Troubleshooting:

- If the leaderboard doesn't work, make sure the backend server is running at http://localhost:3000
- If you see rendering issues, check that the Three.js library is loading correctly
- Make sure all JavaScript functions are correctly defined in the script.js file
- If the game isn't responding to keyboard controls, click on the game canvas first to give it focus