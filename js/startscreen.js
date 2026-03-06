// Start screen functionality
const MUTE_STORAGE_KEY = 'el_pollo_loco_is_muted';
let isMuted = loadMutePreference();
let isPaused = false;
let intervalIds = [];
let menuOpen = false;
let pausedIntervals = [];
let impressumReturnTarget = 'options';

/**
 * Loads mute preference from localStorage
 * @returns {boolean}
 */
function loadMutePreference() {
    try {
        return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
    } catch (_) {
        return false;
    }
}

/**
 * Persists mute preference in localStorage
 */
function saveMutePreference() {
    try {
        localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
    } catch (_) {
        // Ignore storage access errors (e.g. private mode restrictions)
    }
}

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
    hideStartScreenAndBackground();
    showGameplayButtons();
    updateMuteButtonUI();
    init();
}

function hideStartScreenAndBackground() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('canvas').style.backgroundImage = 'none';
}

function showGameplayButtons() {
    document.getElementById('muteButton').classList.remove('hidden');
    document.getElementById('settingsButton').classList.remove('hidden');
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) mobileControls.classList.remove('hidden');
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
    optionsMenu.classList.add('hidden');
    menuOpen = false;
    if (typeof world !== 'undefined' && world) {
        canvas.style.filter = 'none';
        resumeGame();
    } else {
        startScreen.classList.remove('hidden');
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
function showImpressum(returnTarget = 'options') {
    const optionsMenu = document.getElementById('optionsMenu');
    const impressumMenu = document.getElementById('impressumMenu');
    impressumReturnTarget = returnTarget;
    optionsMenu.classList.add('hidden');
    impressumMenu.classList.remove('hidden');
}

/**
 * Opens the impressum menu from the desktop footer link
 */
function openImpressumFromFooter() {
    const optionsMenu = document.getElementById('optionsMenu');
    const hasWorld = typeof world !== 'undefined' && world;
    const isOptionsOpen = !optionsMenu.classList.contains('hidden');
    const returnTarget = isOptionsOpen ? 'options' : (hasWorld ? 'none' : 'start');
    showImpressum(returnTarget);
}

/**
 * Closes the impressum menu
 */
function closeImpressum() {
    document.getElementById('impressumMenu').classList.add('hidden');
    restoreImpressumReturnTarget();
    impressumReturnTarget = 'options';
}

function restoreImpressumReturnTarget() {
    if (impressumReturnTarget === 'options') {
        document.getElementById('optionsMenu').classList.remove('hidden');
    }
    if (impressumReturnTarget === 'start') {
        document.getElementById('startScreen').classList.remove('hidden');
    }
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
    saveMutePreference();
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.blur();
    }
    updateMuteButtonUI();
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
 * Resets the mute button display
 */
function resetMuteButtonUI() {
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.style.opacity = isMuted ? '0.5' : '1';
    }
}

/**
 * Keeps mute button UI in sync with current mute state
 */
function updateMuteButtonUI() {
    resetMuteButtonUI();
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
                enemy.deadAnimationLoops = 0;
            }
        });
    }
}

/**
 * Shows game won screen and plays victory sound
 */
function showGameWon() {
    showEndScreen('gameWonScreen');
    if (typeof world !== 'undefined' && world) {
        resetIntervals();
        stopAllSounds();
    }
    if (!isMuted) {
        let winSound = new Audio('audio/audio_win (1).mp3');
        winSound.play().catch(() => {});
    }
}

function showEndScreen(screenId) {
    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById('muteButton').classList.add('hidden');
    document.getElementById('settingsButton').classList.add('hidden');
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
    isPaused = false;
    updateMuteButtonUI();
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
    resetAudio(world.backgroundSound);
    resetAudio(world.endbossSound);
    if (world.character) {
        resetAudio(world.character.runningSound);
        resetAudio(world.character.jumpSound);
    }
}

function resetAudio(audio) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
}

/**
 * Resets static position arrays of item classes
 */
function resetStaticPositions() {
    Coin.placedPositions = [];
    Bottle.placedPositions = [];
}

