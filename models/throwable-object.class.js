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
     * Creates a flying bottle, sets its direction, and starts all throw behavior.
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

    /** Launches gravity, movement, animation, and ground detection for the thrown bottle. */
    throw() {
        this.speedY = 18;
        this.applyGravity();
        this.startThrowMovement();
        this.startThrowAnimation();
        this.startGroundCheck();
    }

    /** Launches the loop that moves the bottle horizontally in its throw direction. */
    startThrowMovement() {
        this.throwMoveInterval = setInterval(() => {
            if (isPaused) return;
            this.x += 10 * this.direction;
        }, 1000 / 20);
        addInterval(this.throwMoveInterval);
    }

    /** Launches the loop that updates either rotation frames or splash frames. */
    startThrowAnimation() {
        this.throwAnimationInterval = setInterval(() => {
            if (isPaused) return;
            this.updateAnimation();
        }, 1000 / 15);
        addInterval(this.throwAnimationInterval);
    }

    /** Switches between rotation and splash animation and marks the bottle removable when finished. */
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

    /** Launches the loop that detects when the bottle reaches the ground. */
    startGroundCheck() {
        this.throwGroundCheckInterval = setInterval(() => {
            if (isPaused) return;
            if (this.y >= 350 && !this.hasHitGround) {
                this.handleGroundHit();
            }
        }, 1000 / 24);
        addInterval(this.throwGroundCheckInterval);
    }

    /** Stops vertical motion, switches state, and plays the glass sound after ground impact. */
    handleGroundHit() {
        this.hasHitGround = true;
        this.speedY = 0;
        if (!isMuted) {
            let glassSound = new Audio('audio/audio_glass.mp3');
            glassSound.play().catch(() => {});
        }
    }
}
