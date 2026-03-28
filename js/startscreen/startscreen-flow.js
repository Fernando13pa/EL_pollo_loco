/**
 * Displays the game-over screen, hides gameplay buttons, and stops the running world.
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
 * Clears the endboss death flags so a restarted game begins with a living boss.
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
 * Displays the win screen, stops the world, and plays the victory sound.
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

/**
 * Displays one end screen and hides the gameplay buttons.
 * @param {string} screenId - The ID of the end screen to show
 */
function showEndScreen(screenId) {
    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById('muteButton').classList.add('hidden');
    document.getElementById('settingsButton').classList.add('hidden');
}

/**
 * Resets the UI, timers, item placement state, and world instance before a new round starts.
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
 * Hides all overlay screens and clears the canvas blur effect.
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
 * Clears the remembered random placement positions for collectible items.
 */
function resetStaticPositions() {
    Coin.placedPositions = [];
    Bottle.placedPositions = [];
}
