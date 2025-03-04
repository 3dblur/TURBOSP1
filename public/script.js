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
/*
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
    <button id="startGameBtn" style="padding: 10px 20px; background-color:rgb(192, 46, 190); color: white; border: none; border-radius: 5px; cursor: pointer;">Start Game</button>
`;

usernameModal.appendChild(usernameContent);
document.body.appendChild(usernameModal);
*/
// Add username modal
// Add username modal
const usernameModal = document.createElement('div');
usernameModal.id = 'usernameModal';
usernameModal.style.position = 'fixed';
usernameModal.style.top = '0';
usernameModal.style.left = '0';
usernameModal.style.width = '100%';
usernameModal.style.height = '100%';
usernameModal.style.backgroundColor = 'rgba(255, 105, 180, 0.5)'; // Pinkish transparent background (hot pink)
usernameModal.style.display = 'flex';
usernameModal.style.justifyContent = 'center';
usernameModal.style.alignItems = 'center';
usernameModal.style.zIndex = '2000';

const usernameContent = document.createElement('div');
usernameContent.style.background = 'linear-gradient(180deg, #FF69B4, #FFC1CC)'; // Gradient from hot pink to light pink
usernameContent.style.border = '2px solid #FF1493'; // Deep pink border
usernameContent.style.padding = '15px'; // Adjusted padding
usernameContent.style.width = '400px'; // Slightly wider for modern look
usernameContent.style.boxShadow = 'inset 1px 1px 0px #FFB6C1, inset -1px -1px 0px #FF69B4, inset 2px 2px 0px #FFF, inset -2px -2px 0px #C71585'; // Pink beveled effect
usernameContent.style.fontFamily = "'Chicago', 'Arial', sans-serif"; // Retro font (fallback to Arial)
usernameContent.style.position = 'relative'; // For positioning window controls

// Pink-themed HTML content with Mac OS 7-style window controls
usernameContent.innerHTML = `
    <div style="position: absolute; top: 5px; left: 5px; display: flex; gap: 5px;">
        <button id="closeBtn" style="width: 12px; height: 12px; background: #FF4040; border: 1px solid #C71585; border-radius: 50%; cursor: pointer;"></button>
        <button id="minimizeBtn" style="width: 12px; height: 12px; background: #FFBF00; border: 1px solid #C71585; border-radius: 50%; cursor: pointer;"></button>
        <button id="maximizeBtn" style="width: 12px; height: 12px; background: #00FF00; border: 1px solid #C71585; border-radius: 50%; cursor: pointer;"></button>
    </div>
    <div style="font-size: 18px; font-weight: bold; text-align: center; margin-top: 20px; margin-bottom: 10px; color: #FFF; text-shadow: 1px 1px 0px #C71585;">
        Enter Your Username
    </div>
    <div style="font-size: 14px; text-align: center; margin-bottom: 20px; color: #FFF; text-shadow: 1px 1px 0px #C71585;">
        Please enter a username to track your scores on the leaderboard.
    </div>
    <input type="text" id="usernameInput" placeholder="Username" style="width: 100%; padding: 8px; margin-bottom: 20px; border: 2px solid #FF1493; background: #FFE4E1; font-family: 'Chicago', 'Arial', sans-serif; font-size: 14px; box-sizing: border-box; color: #C71585; text-align: center;">
    <div style="text-align: center;">
        <button id="startGameBtn" style="padding: 8px 20px; border: 2px solid #FF1493; background: #FF69B4; font-family: 'Chicago', 'Arial', sans-serif; font-size: 14px; cursor: pointer; color: #FFF; text-shadow: 1px 1px 0px #C71585;">Start Game</button>
    </div>
`;

usernameModal.appendChild(usernameContent);
document.body.appendChild(usernameModal);

