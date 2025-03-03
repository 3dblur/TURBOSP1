// Optimized 3D Turbo Racing Game with Three.js
const canvas = document.getElementById('gameCanvas');
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

// Add these elements to the top of the file
const speedNotification = document.createElement('div');
speedNotification.id = 'speedNotification';
speedNotification.style.position = 'absolute';
speedNotification.style.top = '20px';
speedNotification.style.left = '50%';
speedNotification.style.transform = 'translateX(-50%)';
speedNotification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
speedNotification.style.color = '#fff';
speedNotification.style.padding = '10px 20px';
speedNotification.style.borderRadius = '5px';
speedNotification.style.fontWeight = 'bold';
speedNotification.style.zIndex = '1000';
speedNotification.style.display = 'none';
document.body.appendChild(speedNotification);

// Add username modal
const usernameModal = document.createElement('div');
usernameModal.id = 'usernameModal';
usernameModal.style.position = 'fixed';
usernameModal.style.top = '0';
usernameModal.style.left = '0';
usernameModal.style.width = '100%';
usernameModal.style.height = '100%';
usernameModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
usernameModal.style.display = 'flex';
usernameModal.style.justifyContent = 'center';
usernameModal.style.alignItems = 'center';
usernameModal.style.zIndex = '2000';

const usernameContent = document.createElement('div');
usernameContent.style.backgroundColor = '#fff';
usernameContent.style.padding = '30px';
usernameContent.style.borderRadius = '10px';
usernameContent.style.textAlign = 'center';
usernameContent.style.maxWidth = '400px';

usernameContent.innerHTML = `
    <h2>Enter Your Username</h2>
    <p>Please enter a username to track your scores on the leaderboard.</p>
    <input type="text" id="usernameInput" placeholder="Username" style="padding: 10px; width: 100%; margin: 20px 0; box-sizing: border-box;">
    <button id="startGameBtn" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Start Game</button>
`;

usernameModal.appendChild(usernameContent);
document.body.appendChild(usernameModal);

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true,
    alpha: true // Add this to ensure proper canvas initialization
});
renderer.setClearColor(0x000000); // Black background for space
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enhanced lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Add point lights for better bike illumination
const frontLight = new THREE.PointLight(0xffffff, 0.5);
frontLight.position.set(0, 5, 5);
scene.add(frontLight);

const backLight = new THREE.PointLight(0xffffff, 0.3);
backLight.position.set(0, 5, -5);
scene.add(backLight);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Create a canvas-based texture for the SP1 power-up
function createSP1Texture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Background color (magenta)
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(0, 0, 128, 128);
    
    // White border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 120, 120);
    
    // SP1 text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('SP', 20, 50);
    
    // Circle with 1
    ctx.beginPath();
    ctx.arc(90, 40, 25, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    ctx.fillStyle = '#FF00FF';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('1', 82, 50);
    
    // Small square in bottom left
    ctx.fillStyle = 'white';
    ctx.fillRect(20, 80, 20, 20);
    
    return new THREE.CanvasTexture(canvas);
}

// Create the SP1 texture
const sp1Texture = createSP1Texture();

// Update the road/track creation with proper three-lane highway
function createDetailedRoad() {
    const roadGroup = new THREE.Group();
    
    // Main road (three lanes)
    const roadWidth = 15; // Wider road for three lanes
    const roadLength = 1000;
    const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadLength, 20, 1000);
    const roadMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x222222, // Darker asphalt color (almost black)
        roughness: 0.8,
        metalness: 0.2,
        side: THREE.DoubleSide
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0; // Raise slightly above the grid
    roadGroup.add(road);

    // Lane markers
    function createLaneMarker(x) {
        // Create dashed line segments
        for (let z = -roadLength/2; z < roadLength/2; z += 20) {
            const lineGeometry = new THREE.PlaneGeometry(0.3, 10);
            const lineMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFFFFFF,
                emissive: 0x666666,
                side: THREE.DoubleSide
            });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(x, 0.01, z); // Slightly above road
            roadGroup.add(line);
        }
    }

    // Create only the dashed lane dividers
    createLaneMarker(-roadWidth/6); // First lane divider (dashed)
    createLaneMarker(roadWidth/6);  // Second lane divider (dashed)

    // Add shoulders
    const shoulderWidth = 3;
    const shoulderGeometry = new THREE.PlaneGeometry(shoulderWidth, roadLength);
    const shoulderMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333, // Darker gray for shoulders
        roughness: 1,
        side: THREE.DoubleSide
    });

    // Left shoulder
    const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
    leftShoulder.rotation.x = -Math.PI / 2;
    leftShoulder.position.set(-roadWidth/2 - shoulderWidth/2, -0.01, 0);
    roadGroup.add(leftShoulder);

    // Right shoulder
    const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
    rightShoulder.rotation.x = -Math.PI / 2;
    rightShoulder.position.set(roadWidth/2 + shoulderWidth/2, -0.01, 0);
    roadGroup.add(rightShoulder);

    // Remove grass sections

    return roadGroup;
}

