class Bottle extends DrawableObject {
    static placedPositions = [];
    static defaultMinGap = 300;
    collisionOffsets = { left: 14, right: 14, top: 16, bottom: 12 };
    IMAGES_GROUND = [
        'img/6_Botella_salsa/1_salsa_bottle_on_ground.png',
        'img/6_Botella_salsa/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a collectible bottle either in the air or on the ground.
     * @param {number} x - X position (optional)
     * @param {number} y - Y position (optional)
     * @param {boolean} onGround - Whether the bottle is on the ground
     */
    constructor(x, y, onGround = false) {
        super();
        this.width = 70;
        this.height = 90;
        this.onGround = onGround;
        this.loadBottleImage(onGround);
        this.setBottlePosition(x, y, onGround);
        if (this.onGround) this.animateOnGround();
    }

    /**
     * Loads the correct sprite set for an air bottle or a ground bottle.
     * @param {boolean} onGround - Whether the bottle is on the ground
     */
    loadBottleImage(onGround) {
        if (onGround) {
            this.loadImage('img/6_Botella_salsa/2_salsa_bottle_on_ground.png');
            this.loadImages(this.IMAGES_GROUND);
        } else {
            this.loadImage('img/6_Botella_salsa/botella_girando/1_bottle_rotation.png');
        }
    }

    /**
     * Sets the bottle position from explicit coordinates or generated random coordinates.
     * @param {number} x - X position (optional)
     * @param {number} y - Y position (optional)
     * @param {boolean} onGround - Whether the bottle is on the ground
     */
    setBottlePosition(x, y, onGround) {
        this.x = typeof x === 'number' ? x : this.generateRandomX();
        this.y = typeof y === 'number' ? y : this.generateRandomY(onGround);
    }

    /**
     * Generates a random X position that keeps the minimum gap to already placed bottles.
     * @returns {number} The X position
     */
    generateRandomX() {
        const minX = 300;
        const maxX = 3500;
        const minGap = Bottle.defaultMinGap;
        let attempts = 0;
        let bx;
        do {
            bx = Math.floor(minX + Math.random() * (maxX - minX));
            attempts++;
            if (attempts > 200) break;
        } while (Bottle.placedPositions.some(px => Math.abs(px - bx) < minGap));
        Bottle.placedPositions.push(bx);
        return bx;
    }

    /**
     * Generates a random Y position either on the ground line or floating above it.
     * @param {boolean} onGround - Whether the bottle is on the ground
     * @returns {number} The Y position
     */
    generateRandomY(onGround) {
        const groundBottom = 80 + 280;
        if (onGround) {
            const extraOffset = 70;
            return Math.floor(groundBottom - this.height + extraOffset);
        } else {
            const minY = 50;
            const maxY = Math.max(minY, groundBottom - this.height);
            return Math.floor(minY + Math.random() * (maxY - minY));
        }
    }

    /**
     * Starts the idle animation for bottles that sit on the ground.
     */
    animateOnGround() {
        this.groundAnimationInterval = setInterval(() => {
            if (isPaused) return;
            this.playAnimation(this.IMAGES_GROUND);
        }, 700);
        addInterval(this.groundAnimationInterval);
    }

    /**
     * Advances the bottle to the next frame of the given animation sequence.
     * @param {Array} images - Array with image paths
     */
    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    /**
     * Creates multiple bottles at generated positions that respect the minimum gap.
     * @param {number} count - Number of bottles
     * @param {Object} options - Options (minX, maxX, minGap)
     * @returns {Array} Array with bottles
     */
    static createMany(count = 6, options = {}) {
        const positions = this.generatePositions(count, options);
        return this.createBottlesAtPositions(positions);
    }

    /**
     * Generates sorted X positions that stay far enough apart from each other.
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
     * Checks whether a candidate X position keeps the required gap to all existing positions.
     * @param {number} x - X position
     * @param {Array} positions - Existing positions
     * @param {number} minGap - Minimum distance
     * @returns {boolean} true if position is valid
     */
    static isValidPosition(x, positions, minGap) {
        return !positions.some(px => Math.abs(px - x) < minGap);
    }

    /**
     * Creates air bottles at the given X positions with random Y values above the ground.
     * @param {Array} positions - Array with X positions
     * @returns {Array} Array with bottles
     */
    static createBottlesAtPositions(positions) {
        return positions.map(x => {
            const groundBottom = 80 + 280;
            const minY = 50;
            const maxY = Math.max(minY, groundBottom - 70);
            const y = Math.floor(minY + Math.random() * (maxY - minY));
            return new Bottle(x, y);
        });
    }
}
