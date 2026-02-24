class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        'img/6_Botella_salsa/botella_girando/1_bottle_rotation.png',
        'img/6_Botella_salsa/botella_girando/2_bottle_rotation.png',
        'img/6_Botella_salsa/botella_girando/3_bottle_rotation.png',
        'img/6_Botella_salsa/botella_girando/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_Botella_salsa/botella_girando/botella_salsa/1_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/2_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/3_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/4_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/5_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/6_bottle_splash.png'
    ];

    hasHitGround = false;
    splashFrameCount = 0;
    shouldBeRemoved = false;

    /**
     * Constructor - creates a thrown bottle
     * @param {number} x - Start X position
     * @param {number} y - Start Y position
     * @param {number} direction - Throw direction (1 right, -1 left)
     */
    constructor(x, y, direction = 1) {
        super().loadImage('img/6_Botella_salsa/botella_girando/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.otherDirection = direction < 0;
        this.width = 50;
        this.height = 60;
        this.throw();
    }

    /**
     * Throws the bottle - starts all throw intervals
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.startThrowMovement();
        this.startThrowAnimation();
        this.startGroundCheck();
    }

    /**
     * Starts horizontal movement of the bottle
     */
    startThrowMovement() {
        this.throwMoveInterval = setInterval(() => {
            if (isPaused) return;
            this.x += 10 * this.direction;
        }, 1000 / 25);
        addInterval(this.throwMoveInterval);
    }

    /**
     * Starts animation (rotation or splash)
     */
    startThrowAnimation() {
        this.throwAnimationInterval = setInterval(() => {
            if (isPaused) return;
            this.updateAnimation();
        }, 1000 / 25);
        addInterval(this.throwAnimationInterval);
    }

    /**
     * Updates animation based on state
     */
    updateAnimation() {
        if (this.hasHitGround && !this.shouldBeRemoved) {
            this.playAnimation(this.IMAGES_SPLASH);
            this.splashFrameCount++;
            if (this.splashFrameCount >= this.IMAGES_SPLASH.length * 2) {
                this.shouldBeRemoved = true;
            }
        } else if (!this.hasHitGround) {
            this.playAnimation(this.IMAGES_ROTATION);
        }
    }

    /**
     * Checks if bottle has touched the ground
     */
    startGroundCheck() {
        this.throwGroundCheckInterval = setInterval(() => {
            if (isPaused) return;
            if (this.y >= 350 && !this.hasHitGround) {
                this.handleGroundHit();
            }
        }, 1000 / 25);
        addInterval(this.throwGroundCheckInterval);
    }

    /**
     * Handles ground contact - plays sound and stops falling
     */
    handleGroundHit() {
        this.hasHitGround = true;
        this.speedY = 0;
        if (!isMuted) {
            let glassSound = new Audio('audio/audio_glass.mp3');
            glassSound.play().catch(() => {});
        }
    }
}
