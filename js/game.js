let canvas;
let world;
let keyboard = new Keyboard();
let touchControlsInitialized = false;

/**
 * Initializes the game - creates canvas, level and world
 */
function init() {
    canvas = document.getElementById('canvas');
    const level = createLevel();
    world = new World(canvas, keyboard, level);
    setupTouchControls();
}

/**
 * Event listener for pressed keys - sets keyboard flags to true
 */
window.addEventListener("keydown", (e) => {
    if (e.keyCode === 38) keyboard.UP = true;
    if (e.keyCode === 40) keyboard.DOWN = true;
    if (e.keyCode === 37) keyboard.LEFT = true;
    if (e.keyCode === 39) keyboard.RIGHT = true;
    if (e.keyCode === 32) keyboard.SPACE = true;
    if (e.keyCode === 68) keyboard.D = true;
});

/**
 * Event listener for released keys - sets keyboard flags to false
 */
window.addEventListener("keyup", (e) => {
    if (e.keyCode === 38) keyboard.UP = false;
    if (e.keyCode === 40) keyboard.DOWN = false;
    if (e.keyCode === 37) keyboard.LEFT = false;
    if (e.keyCode === 39) keyboard.RIGHT = false;
    if (e.keyCode === 32) keyboard.SPACE = false;
    if (e.keyCode === 68) keyboard.D = false;
});

/**
 * Connects mobile control buttons to keyboard flags
 */
function setupTouchControls() {
    if (touchControlsInitialized) return;

    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnJump = document.getElementById('btnJump');
    const btnThrow = document.getElementById('btnThrow');

    if (!btnLeft || !btnRight || !btnJump || !btnThrow) return;

    bindHoldControl(btnLeft, 'LEFT');
    bindHoldControl(btnRight, 'RIGHT');
    bindTapControl(btnJump, 'SPACE');
    bindTapControl(btnThrow, 'D');

    touchControlsInitialized = true;
}

/**
 * Binds a button that keeps a key active while pressed
 * @param {HTMLElement} button - control button
 * @param {string} keyName - keyboard flag name
 */
function bindHoldControl(button, keyName) {
    const press = (e) => {
        e.preventDefault();
        keyboard[keyName] = true;
    };
    const release = (e) => {
        e.preventDefault();
        keyboard[keyName] = false;
    };

    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
}

/**
 * Binds a button that triggers a short key press
 * @param {HTMLElement} button - control button
 * @param {string} keyName - keyboard flag name
 */
function bindTapControl(button, keyName) {
    let releaseTimer = null;

    button.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        keyboard[keyName] = true;
        clearTimeout(releaseTimer);
        releaseTimer = setTimeout(() => {
            keyboard[keyName] = false;
        }, 120);
    });

    const release = (e) => {
        e.preventDefault();
        keyboard[keyName] = false;
    };

    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
}
