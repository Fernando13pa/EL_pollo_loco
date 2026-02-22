class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 4200;

    /**
     * Constructor - defines a level with all objects
     * @param {Array} enemies - Array with enemy objects
     * @param {Array} clouds - Array with cloud objects
     * @param {Array} backgroundObjects - Array with background objects
     * @param {Array} coins - Array with coins
     * @param {Array} bottles - Array with bottles
     */
    constructor(enemies, clouds, backgroundObjects, coins = [], bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}