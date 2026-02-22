let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game - creates canvas, level and world
 */
function init() {
    canvas = document.getElementById('canvas');
    const level = createLevel();
    world = new World(canvas, keyboard, level);
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