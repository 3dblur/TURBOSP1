// audioManager.js

// We'll create the AudioContext only when needed
let audioContext = null;

// Store audio buffers for all sounds
const audioBuffers = {};
let gameMusicSource = null;
let gameMusicGainNode = null;
let bikeSource = null;
let bikeGainNode = null;

// One-shot sounds (no looping)
const oneShotSounds = {
  gameStart: null,
  gameOver: null,
  crash: null,
  powerUp: null,
  button: null,
};

// Initialize audio system - call this on user interaction (click, touch, button press)
function initAudio() {
  if (audioContext === null) {
    audioContext = new AudioContext();
    return true;
  } else if (audioContext.state === 'suspended') {
    audioContext.resume();
    return true;
  }
  return false;
}

// Load all audio files
async function loadAudioFiles() {
  // Make sure audio is initialized first
  if (!audioContext) {
    initAudio();
  }
  
  const audioFiles = {
    gameMusic: '/game_music.mp3',
    bike: '/bikesfx.mp3',
    gameStart: '/game_start.mp3',
    gameOver: '/gameover.mp3',
    crash: '/crash.mp3',
    powerUp: '/powerup.mp3',
    button: '/button.mp3',
  };

  try {
    for (const [key, url] of Object.entries(audioFiles)) {
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to load audio file: ${url}`);
        continue;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      audioBuffers[key] = await audioContext.decodeAudioData(arrayBuffer);
    }
    return true;
  } catch (error) {
    console.error("Error loading audio files:", error);
    return false;
  }
}

// Create and connect a source node
function createSource(buffer, loop = false) {
  if (!audioContext) return { source: null, gainNode: null };
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = loop;

  const gainNode = audioContext.createGain();
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { source, gainNode };
}

// Crossfade between two looping sources
function crossfadeTo(newSource, newGainNode, oldSource, oldGainNode, fadeDuration = 0.5) {
  if (!audioContext) return;
  
  if (oldSource) {
    oldGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
    setTimeout(() => {
      try {
        oldSource.stop();
      } catch (e) {
        // Ignore errors if source is already stopped
      }
    }, fadeDuration * 1000);
  }
  
  newSource.start(0);
  newGainNode.gain.setValueAtTime(0, audioContext.currentTime);
  newGainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + fadeDuration);
}

// Play game music with crossfade
function playGameMusic() {
  if (!audioContext || !audioBuffers.gameMusic) return;
  
  const { source, gainNode } = createSource(audioBuffers.gameMusic, true);
  if (!source) return;
  
  crossfadeTo(source, gainNode, gameMusicSource, gameMusicGainNode);
  gameMusicSource = source;
  gameMusicGainNode = gainNode;
}

// Stop game music with fade out
function stopGameMusic(fadeDuration = 0.5) {
  if (!audioContext || !gameMusicSource) return;
  
  gameMusicGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
  setTimeout(() => {
    try {
      gameMusicSource.stop();
    } catch (e) {
      // Ignore errors if source is already stopped
    }
    gameMusicSource = null;
    gameMusicGainNode = null;
  }, fadeDuration * 1000);
}

// Play bike sound with pitch shifting
function playBikeSound() {
  if (!audioContext || !audioBuffers.bike) return;
  
  const { source, gainNode } = createSource(audioBuffers.bike, true);
  if (!source) return;
  
  crossfadeTo(source, gainNode, bikeSource, bikeGainNode);
  bikeSource = source;
  bikeGainNode = gainNode;
}

function updateBikePitch(speed) {
  if (!audioContext || !bikeSource) return;
  
  const pitchTier = getPitchTier(speed);
  bikeSource.playbackRate.linearRampToValueAtTime(pitchTier, audioContext.currentTime + 0.2);
}

function getPitchTier(speed) {
  const basePitch = 1.0;
  if (speed < 0.6) return basePitch;
  if (speed < 1.0) return basePitch * 1.5;
  return basePitch * 2.0;
}

function stopBikeSound(fadeDuration = 0.5) {
  if (!audioContext || !bikeSource) return;
  
  bikeGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
  setTimeout(() => {
    try {
      bikeSource.stop();
    } catch (e) {
      // Ignore errors if source is already stopped
    }
    bikeSource = null;
    bikeGainNode = null;
  }, fadeDuration * 1000);
}

// Play one-shot sounds
function playOneShot(soundKey) {
  if (!audioContext || !audioBuffers[soundKey]) return null;
  
  const { source, gainNode } = createSource(audioBuffers[soundKey], false);
  if (!source) return null;
  
  gainNode.gain.value = 0.7;
  source.start(0);
  return source;
}

// Check if audio is initialized and ready
function isAudioReady() {
  return audioContext !== null && audioContext.state === 'running';
}

// Attach audioManager to the global window object
window.audioManager = {
  initAudio,
  loadAudioFiles,
  playGameMusic,
  stopGameMusic,
  playBikeSound,
  updateBikePitch,
  stopBikeSound,
  playGameStart: () => playOneShot('gameStart'),
  playGameOver: () => playOneShot('gameOver'),
  playCrash: () => playOneShot('crash'),
  playPowerUp: () => playOneShot('powerUp'),
  playButton: () => playOneShot('button'),
  resumeContext: () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  },
  isAudioReady,
};