// Create a detailed superbike
function createDetailedBike() {
    const group = new THREE.Group();

    // Main body (fairing)
    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.6, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        metalness: 0.8,
        roughness: 0.2,
        shininess: 90
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    group.add(body);

    // Front fairing (aerodynamic shape)
    const frontFairingGeometry = new THREE.ConeGeometry(0.4, 0.8, 8);
    const frontFairing = new THREE.Mesh(frontFairingGeometry, bodyMaterial);
    frontFairing.rotation.z = Math.PI / 2;
    frontFairing.rotation.y = Math.PI / 2;
    frontFairing.position.set(0, 0.5, 1);
    group.add(frontFairing);

    // Windshield
    const windshieldGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.1);
    const windshieldMaterial = new THREE.MeshPhongMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.3,
        shininess: 100
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0, 0.8, 0.5);
    windshield.rotation.x = Math.PI / 6;
    group.add(windshield);

    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.8);
    const seatMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.set(0, 0.65, -0.2);
    group.add(seat);

    // Handlebars
    const handlebarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8);
    const handlebarMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.1
    });
    const handlebar = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(0, 0.7, 0.8);
    group.add(handlebar);

    // Wheels with spokes
    function createWheel() {
        const wheelGroup = new THREE.Group();
        
        // Tire
        const tireGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
        const tireMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x111111,
            roughness: 0.8
        });
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        
        // Hub
        const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 32);
        const hubMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            metalness: 0.9,
            roughness: 0.1
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        
        // Spokes
        const spokeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.25);
        const spokeMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            metalness: 0.9
        });
        
        for (let i = 0; i < 8; i++) {
            const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
            spoke.rotation.z = (i * Math.PI) / 4;
            wheelGroup.add(spoke);
        }
        
        wheelGroup.add(tire);
        wheelGroup.add(hub);
        return wheelGroup;
    }

    // Add wheels
    const frontWheel = createWheel();
    frontWheel.rotation.y = Math.PI / 2;
    frontWheel.position.set(0, 0.3, 1);
    group.add(frontWheel);

    const backWheel = createWheel();
    backWheel.rotation.y = Math.PI / 2;
    backWheel.position.set(0, 0.3, -1);
    group.add(backWheel);

    // Add exhaust pipes
    const exhaustGeometry = new THREE.CylinderGeometry(0.05, 0.07, 0.8);
    const exhaustMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1
    });
    
    const exhaustPipe1 = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    exhaustPipe1.rotation.z = Math.PI / 2;
    exhaustPipe1.position.set(0.2, 0.3, -0.8);
    group.add(exhaustPipe1);

    const exhaustPipe2 = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    exhaustPipe2.rotation.z = Math.PI / 2;
    exhaustPipe2.position.set(-0.2, 0.3, -0.8);
    group.add(exhaustPipe2);

    return group;
}

// Replace the old road and bike creation with the new ones
const road = createDetailedRoad();
scene.add(road);

const bike = createDetailedBike();
bike.position.set(0, 0.3, 0);
scene.add(bike);

// Obstacles and Power-Ups (orange and pink boxes)
const obstacleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const powerUpGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const obstacles = [];
const powerUps = [];

const objects = [];

