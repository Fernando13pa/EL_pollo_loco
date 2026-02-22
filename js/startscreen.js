// Start screen functionality
let isMuted = false;
let isPaused = false;
let intervalIds = [];
let menuOpen = false;
let pausedIntervals = [];

/**
 * Adds an interval to the global list for later cleanup
 * @param {number} intervalId - The ID of the interval
 */
function addInterval(intervalId) {
    if (intervalId) intervalIds.push(intervalId);
}

/**
 * Clears all registered intervals and empties the list
 */
function resetIntervals() {
    intervalIds.forEach(clearInterval);
    intervalIds = [];
}

/**
 * Starts the game - hides start screen and initializes World
 */
function startGame() {
    const startScreen = document.getElementById('startScreen');
    const canvas = document.getElementById('canvas');
    const muteButton = document.getElementById('muteButton');
    const settingsButton = document.getElementById('settingsButton');
    startScreen.classList.add('hidden');
    canvas.style.backgroundImage = 'none';
    muteButton.classList.remove('hidden');
    settingsButton.classList.remove('hidden');
    init();
}

/**
 * Opens the options menu from the start screen
 */
function openOptions() {
    const startScreen = document.getElementById('startScreen');
    const optionsMenu = document.getElementById('optionsMenu');
    startScreen.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

/**
 * Closes the options menu - returns to game or start screen
 */
function closeOptions() {
    const canvas = document.getElementById('canvas');
    const startScreen = document.getElementById('startScreen');
    const optionsMenu = document.getElementById('optionsMenu');
    if (typeof world !== 'undefined' && world) {
        canvas.style.filter = 'none';
        optionsMenu.classList.add('hidden');
        menuOpen = false;
        resumeGame();
    } else {
        optionsMenu.classList.add('hidden');
        startScreen.classList.remove('hidden');
        menuOpen = false;
    }
}

/**
 * Shows the controls menu
 */
function showControls() {
    const optionsMenu = document.getElementById('optionsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    optionsMenu.classList.add('hidden');
    controlsMenu.classList.remove('hidden');
}

/**
 * Closes the controls menu
 */
function closeControls() {
    const optionsMenu = document.getElementById('optionsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    controlsMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

/**
 * Shows the game explanation menu
 */
function showGameExplanation() {
    const optionsMenu = document.getElementById('optionsMenu');
    const gameExplanationMenu = document.getElementById('gameExplanationMenu');
    optionsMenu.classList.add('hidden');
    gameExplanationMenu.classList.remove('hidden');
}

/**
 * Closes the game explanation menu
 */
function closeGameExplanation() {
    const optionsMenu = document.getElementById('optionsMenu');
    const gameExplanationMenu = document.getElementById('gameExplanationMenu');
    gameExplanationMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

/**
 * Shows the impressum menu
 */
function showImpressum() {
    const optionsMenu = document.getElementById('optionsMenu');
    const impressumMenu = document.getElementById('impressumMenu');
    optionsMenu.classList.add('hidden');
    impressumMenu.classList.remove('hidden');
}

/**
 * Closes the impressum menu
 */
function closeImpressum() {
    const optionsMenu = document.getElementById('optionsMenu');
    const impressumMenu = document.getElementById('impressumMenu');
    impressumMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

/**
 * Opens the settings menu during gameplay and pauses the game
 */
function openSettings() {
    const canvas = document.getElementById('canvas');
    const optionsMenu = document.getElementById('optionsMenu');
    canvas.style.filter = 'blur(3px)';
    optionsMenu.classList.remove('hidden');
    menuOpen = true;
    pauseGame();
}

/**
 * Pauses the game - stops game loop and sets isPaused flag
 */
function pauseGame() {
    if (typeof world !== 'undefined' && world) {
        if (world.gameLoopInterval) {
            clearInterval(world.gameLoopInterval);
            world.gameLoopInterval = null;
        }
        isPaused = true;
    }
}

/**
 * Resumes the game - sets isPaused to false and restarts game loop
 */
function resumeGame() {
    if (typeof world !== 'undefined' && world && !world.isGameOver) {
        isPaused = false;
        if (!world.gameLoopInterval) {
            world.run();
        }
    }
}

/**
 * Toggles sound on/off - controls all audio elements in the game
 */
function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById('muteButton');
    if (typeof world !== 'undefined' && world) {
        isMuted ? muteAllSounds(muteButton) : unmuteAllSounds(muteButton);
    }
}

/**
 * Mutes all sounds
 * @param {HTMLElement} muteButton - The mute button
 */
function muteAllSounds(muteButton) {
    world.backgroundSound.pause();
    world.backgroundSound.volume = 0;
    world.endbossSound.pause();
    world.endbossSound.volume = 0;
    if (world.character) {
        world.character.runningSound.pause();
        world.character.runningSound.volume = 0;
        world.character.jumpSound.volume = 0;
    }
    muteButton.style.opacity = '0.5';
}

/**
 * Unmutes all sounds
 * @param {HTMLElement} muteButton - The mute button
 */
function unmuteAllSounds(muteButton) {
    world.backgroundSound.volume = 0.3;
    world.backgroundSound.play().catch(() => {});
    world.endbossSound.volume = 1;
    if (world.character) {
        world.character.runningSound.volume = 0.5;
        world.character.jumpSound.volume = 1;
    }
    muteButton.style.opacity = '1';
}

/**
 * Shows game over screen and stops all sounds/intervals
 */
function showGameOver() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const muteButton = document.getElementById('muteButton');
    const settingsButton = document.getElementById('settingsButton');
    gameOverScreen.classList.remove('hidden');
    muteButton.classList.add('hidden');
    settingsButton.classList.add('hidden');
    if (typeof world !== 'undefined' && world) {
        resetIntervals();
        resetEndbossState();
        world.backgroundSound.pause();
        world.endbossSound.pause();
    }
}

/**
 * Resets endboss status so it doesn't look dead
 */
function resetEndbossState() {
    if (world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.isDead = false;
                enemy.deadFrameIndex = 0;
            }
        });
    }
}

/**
 * Shows game won screen and plays victory sound
 */
function showGameWon() {
    const gameWonScreen = document.getElementById('gameWonScreen');
    const muteButton = document.getElementById('muteButton');
    const settingsButton = document.getElementById('settingsButton');
    gameWonScreen.classList.remove('hidden');
    muteButton.classList.add('hidden');
    settingsButton.classList.add('hidden');
    if (typeof world !== 'undefined' && world) {
        resetIntervals();
        stopAllSounds();
    }
    if (!isMuted) {
        let winSound = new Audio('audio/audio_win (1).mp3');
        winSound.play().catch(() => {});
    }
}

/**
 * Stops all sounds in the game
 */
function stopAllSounds() {
    world.backgroundSound.pause();
    world.endbossSound.pause();
    if (world.character) {
        world.character.runningSound.pause();
        world.character.runningSound.currentTime = 0;
        world.character.jumpSound.pause();
        world.character.jumpSound.currentTime = 0;
    }
}

/**
 * Restarts the game from the beginning - deletes old world and creates new one
 */
function restartGame() {
    hideAllScreens();
    resetIntervals();
    resetStaticPositions();
    if (typeof world !== 'undefined' && world) {
        world.isActive = false;
        stopWorldSounds();
        world = null;
    }
    isMuted = false;
    isPaused = false;
    startGame();
}

/**
 * Hides all game over/won/menu screens
 */
function hideAllScreens() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('gameWonScreen').classList.add('hidden');
    document.getElementById('optionsMenu').classList.add('hidden');
    document.getElementById('controlsMenu').classList.add('hidden');
    document.getElementById('gameExplanationMenu').classList.add('hidden');
    document.getElementById('impressumMenu').classList.add('hidden');
    const canvas = document.getElementById('canvas');
    canvas.style.filter = 'none';
    menuOpen = false;
}

/**
 * Stops all world sounds before restart
 */
function stopWorldSounds() {
    if (world.backgroundSound) {
        world.backgroundSound.pause();
        world.backgroundSound.currentTime = 0;
    }
    if (world.endbossSound) {
        world.endbossSound.pause();
        world.endbossSound.currentTime = 0;
    }
    if (world.character) {
        world.character.runningSound.pause();
        world.character.runningSound.currentTime = 0;
        world.character.jumpSound.pause();
        world.character.jumpSound.currentTime = 0;
    }
}

/**
 * Resets static position arrays of item classes
 */
function resetStaticPositions() {
    Coin.placedPositions = [];
    Bottle.placedPositions = [];
}