// Add retro font and button styles
const style = document.createElement('style');
style.textContent = `
    @font-face {
        font-family: 'Chicago';
        src: url('https://db.onlinewebfonts.com/t/6b290d6c2d0432f8e4e7e3f0a6e8f2f6.woff') format('woff');
    }
    #startGameBtn:hover {
        background: #FF1493; /* Deep pink on hover */
    }
    #startGameBtn:active {
        background: #C71585; /* Darker pink when pressed */
    }
    #closeBtn:hover {
        background: #FF6666;
    }
    #minimizeBtn:hover {
        background: #FFD700;
    }
    #maximizeBtn:hover {
        background: #33FF33;
    }
`;
document.head.appendChild(style);


//endedit
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

// Create a detailed superbike based on the reference image
function createDetailedBike() {
    const group = new THREE.Group();

    // Main body - red sport bike
    const bodyGeometry = new THREE.BoxGeometry(0.7, 0.3, 1.8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000, // Red
        metalness: 0.8,
        roughness: 0.2,
        shininess: 90
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    group.add(body);
    
    // Create the seat - black
    const seatGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.8);
    const blackMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x111111, // Black
        metalness: 0.5,
        roughness: 0.5
    });
    const seat = new THREE.Mesh(seatGeometry, blackMaterial);
    seat.position.set(0, 0.55, -0.2);
    group.add(seat);
    
    // Create the tank - red with black stripe
    const tankGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.6);
    const tank = new THREE.Mesh(tankGeometry, bodyMaterial);
    tank.position.set(0, 0.55, 0.4);
    group.add(tank);
    
    // Black stripe down the middle of the tank
    const stripeGeometry = new THREE.BoxGeometry(0.1, 0.21, 0.61);
    const stripe = new THREE.Mesh(stripeGeometry, blackMaterial);
    stripe.position.set(0, 0.55, 0.4);
    group.add(stripe);
    
    // Front fairing - more detailed
    const fairingGeometry = new THREE.ConeGeometry(0.35, 0.7, 8);
    const fairing = new THREE.Mesh(fairingGeometry, bodyMaterial);
    fairing.rotation.x = -Math.PI / 2;
    fairing.position.set(0, 0.4, 1.0);
    group.add(fairing);
    
    // Handlebars
    const handlebarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8);
    const handlebarMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const handlebar = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(0, 0.65, 0.8);
    group.add(handlebar);
    
    // Mirrors
    const mirrorGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.15);
    const mirrorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        metalness: 0.9
    });
    
    const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    leftMirror.position.set(0.4, 0.65, 0.8);
    group.add(leftMirror);
    
    const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    rightMirror.position.set(-0.4, 0.65, 0.8);
    group.add(rightMirror);
    
    // Front wheel with tire and rim
    const wheelRadius = 0.4;
    const wheelThickness = 0.15;
    
    // Tire (black)
    const tireGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 24);
    const tireMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x111111,
        roughness: 0.9
    });
    
    const frontTire = new THREE.Mesh(tireGeometry, tireMaterial);
    frontTire.rotation.z = Math.PI / 2;
    frontTire.position.set(0, 0.4, 1.2);
    group.add(frontTire);
    
    // Rim (silver)
    const rimGeometry = new THREE.CylinderGeometry(wheelRadius * 0.7, wheelRadius * 0.7, wheelThickness + 0.01, 16);
    const rimMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1
    });
    
    const frontRim = new THREE.Mesh(rimGeometry, rimMaterial);
    frontRim.rotation.z = Math.PI / 2;
    frontRim.position.set(0, 0.4, 1.2);
    group.add(frontRim);
    
    // Rear wheel with tire and rim
    const rearTire = new THREE.Mesh(tireGeometry, tireMaterial);
    rearTire.rotation.z = Math.PI / 2;
    rearTire.position.set(0, 0.4, -0.8);
    group.add(rearTire);
    
    const rearRim = new THREE.Mesh(rimGeometry, rimMaterial);
    rearRim.rotation.z = Math.PI / 2;
    rearRim.position.set(0, 0.4, -0.8);
    group.add(rearRim);
    
    // Front forks
    const forkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
    const forkMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    
    const rightFork = new THREE.Mesh(forkGeometry, forkMaterial);
    rightFork.position.set(0.2, 0.4, 1.0);
    group.add(rightFork);
    
    const leftFork = new THREE.Mesh(forkGeometry, forkMaterial);
    leftFork.position.set(-0.2, 0.4, 1.0);
    group.add(leftFork);
    
    // Exhaust pipes
    const exhaustGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.6, 8);
    const exhaustMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.1
    });
    
    const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(0.2, 0.3, -0.9);
    group.add(exhaust);
    
    // Rider - positioned like in the reference image
    // Rider body - create a more realistic riding position
    const riderTorsoGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.6);
    const riderMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x222222, // Black suit
        roughness: 0.7
    });
    
    const riderTorso = new THREE.Mesh(riderTorsoGeometry, riderMaterial);
    riderTorso.position.set(0, 0.8, 0);
    riderTorso.rotation.x = Math.PI / 8; // Leaning forward
    group.add(riderTorso);
    
    // Red jacket parts
    const jacketGeometry = new THREE.BoxGeometry(0.42, 0.52, 0.4);
    const jacketMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000, // Red jacket
        roughness: 0.7
    });
    
    const jacket = new THREE.Mesh(jacketGeometry, jacketMaterial);
    jacket.position.set(0, 0.8, 0.1);
    jacket.rotation.x = Math.PI / 8; // Match torso lean
    group.add(jacket);
    
    // Helmet - yellow like in the reference
    const helmetGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const helmetMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffff00, // Yellow helmet
        roughness: 0.5,
        metalness: 0.2
    });
    
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.set(0, 1.1, 0.2);
    helmet.scale.set(1, 0.8, 1); // Slightly flattened
    group.add(helmet);
    
    // Helmet visor
    const visorGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.05);
    const visorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x111111,
        metalness: 0.9,
        opacity: 0.7,
        transparent: true
    });
    
    const visor = new THREE.Mesh(visorGeometry, visorMaterial);
    visor.position.set(0, 1.1, 0.35);
    group.add(visor);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    
    // Left arm
    const leftArm = new THREE.Mesh(armGeometry, riderMaterial);
    leftArm.position.set(0.3, 0.8, 0.4);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.rotation.y = -Math.PI / 8;
    group.add(leftArm);
    
    // Right arm
    const rightArm = new THREE.Mesh(armGeometry, riderMaterial);
    rightArm.position.set(-0.3, 0.8, 0.4);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.rotation.y = Math.PI / 8;
    group.add(rightArm);
    
    // Legs
    const thighGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.15);
    
    // Left thigh
    const leftThigh = new THREE.Mesh(thighGeometry, riderMaterial);
    leftThigh.position.set(0.2, 0.5, -0.2);
    leftThigh.rotation.x = Math.PI / 4;
    group.add(leftThigh);
    
    // Right thigh
    const rightThigh = new THREE.Mesh(thighGeometry, riderMaterial);
    rightThigh.position.set(-0.2, 0.5, -0.2);
    rightThigh.rotation.x = Math.PI / 4;
    group.add(rightThigh);
    
    // Lower legs
    const calfGeometry = new THREE.BoxGeometry(0.12, 0.4, 0.12);
    
    // Left calf
    const leftCalf = new THREE.Mesh(calfGeometry, riderMaterial);
    leftCalf.position.set(0.2, 0.3, -0.5);
    leftCalf.rotation.x = -Math.PI / 8;
    group.add(leftCalf);
    
    // Right calf
    const rightCalf = new THREE.Mesh(calfGeometry, riderMaterial);
    rightCalf.position.set(-0.2, 0.3, -0.5);
    rightCalf.rotation.x = -Math.PI / 8;
    group.add(rightCalf);

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
        }//spaceElements.stars.position.z += state.speed;

    // Reset the starfield position when it moves too far
    if (spaceElements.stars.position.z > 100) {
        spaceElements.stars.position.z = -100; // Adjust these values based on your scene
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
/*
animate();*/

// Game Over Logic
function gameOver() {
    state.gameOver = true;
    finalScoreDisplay.textContent = state.score;
    
    console.log('Game over - username:', state.username);
    
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

    // Simulate sharing on X (simplified, no real API call here)
   
});