// Game State
const state = {
    speed: 0.3,
    maxSpeed: 1.2,
    acceleration: 0.0002,
    bikeLane: 1,  // 0, 1, 2 for left, middle, right
    lanePositions: [-5, 0, 5], // Update lane positions to match new road width
    score: 1,
    highScore: 1,
    gameOver: false,
    canChangeLane: true, // Add this to track if we can change lanes
    targetLane: 1, // Add this to track the target lane
    powerUpsCollected: 0,
    baseSpeed: 0.5,
    speedMultiplier: 1,
    obstacleCount: 0,  // Track obstacles for power-up spawning
    adjacentObstacleThreshold: 4,  // Minimum power-ups needed before adjacent obstacles can appear
    username: '',
};

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); // Prevent page scrolling
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update the animation loop to move objects towards the player
function animate() {
    if (state.gameOver) return;

    requestAnimationFrame(animate);

    // Move road and update its position
    road.position.z += state.speed;
    if (road.position.z > 20) {
        road.position.z = 0;
    }

    updateControls();
    updateGameSpeed();

    // Rotate wheels realistically
    const wheelRotationSpeed = state.speed * 10;
    bike.children.forEach(child => {
        if (child.isGroup) {
            child.rotation.x += wheelRotationSpeed;
        }
    });

    // Move objects towards the player
    objects.forEach((obj, index) => {
        obj.z += state.speed * 2;
        
        // Update z position while maintaining y position
        if (obj.type === 'powerUp') {
            obj.mesh.position.z = obj.z;
            // Rotate power-ups around y-axis only to keep text visible
            obj.mesh.rotation.y += 0.01;
        } else {
            obj.mesh.position.z = obj.z;
        }
        
        // Remove objects that have passed the player
        if (obj.z > 10) {
            scene.remove(obj.mesh);
            objects.splice(index, 1);
            return; // Skip collision check for removed objects
        }
        
        // Collision detection
        if (checkCollision(bike, obj.mesh)) {
            if (obj.type === 'obstacle') {
                scene.remove(obj.mesh);
                objects.splice(index, 1);
                gameOver();
            } else {
                // Power-up collection with larger speed increases
                state.score += 1;
                state.powerUpsCollected += 1;
                
                // Every 10 power-ups, increase speed more significantly
                if (state.powerUpsCollected % 10 === 0) {
                    state.speedMultiplier += 0.5;
                    updateGameSpeed();
                    showSpeedNotification(state.speedMultiplier);
                }
                
                scene.remove(obj.mesh);
                objects.splice(index, 1);
            }
        }
    });

    // Spawn new objects
    spawnObject();

    // Update camera to follow bike more smoothly
    const idealOffset = new THREE.Vector3(
        bike.position.x * 0.8,
        8,
        15
    );
    camera.position.lerp(idealOffset, 0.05);
    camera.lookAt(bike.position.x * 0.5, 0, bike.position.z - 5);

    // Update UI
    scoreDisplay.textContent = state.score;

    renderer.render(scene, camera);
}

// Update the bike controls for three lanes
function updateControls() {
    if (state.canChangeLane) {
        if (keys['ArrowLeft'] && state.bikeLane > 0) {
            state.targetLane = state.bikeLane - 1;
            state.bikeLane = state.targetLane;
            state.canChangeLane = false;
        }
        if (keys['ArrowRight'] && state.bikeLane < 2) {
            state.targetLane = state.bikeLane + 1;
            state.bikeLane = state.targetLane;
            state.canChangeLane = false;
        }
    }
    
    // Reset the canChangeLane flag when keys are released
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
        state.canChangeLane = true;
    }
    
    const targetX = state.lanePositions[state.bikeLane];
    const currentX = bike.position.x;
    
    // Smooth position transition
    bike.position.x += (targetX - currentX) * 0.1;
    
    // Bike lean effect
    const lean = (targetX - currentX) * 0.3;
    bike.rotation.z = -lean;
    bike.rotation.y = lean * 0.2;
}

function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

animate();

// Game Over Logic
function gameOver() {
    state.gameOver = true;
    finalScoreDisplay.textContent = state.score;
    
    // Save score with username
    saveHighScore(state.score);
    
    if (state.score > state.highScore) {
        state.highScore = state.score;
        highScoreDisplay.textContent = state.highScore;
    }
    
    gameOverScreen.style.display = 'block';
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && state.gameOver) {
        resetGame();
    }
});

function resetGame() {
    startGame();
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
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: state.username || 'Anonymous',
                score 
            })
        });
        console.log('Score saved with username:', state.username);
        
        // Fetch updated leaderboard
        fetchLeaderboard();
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

