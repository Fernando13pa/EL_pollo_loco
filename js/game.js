let canvas;
let world;
let keyboard = new Keyboard();
let touchControlsInitialized = false;
let touchControlSafeguardsInitialized = false;

if (isTouchDevice()) {
    document.documentElement.classList.add('touch-device');
}

/**
 * Builds the canvas world for the current level and enables touch controls.
 */
function init() {
    canvas = document.getElementById('canvas');
    const level = createLevel();
    world = new World(canvas, keyboard, level);
    setupTouchControls();
}

/**
 * Marks the matching game input as pressed for a physical keyboard event.
 */
window.addEventListener("keydown", (e) => updateKeyboardState(e.code, true));

/**
 * Clears the matching game input for a physical keyboard event.
 */
window.addEventListener("keyup", (e) => updateKeyboardState(e.code, false));

/**
 * Maps a keyboard event code to the matching game input flag.
 * @param {string} code
 * @param {boolean} isPressed
 */
function updateKeyboardState(code, isPressed) {
    if (code === 'ArrowUp') keyboard.UP = isPressed;
    if (code === 'ArrowDown') keyboard.DOWN = isPressed;
    if (code === 'ArrowLeft') keyboard.LEFT = isPressed;
    if (code === 'ArrowRight') keyboard.RIGHT = isPressed;
    if (code === 'Space') keyboard.SPACE = isPressed;
    if (code === 'KeyD') keyboard.D = isPressed;
}

/**
 * Connects the on-screen buttons to the keyboard flags used by the game controls.
 */
function setupTouchControls() {
    if (touchControlsInitialized) return;
    const buttons = getTouchButtons();
    if (!hasAllTouchButtons(buttons)) return;
    setupTouchControlSafeguards(buttons);
    bindPrimaryTouchControls(buttons);
    touchControlsInitialized = true;
}

/**
 * Returns all touch control button elements in a fixed order.
 * @returns {HTMLElement[]}
 */
function getTouchButtons() {
    return [
        document.getElementById('btnLeft'),
        document.getElementById('btnRight'),
        document.getElementById('btnJump'),
        document.getElementById('btnThrow')
    ];
}

/**
 * Returns whether every required touch control button is available in the DOM.
 * @param {HTMLElement[]} buttons
 * @returns {boolean}
 */
function hasAllTouchButtons(buttons) {
    return buttons.every(Boolean);
}

/**
 * Binds the movement, jump, and throw touch buttons to their matching keyboard flags.
 * @param {HTMLElement[]} buttons
 */
function bindPrimaryTouchControls([btnLeft, btnRight, btnJump, btnThrow]) {
    bindHoldControl(btnLeft, 'LEFT');
    bindHoldControl(btnRight, 'RIGHT');
    bindTapControl(btnJump, 'SPACE');
    bindTapControl(btnThrow, 'D');
}

/**
 * Prevents stuck touch input and blocks the default long-press browser menu.
 * @param {HTMLElement[]} buttons - all on-screen control buttons
 */
function setupTouchControlSafeguards(buttons) {
    if (touchControlSafeguardsInitialized) return;
    const resetTouchControlKeys = createTouchKeyResetHandler();
    addContextMenuGuards(buttons);
    addTouchResetHandlers(resetTouchControlKeys);
    touchControlSafeguardsInitialized = true;
}

/**
 * Blocks the browser context menu on the touch control buttons.
 * @param {HTMLElement[]} buttons
 */
function addContextMenuGuards(buttons) {
    const preventContextMenu = (e) => e.preventDefault();
    buttons.forEach((button) => button.addEventListener('contextmenu', preventContextMenu));
}

/**
 * Returns a handler that clears every touch-driven keyboard flag.
 * @returns {Function}
 */
function createTouchKeyResetHandler() {
    return () => {
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        keyboard.SPACE = false;
        keyboard.D = false;
    };
}

/**
 * Registers global events that clear touch input after release or focus loss.
 * @param {Function} resetTouchControlKeys
 */
function addTouchResetHandlers(resetTouchControlKeys) {
    window.addEventListener('pointerup', resetTouchControlKeys);
    window.addEventListener('pointercancel', resetTouchControlKeys);
    window.addEventListener('blur', resetTouchControlKeys);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) resetTouchControlKeys();
    });
}

/**
 * Returns whether the current device likely supports touch input.
 * @returns {boolean}
 */
function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}

/**
 * Keeps a keyboard flag active while the matching touch button stays pressed.
 * @param {HTMLElement} button - control button
 * @param {string} keyName - keyboard flag name
 */
function bindHoldControl(button, keyName) {
    const press = createKeyHandler(keyName, true);
    const release = createKeyHandler(keyName, false);
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
}

/**
 * Returns an event handler that writes one boolean value to a keyboard flag.
 * @param {string} keyName
 * @param {boolean} value
 * @returns {Function}
 */
function createKeyHandler(keyName, value) {
    return (e) => {
        e.preventDefault();
        keyboard[keyName] = value;
    };
}

/**
 * Simulates a short key tap when the matching touch button is pressed.
 * @param {HTMLElement} button - control button
 * @param {string} keyName - keyboard flag name
 */
function bindTapControl(button, keyName) {
    let releaseTimer = null;
    const release = createKeyHandler(keyName, false);
    const press = (e) => releaseTimer = handleTapPress(e, keyName, releaseTimer);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
    button.addEventListener('pointerdown', press);
}

/**
 * Sets a tap-style keyboard flag briefly and schedules its release.
 * @param {PointerEvent} e
 * @param {string} keyName
 * @param {number | null} previousTimer
 * @returns {number}
 */
function handleTapPress(e, keyName, previousTimer) {
    e.preventDefault();
    keyboard[keyName] = true;
    clearTimeout(previousTimer);
    return setTimeout(() => {
        keyboard[keyName] = false;
    }, 120);
}
