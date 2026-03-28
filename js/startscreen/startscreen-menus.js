/**
 * Hides the start screen, shows the gameplay UI, and starts a fresh game world.
 */
function startGame() {
    hideStartScreenAndBackground();
    showGameplayButtons();
    updateMuteButtonUI();
    init();
}

/**
 * Hides the start screen and removes the canvas background image.
 */
function hideStartScreenAndBackground() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('canvas').style.backgroundImage = 'none';
}

/**
 * Reveals the gameplay buttons that are needed after the round starts.
 */
function showGameplayButtons() {
    document.getElementById('muteButton').classList.remove('hidden');
    document.getElementById('settingsButton').classList.remove('hidden');
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) mobileControls.classList.remove('hidden');
}

/**
 * Switches from the start screen to the options menu.
 */
function openOptions() {
    const startScreen = document.getElementById('startScreen');
    const optionsMenu = document.getElementById('optionsMenu');
    startScreen.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

/**
 * Leaves the options menu and returns either to gameplay or to the start screen.
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
 * Replaces the options menu with the controls menu.
 */
function showControls() {
    const optionsMenu = document.getElementById('optionsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    optionsMenu.classList.add('hidden');
    controlsMenu.classList.remove('hidden');
}

/**
 * Leaves the controls menu and returns to the options menu.
 */
function closeControls() {
    const optionsMenu = document.getElementById('optionsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    controlsMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

/**
 * Replaces the options menu with the game explanation menu.
 */
function showGameExplanation() {
    const optionsMenu = document.getElementById('optionsMenu');
    const gameExplanationMenu = document.getElementById('gameExplanationMenu');
    optionsMenu.classList.add('hidden');
    gameExplanationMenu.classList.remove('hidden');
}

/**
 * Leaves the game explanation menu and returns to the options menu.
 */
function closeGameExplanation() {
    const optionsMenu = document.getElementById('optionsMenu');
    const gameExplanationMenu = document.getElementById('gameExplanationMenu');
    gameExplanationMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

/**
 * Shows the impressum menu and stores the screen that should reopen afterward.
 * @param {string} returnTarget - The screen to reopen after closing the impressum
 */
function showImpressum(returnTarget = 'options') {
    const optionsMenu = document.getElementById('optionsMenu');
    const impressumMenu = document.getElementById('impressumMenu');
    impressumReturnTarget = returnTarget;
    optionsMenu.classList.add('hidden');
    impressumMenu.classList.remove('hidden');
}

/**
 * Shows the impressum menu from the footer and chooses the correct return target.
 */
function openImpressumFromFooter() {
    const optionsMenu = document.getElementById('optionsMenu');
    const hasWorld = typeof world !== 'undefined' && world;
    const isOptionsOpen = !optionsMenu.classList.contains('hidden');
    const returnTarget = isOptionsOpen ? 'options' : (hasWorld ? 'none' : 'start');
    showImpressum(returnTarget);
}

/**
 * Hides the impressum menu and restores the screen that opened it.
 */
function closeImpressum() {
    document.getElementById('impressumMenu').classList.add('hidden');
    restoreImpressumReturnTarget();
    impressumReturnTarget = 'options';
}

/**
 * Reopens the screen that was active before the impressum menu appeared.
 */
function restoreImpressumReturnTarget() {
    if (impressumReturnTarget === 'options') {
        document.getElementById('optionsMenu').classList.remove('hidden');
    }
    if (impressumReturnTarget === 'start') {
        document.getElementById('startScreen').classList.remove('hidden');
    }
}

/**
 * Shows the in-game settings menu, blurs the canvas, and pauses the game.
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
 * Stops the main game loop and marks the current round as paused.
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
 * Clears the paused state and restarts the game loop while the round is still active.
 */
function resumeGame() {
    if (typeof world !== 'undefined' && world && !world.isGameOver) {
        isPaused = false;
        if (!world.gameLoopInterval) {
            world.run();
        }
    }
}
