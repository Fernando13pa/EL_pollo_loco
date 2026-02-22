class Coin extends DrawableObject {
    static placedPositions = [];
    static defaultMinGap = 300;
    /**
     * Constructor - creates a coin at random or specified coordinates
     * @param {number} x - X position (optional)
     * @param {number} y - Y position (optional)
     */
    constructor(x, y) {
        super();
        this.width = 120;
        this.height = 120;
        this.loadImage('img/8_Monedas/coin_1.png');
        this.setCoinPosition(x, y);
    }

    /**
     * Sets the position of the coin
     * @param {number} x - X position (optional)
     * @param {number} y - Y position (optional)
     */
    setCoinPosition(x, y) {
        this.x = typeof x === 'number' ? x : this.generateRandomX();
        this.y = typeof y === 'number' ? y : this.generateRandomY();
    }

    /**
     * Generates random X position with minimum distance to other coins
     * @returns {number} The X position
     */
    generateRandomX() {
        const minX = 300;
        const maxX = 2200;
        const minGap = Coin.defaultMinGap;
        let attempts = 0;
        let cx;
        do {
            cx = Math.floor(minX + Math.random() * (maxX - minX));
            attempts++;
            if (attempts > 100) break;
        } while (Coin.placedPositions.some(px => Math.abs(px - cx) < minGap));
        Coin.placedPositions.push(cx);
        return cx;
    }

    /**
     * Generates random Y position for coins above the ground
     * @returns {number} The Y position
     */
    generateRandomY() {
        const groundBottom = 80 + 280;
        const minY = Math.max(20, groundBottom - 220);
        const maxY = Math.max(50, groundBottom - 60);
        return Math.floor(minY + Math.random() * (maxY - minY));
    }

    /**
     * Creates multiple coins with minimum distance
     * @param {number} count - Number of coins
     * @param {Object} options - Options (minX, maxX, minGap)
     * @returns {Array} Array with coins
     */
    static createMany(count = 5, options = {}) {
        const positions = this.generatePositions(count, options);
        return this.createCoinsAtPositions(positions);
    }

    /**
     * Generates positions with minimum distance
     * @param {number} count - Number of positions
     * @param {Object} options - Options (minX, maxX, minGap)
     * @returns {Array} Sorted array with X positions
     */
    static generatePositions(count, options) {
        const minX = options.minX ?? 300;
        const maxX = options.maxX ?? 2200;
        const minGap = options.minGap ?? 300;
        const positions = [];
        while (positions.length < count) {
            const x = Math.floor(minX + Math.random() * (maxX - minX));
            if (this.isValidPosition(x, positions, minGap)) {
                positions.push(x);
            }
        }
        return positions.sort((a, b) => a - b);
    }

    /**
     * Checks if position has valid minimum distance
     * @param {number} x - X position
     * @param {Array} positions - Existing positions
     * @param {number} minGap - Minimum distance
     * @returns {boolean} true if position is valid
     */
    static isValidPosition(x, positions, minGap) {
        return !positions.some(px => Math.abs(px - x) < minGap);
    }

    /**
     * Creates coins at given positions
     * @param {Array} positions - Array with X positions
     * @returns {Array} Array with coins
     */
    static createCoinsAtPositions(positions) {
        return positions.map(x => {
            const groundBottom = 80 + 280;
            const minY = 50;
            const maxY = Math.max(60, groundBottom - 60);
            const y = Math.floor(minY + Math.random() * (maxY - minY));
            return new Coin(x, y);
        });
    }
}