async function fetchLeaderboard() {
    try {
        const response = await fetch('/api/scores');
        const scores = await response.json();
        
        // Clear existing leaderboard
        leaderboardList.innerHTML = '';
        
        // Add title and styling
        const leaderboardTitle = document.createElement('h2');
        leaderboardTitle.textContent = 'Turbo Racing Leaderboard';
        leaderboardTitle.style.color = '#ff4500';
        leaderboardTitle.style.borderBottom = '2px solid #ff4500';
        leaderboardTitle.style.paddingBottom = '10px';
        leaderboardTitle.style.marginBottom = '20px';
        leaderboardList.appendChild(leaderboardTitle);
        
        // Add header row
        const headerRow = document.createElement('div');
        headerRow.className = 'leaderboard-header';
        headerRow.innerHTML = `
            <div class="rank">RANK</div>
            <div class="name">NAME</div>
            <div class="score">SCORE</div>
        `;
        leaderboardList.appendChild(headerRow);
        
        // Add each score as a styled row
        scores.forEach((score, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'leaderboard-item';
            listItem.innerHTML = `
                <div class="rank">#${index + 1}</div>
                <div class="player-info">
                    <div class="avatar"></div>
                    <div class="username">@${score.username || 'Anonymous'}</div>
                </div>
                <div class="score">${score.score}</div>
            `;
            leaderboardList.appendChild(listItem);
        });
        
        // Add pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination';
        paginationControls.innerHTML = `
            <button class="prev-btn">< Previous</button>
            <div class="page-number">1</div>
            <button class="next-btn">Next ></button>
        `;
        leaderboardList.appendChild(paginationControls);
        
        // Add CSS for the leaderboard
        const style = document.createElement('style');
        style.textContent = `
            #leaderboard {
                background-color: #000;
                border: 2px solid #ff4500;
                color: #fff;
                padding: 20px;
                min-width: 400px;
            }
            .leaderboard-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                color: #ffd700;
                font-weight: bold;
            }
            .leaderboard-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #333;
            }
            .rank {
                width: 50px;
                font-weight: bold;
                color: #fff;
            }
            .player-info {
                display: flex;
                align-items: center;
                flex-grow: 1;
            }
            .avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #444;
                margin-right: 10px;
            }
            .username {
                color: #fff;
            }
            .score {
                font-weight: bold;
                color: #ff4500;
                min-width: 60px;
                text-align: right;
            }
            .pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;
            }
            .pagination button {
                background: transparent;
                color: #fff;
                border: none;
                cursor: pointer;
            }
            .page-number {
                margin: 0 15px;
                padding: 5px 15px;
                border: 1px solid #ff4500;
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardList.innerHTML = '<li>Error loading leaderboard</li>';
    }
}

// Update the game speed calculation
function updateGameSpeed() {
    state.speed = state.baseSpeed * state.speedMultiplier;
    if (state.speed > state.maxSpeed) {
        state.speed = state.maxSpeed;
    }
}

// Update camera initial position
camera.position.set(0, 8, 15);
camera.lookAt(0, 0, -5);

// Update the spawnObject function to adjust positions and sizes
function spawnObject() {
    if (Math.random() < 0.02) {
        const shouldSpawnPowerUp = state.obstacleCount >= 2;
        const type = shouldSpawnPowerUp ? 'powerUp' : 'obstacle';
        
        if (shouldSpawnPowerUp) {
            state.obstacleCount = 0;
        } else {
            state.obstacleCount++;
        }

        const spawnAdjacent = type === 'obstacle' && 
                             state.powerUpsCollected >= state.adjacentObstacleThreshold && 
                             Math.random() < 0.3;

        const lanePosition = state.lanePositions[Math.floor(Math.random() * 3)];
        
        let mesh;
        
        if (type === 'obstacle') {
            // Create larger obstacle (2x thicker, 1.5x longer)
            const geometry = new THREE.BoxGeometry(1.5, 0.6, 0.6); // Increased height and depth
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xff6600,
                shininess: 30
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(lanePosition, 0.3, -100); // Adjusted height for obstacles
        } else {
            // Create SP1 power-up
            const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
            
            // Create materials for each face with the SP1 texture
            const materials = [];
            for (let i = 0; i < 6; i++) {
                materials.push(new THREE.MeshPhongMaterial({
                    map: sp1Texture,
                    emissive: 0xff00ff,
                    emissiveIntensity: 0.3,
                    shininess: 50
                }));
            }
            
            mesh = new THREE.Mesh(geometry, materials);
            
            // Position the SP1 block to float above the ground
            mesh.position.set(lanePosition, 1.0, -100); // Raised position
            
            // Adjust rotation to make SP1 text more visible
            mesh.rotation.x = 0; // No x rotation to keep it flat
            mesh.rotation.y = Math.PI / 4; // Rotate slightly for visibility
        }
        
        const object = {
            mesh: mesh,
            type: type,
            z: -100,
            rotationSpeed: type === 'powerUp' ? 0.02 : 0
        };
        
        // Don't set position here since we already set it above
        objects.push(object);
        scene.add(object.mesh);

        // Handle adjacent obstacles
        if (spawnAdjacent) {
            let adjacentLane;
            if (lanePosition === state.lanePositions[0]) {
                adjacentLane = state.lanePositions[1];
            } else if (lanePosition === state.lanePositions[2]) {
                adjacentLane = state.lanePositions[1];
            } else {
                adjacentLane = Math.random() < 0.5 ? state.lanePositions[0] : state.lanePositions[2];
            }

            // Create adjacent obstacle with same larger dimensions
            const adjacentGeometry = new THREE.BoxGeometry(1.5, 0.6, 0.6);
            const adjacentObject = {
                mesh: new THREE.Mesh(
                    adjacentGeometry,
                    new THREE.MeshPhongMaterial({ 
                        color: 0xff6600,
                        shininess: 30
                    })
                ),
                type: 'obstacle',
                z: -100
            };
            
            adjacentObject.mesh.position.set(adjacentLane, 0.3, -100);
            objects.push(adjacentObject);
            scene.add(adjacentObject.mesh);
        }
    }
}

// Show speed notification
function showSpeedNotification(multiplier) {
    speedNotification.textContent = `Speed Increased! (${multiplier.toFixed(1)}x)`;
    speedNotification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        speedNotification.style.display = 'none';
    }, 3000);
}

// Fix for the game start sequence
function startGame() {
    // Reset game state
    state.gameOver = false;
    state.score = 1;
    state.obstacleCount = 0;
    state.powerUpsCollected = 0;
    state.speedMultiplier = 1;
    state.speed = state.baseSpeed;
    scoreDisplay.textContent = state.score;
    
    // Reset bike position
    bike.position.set(0, 0.3, 0);
    
    // Clear any existing objects
    objects.forEach(obj => scene.remove(obj.mesh));
    objects.length = 0;
    
    // Hide game over screen
    gameOverScreen.style.display = 'none';
    
    // Start animation loop
    animate();
}

// Update the start game button event listener
document.getElementById('startGameBtn').addEventListener('click', () => {
    const usernameInput = document.getElementById('usernameInput');
    state.username = usernameInput.value.trim() || 'Anonymous';
    console.log('Username set to:', state.username);
    usernameModal.style.display = 'none';
    
    // Start the game
    startGame();
});

// Prevent the game from starting automatically
window.onload = function() {
    // Don't start animate() here - wait for username
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, -5);
    renderer.render(scene, camera);
};

// Add this function after the scene setup but before the animate function
function createSpaceEnvironment() {
    // Create pink grid floor - place it below the road
    const gridHelper = new THREE.GridHelper(1000, 100, 0xff69b4, 0xff69b4);
    gridHelper.position.y = -0.2; // Lower position to be below the road
    scene.add(gridHelper);
    
    // Create starfield
    const starCount = 1000;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 200;
        starPositions[i * 3 + 1] = Math.random() * 100;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8
    });
    
    const stars = new THREE.Points(starsGeometry, starMaterial);
    scene.add(stars);
    
    // Add a distant light beam
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 50, 32);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(0, 25, -200);
    scene.add(beam);
    
    // Add a glowing base for the beam
    const baseGeometry = new THREE.CircleGeometry(2, 32);
    const baseMaterial = new THREE.MeshBasicMaterial({
        color: 0x00faff,
        transparent: true,
        opacity: 0.5
    });
    const baseGlow = new THREE.Mesh(baseGeometry, baseMaterial);
    baseGlow.rotateX(-Math.PI / 2);
    baseGlow.position.set(0, 0.01, -200);
    scene.add(baseGlow);
    
    return { stars, gridHelper, beam, baseGlow };
}

// Call this function right after scene setup
const spaceElements = createSpaceEnvironment(); 