lockInBtn.addEventListener('click', () => {
    alert("You're now locked in");
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
        // Add detailed console logging
        console.log('Saving score with:', {
            username: state.username,
            score: score
        });
        
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: state.username,
                score: score
            })
        });
        
        const result = await response.json();
        console.log('Server response:', result);
        
        // Fetch updated leaderboard
        fetchLeaderboard();
    } catch (error) {
        console.error('Error saving score:', error);
    }
}
//changed leaderboard below
async function fetchLeaderboard() {
    try {
        const limit = 10; // Fetch top 20 scores
        const response = await fetch(`/api/scores?limit=${limit}`);
        const scores = await response.json();
        
        console.log("Fetched leaderboard data:", scores);
        
        // Clear existing leaderboard
        leaderboardList.innerHTML = '';
        
        // Add title bar (empty since controls are moving)
        const titleBar = document.createElement('div');
        titleBar.className = 'title-bar';
        leaderboardList.appendChild(titleBar);
        
        // Create top section for controls and header
        const topSection = document.createElement('div');
        topSection.style.display = 'flex';
        topSection.style.alignItems = 'center';
        topSection.style.justifyContent = 'space-between';
        
        // Add window controls
        const windowControls = document.createElement('div');
        windowControls.className = 'window-controls';
        windowControls.innerHTML = `
            <button id="leaderboardCloseBtn"></button>
            <button id="leaderboardMinimizeBtn"></button>
            <button id="leaderboardMaximizeBtn"></button>
        `;
        topSection.appendChild(windowControls);
        
        // Add header row beside controls, smaller and white
        const headerRow = document.createElement('div');
        headerRow.className = 'leaderboard-header';
        headerRow.style.fontSize = '14px'; // Smaller size
        headerRow.style.color = 'white';   // White color
        headerRow.style.flexGrow = '1';    // Take available space
        headerRow.style.textAlign = 'center'; // Center the text
        headerRow.innerHTML = `
            <div class="rank">RANK</div>
            <div class="name">NAME</div>
            <div class="score">SCORE</div>
        `;
        topSection.appendChild(headerRow);
        
        leaderboardList.appendChild(topSection);
        
        // Create scrollable container for leaderboard items
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'leaderboard-scroll-container';
        scrollContainer.style.maxHeight = '400px'; // Fixed height for scrolling
        scrollContainer.style.overflowY = 'auto';  // Enable vertical scrolling
        scrollContainer.style.paddingRight = '10px'; // Space for scrollbar
        
        // Add each score with proper username (limited to top 20)
        scores.slice(0, 20).forEach((score, index) => { // Ensure only 20 entries
            const listItem = document.createElement('div');
            listItem.className = 'leaderboard-item';
            
            const displayUsername = score.username ? score.username : 'Anonymous';
            
            listItem.innerHTML = `
                <div class="rank">#${index + 1}</div>
                <div class="player-info">
                    <div class="avatar"></div>
                    <div class="username">@${displayUsername}</div>
                </div>
                <div class="score">${score.score}</div>
            `;
            scrollContainer.appendChild(listItem);
        });
        
        leaderboardList.appendChild(scrollContainer);
        
        // Add functionality for window control buttons
        document.getElementById('leaderboardCloseBtn').addEventListener('click', () => {
            leaderboard.style.display = 'none';
        });

        document.getElementById('leaderboardMinimizeBtn').addEventListener('click', () => {
            leaderboard.style.transform = 'scale(0.1)';
            leaderboard.style.opacity = '0.3';
            setTimeout(() => {
                leaderboard.style.transform = 'scale(1)';
                leaderboard.style.opacity = '1';
            }, 1000);
        });

        document.getElementById('leaderboardMaximizeBtn').addEventListener('click', () => {
            if (leaderboard.style.width === '400px' || !leaderboard.style.width) {
                leaderboard.style.width = '600px';
                leaderboard.style.height = '500px';
                scrollContainer.style.maxHeight = '450px'; // Adjust scroll area when maximized
            } else {
                leaderboard.style.width = '400px';
                leaderboard.style.height = 'auto';
                scrollContainer.style.maxHeight = '400px'; // Reset to default
            }
        });

        // Add functionality for the close button at the bottom
        document.getElementById('closeLeaderboard').addEventListener('click', () => {
            leaderboard.style.display = 'none';
        });
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
    const username = usernameInput.value.trim();
    
    if (!username) {
        alert('Please enter a username.');
        return;
    }
    
    state.username = username;
    console.log('Username set to:', state.username);
    usernameModal.style.display = 'none';
    
    // Start the game
    startGame();
});
//document.getElementById('startGameBtn').addEventListener('click', () => {
  //  const usernameInput = document.getElementById('usernameInput');
    //state.username = usernameInput.value.trim() || 'Anonymous';
    //console.log('Username set to:', state.username);
    //usernameModal.style.display = 'none';
    
    // Start the game
    //startGame();
