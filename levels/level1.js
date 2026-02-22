/**
 * Creates the first level with all enemies, objects and items
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
 * Creates all enemies for level 1
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
 * Creates clouds for the background
 * @returns {Array} Array with clouds
 */
function createClouds() {
    return [new Cloud()];
}

/**
 * Creates all background objects for level 1
 * @returns {Array} Array with background objects
 */
function createBackgrounds() {
    return [
        new BackgroundObject('img/5_Fondo/fondos/air.png', -720),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/2.png', -720),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/2.png', -720),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/2.png', -720),
        new BackgroundObject('img/5_Fondo/fondos/air.png', 0),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/1.png', 0),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/1.png', 0),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/1.png', 0,),
        new BackgroundObject('img/5_Fondo/fondos/air.png', 720),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/2.png', 720),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/2.png', 720),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/2.png', 720),
        new BackgroundObject('img/5_Fondo/fondos/air.png', 720 * 2),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/1.png', 720 * 2),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/1.png', 720 * 2),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/1.png', 720 * 2),
        new BackgroundObject('img/5_Fondo/fondos/air.png', 720 * 3),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/2.png', 720 * 3),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/2.png', 720 * 3),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/2.png', 720 * 3),
        new BackgroundObject('img/5_Fondo/fondos/air.png', 720 * 4),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/1.png', 720 * 4),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/1.png', 720 * 4),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/1.png', 720 * 4),
        new BackgroundObject('img/5_Fondo/fondos/air.png', 720 * 5),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/2.png', 720 * 5),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/2.png', 720 * 5),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/2.png', 720 * 5),
        new BackgroundObject('img/5_Fondo/fondos/air.png', 720 * 6),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/1.png', 720 * 6),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/1.png', 720 * 6),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/1.png', 720 * 6),
    ];
}

/**
 * Creates all coins for level 1
 * @returns {Array} Array with 10 coins
 */
function createCoins() {
    return [
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin()
    ];
}

/**
 * Creates all bottles for level 1 (in air and on ground)
 * @returns {Array} Array with 18 bottles
 */
function createBottles() {
    return [
        new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
        new Bottle(), new Bottle(), new Bottle(), new Bottle(),
        new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true),
        new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true),
        new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true),
        new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true),
        new Bottle(undefined, undefined, true)
    ];
}

const level1 = createLevel();