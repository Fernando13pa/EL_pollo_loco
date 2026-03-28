/**
 * Creates the full first level with enemies, scenery, coins, and bottles.
 * @returns {Level} The complete level
 */
function createLevel() {
    return new Level(
        createEnemies(),
        createClouds(),
        createBackgrounds(),
        createCoins(),
        createBottles()
    );
}

/**
 * Creates the enemy lineup for level 1, including the endboss.
 * @returns {Array} Array with all enemies
 */
function createEnemies() {
    return [
        new Chicken(), new SmallChicken(), new Chicken(), new SmallChicken(),
        new Chicken(), new Chicken(), new SmallChicken(), new Chicken(),
        new SmallChicken(), new Chicken(), new Endboss()
    ];
}

/**
 * Creates the cloud layer for the level background.
 * @returns {Array} Array with clouds
 */
function createClouds() {
    return [new Cloud()];
}

/**
 * Creates all repeating background segments for level 1.
 * @returns {Array} Array with background objects
 */
function createBackgrounds() {
    const offsets = [-720, 0, 720, 720 * 2, 720 * 3, 720 * 4, 720 * 5, 720 * 6];
    return offsets.flatMap((offset) => createBackgroundSegment(offset));
}

/**
 * Creates one layered background segment at the given horizontal offset.
 * @param {number} offset
 * @returns {BackgroundObject[]}
 */
function createBackgroundSegment(offset) {
    const variant = Math.abs(Math.round(offset / 720) % 2) === 1 ? 2 : 1;
    return [
        new BackgroundObject('img/5_Fondo/fondos/air.png', offset),
        new BackgroundObject(`img/5_Fondo/fondos/3_tercer_fondo/${variant}.png`, offset),
        new BackgroundObject(`img/5_Fondo/fondos/2_segundo_fondo/${variant}.png`, offset),
        new BackgroundObject(`img/5_Fondo/fondos/1_primer_fondo/${variant}.png`, offset)
    ];
}

/**
 * Creates all collectible coins for level 1.
 * @returns {Array} Array with 10 coins
 */
function createCoins() {
    return [
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin()
    ];
}

/**
 * Creates all collectible bottles for level 1, both floating and ground-based.
 * @returns {Array} Array with 13 bottles
 */
function createBottles() {
    return [
        new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
        new Bottle(),
        new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true),
        new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true),
        new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true)
    ];
}

const level1 = createLevel();