//});

// Prevent the game from starting automatically
window.onload = function() {
    // Don't start animate() here - wait for username
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, -5);
    renderer.render(scene, camera);
};

// Add this function after the scene setup but before the animate function
/*function createSpaceEnvironment() {
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
    
    // Return only the stars and grid helper
    return { stars, gridHelper };
}
*/
function createSpaceEnvironment() {
    // Create pink grid floor - place it below the road
    const gridHelper = new THREE.GridHelper(1000, 100, 0xff69b4, 0xff69b4);
    gridHelper.position.y = -0.2; // Lower position to be below the road
    scene.add(gridHelper);
    
    // Create starfield
    const starCount = 1000;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    
    // Define road boundaries
    const roadMinX = -10.5; // Road width including shoulders
    const roadMaxX = 10.5;
    const roadMaxY = 5; // Maximum height above the road to consider "close"
    const roadMinZ = -500; // Road extends from z = -500 (based on road length 1000)
    const roadMaxZ = 500;

    // Generate star positions, filtering out those near the road
    for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 200; // x: -100 to 100
        const y = Math.random() * 100;          // y: 0 to 100
        const z = (Math.random() - 0.5) * 200; // z: -100 to 100

        // Skip stars that are within the road's x-range AND below the height threshold
        if (x >= roadMinX && x <= roadMaxX && y <= roadMaxY) {
            continue; // Skip this star
        }

        // Add star to positions array
        starPositions.push(x, y, z);
    }

    // Convert star positions to Float32Array for BufferGeometry
    const starPositionsArray = new Float32Array(starPositions);
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositionsArray, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8
    });
    
    const stars = new THREE.Points(starsGeometry, starMaterial);
    scene.add(stars);
    const loader = new THREE.TextureLoader();
    const logoTexture = loader.load('/logo.png'); // Load the PNG from public directory
    const logoGeometry = new THREE.PlaneGeometry(200, 50); // Adjust size as needed
    const logoMaterial = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true, // Supports PNG transparency
        side: THREE.DoubleSide,
        emissive: 0xffffff, // White emissive for basic glow
        emissiveIntensity: 0.5 // Adjust intensity for glow strength
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 20, -500); // Position behind stars (stars are at z = -100 to 100)
    scene.add(logo);
    return { stars, gridHelper };
}

// Call this function right after scene setup
const spaceElements = createSpaceEnvironment(); 