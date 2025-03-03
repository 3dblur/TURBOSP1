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

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true,
    alpha: true // Add this to ensure proper canvas initialization
});
renderer.setClearColor(0x87CEEB); // Add this to set sky blue background color
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

// Update the road/track creation with more detail
function createDetailedRoad() {
    const roadGroup = new THREE.Group();
    
    // Main road (wider and more detailed)
    const roadGeometry = new THREE.PlaneGeometry(6, 1000, 20, 1000);
    const roadMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.1;
    roadGroup.add(road);

    // Road lines
    const lineGeometry = new THREE.PlaneGeometry(0.15, 1000);
    const lineMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFFFFF,
        emissive: 0x666666
    });

    // Center lines (dashed)
    for (let i = 0; i < 50; i++) {
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.rotation.x = -Math.PI / 2;
        line.position.z = -i * 20;
        line.position.y = -0.09;
        roadGroup.add(line);
    }

    // Side lines (continuous)
    const sideLineGeometry = new THREE.PlaneGeometry(0.15, 1000);
    const leftLine = new THREE.Mesh(sideLineGeometry, lineMaterial);
    const rightLine = new THREE.Mesh(sideLineGeometry, lineMaterial);
    
    leftLine.rotation.x = -Math.PI / 2;
    rightLine.rotation.x = -Math.PI / 2;
    leftLine.position.set(-3, -0.09, 0);
    rightLine.position.set(3, -0.09, 0);
    
    roadGroup.add(leftLine);
    roadGroup.add(rightLine);

    // Add road shoulders
    const shoulderGeometry = new THREE.PlaneGeometry(2, 1000);
    const shoulderMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        roughness: 1
    });

    const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
    const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
    
    leftShoulder.rotation.x = -Math.PI / 2;
    rightShoulder.rotation.x = -Math.PI / 2;
    leftShoulder.position.set(-4, -0.11, 0);
    rightShoulder.position.set(4, -0.11, 0);
    
    roadGroup.add(leftShoulder);
    roadGroup.add(rightShoulder);

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

function spawnObject() {
    if (Math.random() < 0.02) {
        const lane = Math.floor(Math.random() * 3) * 2 - 2;
        const type = Math.random() < 0.7 ? 'obstacle' : 'powerUp';
        
        // Add different obstacle types
        const obstacleTypes = ['box', 'cylinder', 'sphere'];
        const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        
        let geometry;
        if (obstacleType === 'box') {
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        } else if (obstacleType === 'cylinder') {
            geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.5);
        } else {
            geometry = new THREE.SphereGeometry(0.25);
        }

        const object = {
            mesh: new THREE.Mesh(
                geometry,
                new THREE.MeshPhongMaterial({ 
                    color: type === 'obstacle' ? 0xffa500 : 0xff00ff,
                    shininess: 30
                })
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
    speed: 0.3,
    maxSpeed: 0.8,
    acceleration: 0.0002,
    bikeLane: 1, // 0, 1, 2 for left, middle, right
    score: 1,
    highScore: 1,
    gameOver: false
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

// Update the animation loop to fix wheel rotation
function animate() {
    if (state.gameOver) return;

    requestAnimationFrame(animate);

    // Move road and update its position
    road.position.z += state.speed;
    if (road.position.z > 20) {
        road.position.z = 0;
    }

    // Update bike controls
    updateControls();

    // Rotate wheels realistically
    const wheelRotationSpeed = state.speed * 10; // Adjust this multiplier for realistic rotation
    bike.children.forEach(child => {
        if (child.isGroup) { // Check if it's a wheel group
            child.rotation.x += wheelRotationSpeed;
        }
    });

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

    // Update camera to follow bike more smoothly
    const idealOffset = new THREE.Vector3(
        bike.position.x * 0.8, // Smoother horizontal following
        4, // Higher camera position
        8 // Further back
    );
    camera.position.lerp(idealOffset, 0.05);
    camera.lookAt(bike.position.x * 0.5, 0, bike.position.z - 5);

    // Update UI
    scoreDisplay.textContent = state.score;

    renderer.render(scene, camera);
}

// Update the bike controls for smoother movement
function updateControls() {
    if (keys['ArrowLeft'] && state.bikeLane > 0) state.bikeLane--;
    if (keys['ArrowRight'] && state.bikeLane < 2) state.bikeLane++;
    
    const targetX = (state.bikeLane - 1) * 2;
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
    bike.position.set(0, 0.3, 0);
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

// Add progressive difficulty
function updateGameSpeed() {
    state.speed += state.acceleration;
    if (state.speed > state.maxSpeed) {
        state.speed = state.maxSpeed;
    }
}

// Update camera initial position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0); 