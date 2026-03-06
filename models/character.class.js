class Character extends MovableObject {
    height = 280;
    y = 150;
    speed = 10;
    collisionOffsets = { left: 12, right: 12, top: 120 };
    jumpInputConsumed = false;
    jumpCooldownUntil = 0;
    jumpFrameIndex = 0;
    sleepThresholdMs = 2200;
    lastActionAt = Date.now();

    IMAGES_STILL = ['img/2_Pepe_figura/1_parado/tranquilo/I-1.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-2.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-3.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-4.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-5.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-6.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-7.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-8.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-9.png',
        'img/2_Pepe_figura/1_parado/tranquilo/I-10.png'
    ];

    IMAGES_WALKING = ['img/2_Pepe_figura/2_camina/W-21.png',
        'img/2_Pepe_figura/2_camina/W-22.png',
        'img/2_Pepe_figura/2_camina/W-23.png',
        'img/2_Pepe_figura/2_camina/W-24.png',
        'img/2_Pepe_figura/2_camina/W-25.png',
        'img/2_Pepe_figura/2_camina/W-26.png'];

    IMAGES_JUMPING = [
        'img/2_Pepe_figura/3_salta/J-31.png',
        'img/2_Pepe_figura/3_salta/J-32.png',
        'img/2_Pepe_figura/3_salta/J-33.png',
        'img/2_Pepe_figura/3_salta/J-34.png',
        'img/2_Pepe_figura/3_salta/J-35.png',
        'img/2_Pepe_figura/3_salta/J-36.png',
        'img/2_Pepe_figura/3_salta/J-37.png',
        'img/2_Pepe_figura/3_salta/J-38.png',
        'img/2_Pepe_figura/3_salta/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_Pepe_figura/5_muerto/D-51.png',
        'img/2_Pepe_figura/5_muerto/D-52.png',
        'img/2_Pepe_figura/5_muerto/D-53.png',
        'img/2_Pepe_figura/5_muerto/D-54.png',
        'img/2_Pepe_figura/5_muerto/D-55.png',
        'img/2_Pepe_figura/5_muerto/D-56.png',
        'img/2_Pepe_figura/5_muerto/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_Pepe_figura/4_tropezar/H-41.png',
        'img/2_Pepe_figura/4_tropezar/H-42.png',
        'img/2_Pepe_figura/4_tropezar/H-43.png',
    ];

    IMAGES_SLEEPING = [
        'img/2_Pepe_figura/1_parado/dormido/I-11.png',
        'img/2_Pepe_figura/1_parado/dormido/I-12.png',
        'img/2_Pepe_figura/1_parado/dormido/I-13.png',
        'img/2_Pepe_figura/1_parado/dormido/I-14.png',
        'img/2_Pepe_figura/1_parado/dormido/I-15.png',
        'img/2_Pepe_figura/1_parado/dormido/I-16.png',
        'img/2_Pepe_figura/1_parado/dormido/I-17.png',
        'img/2_Pepe_figura/1_parado/dormido/I-18.png',
        'img/2_Pepe_figura/1_parado/dormido/I-19.png',
        'img/2_Pepe_figura/1_parado/dormido/I-20.png'
    ];

    world;
    jumpSound = new Audio('audio/audio_jump.mp3');
    runningSound = new Audio('audio/audio_running.mp3');


    /**
     * Constructor - loads all images and starts gravity
     */
    constructor() {
        super().loadImage('img/2_Pepe_figura/1_parado/tranquilo/I-1.png');
        this.loadImages(this.IMAGES_STILL);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEPING);
        this.runningSound.loop = true;
        this.applyGravity();
    }

    /**
     * Starts both animation intervals (movement and display)
     */
    animate() {
        this.animateMovement();
        this.animateCharacterState();
    }

    /**
     * Controls character movement based on keyboard input
     */
    animateMovement() {
        this.animateInterval = setInterval(() => {
            if (isPaused) return;
            this.handleMovementInput();
            this.updateActivityTimestamp();
            this.world.camera_x = -this.x + 120;
        }, 1000 / 60);
        addInterval(this.animateInterval);
    }

    /**
     * Processes keyboard input for movement and jump
     */
    handleMovementInput() {
        this.handleHorizontalMovement();
        this.resetJumpInputWhenReleased();
        this.handleJumpInput();
    }

    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) this.moveCharacterRight();
        if (this.world.keyboard.LEFT && this.x > 0) this.moveCharacterLeft();
    }

    moveCharacterRight() {
        this.moveRight();
        this.otherDirection = false;
        this.lastActionAt = Date.now();
    }

    moveCharacterLeft() {
        this.moveLeft();
        this.otherDirection = true;
        this.lastActionAt = Date.now();
    }

    resetJumpInputWhenReleased() {
        if (!this.world.keyboard.SPACE) this.jumpInputConsumed = false;
    }

    handleJumpInput() {
        if (!this.world.keyboard.SPACE || this.jumpInputConsumed || !this.canPerformPlayerJump()) return;
        this.jumpInputConsumed = true;
        this.jumpCooldownUntil = Date.now() + 140;
        this.jump();
        this.lastActionAt = Date.now();
        if (!isMuted) this.jumpSound.play().catch(() => {});
    }

    /**
     * Tracks player activity based on current input to control idle/sleep animations.
     */
    updateActivityTimestamp() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE || this.world.keyboard.D) {
            this.lastActionAt = Date.now();
        }
    }

    /**
     * Checks if a player-triggered jump is currently allowed
     * @returns {boolean}
     */
    canPerformPlayerJump() {
        return !this.isAboveGround() && Date.now() >= this.jumpCooldownUntil;
    }

    /**
     * Selects and plays the correct animation based on character status
     */
    animateCharacterState() {
        this.animateInterval2 = setInterval(() => {
            if (isPaused) return;
            this.selectAndPlayAnimation();
        }, 50);
        addInterval(this.animateInterval2);
    }

    /**
     * Takes damage from collision with enemy
     */
    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lasHit = new Date().getTime();
        }
    }

    /**
     * Determines which animation should be played (dead, hurt, jump, running, standing)
     */
    selectAndPlayAnimation() {
        if (this.playPriorityAnimation()) return;
        if (this.isAboveGround()) return this.playAirAnimation();
        this.resetJumpAnimation();
        this.handleGroundAnimation();
    }

    playPriorityAnimation() {
        if (this.isDead()) return this.playDeadAnimation();
        if (this.isHurt()) return this.playHurtAnimation();
        return false;
    }

    playDeadAnimation() {
        this.resetJumpAnimation();
        this.playAnimation(this.IMAGES_DEAD);
        this.runningSound.pause();
        return true;
    }

    playHurtAnimation() {
        this.resetJumpAnimation();
        this.playAnimation(this.IMAGES_HURT);
        return true;
    }

    playAirAnimation() {
        this.playJumpAnimation();
        this.runningSound.pause();
        return true;
    }

    /**
     * Plays jump animation only once per jump and keeps last frame while airborne.
     */
    playJumpAnimation() {
        const lastIndex = this.IMAGES_JUMPING.length - 1;
        const frameIndex = Math.min(this.jumpFrameIndex, lastIndex);
        const path = this.IMAGES_JUMPING[frameIndex];
        this.img = this.imageCache[path];
        if (this.jumpFrameIndex < lastIndex) {
            this.jumpFrameIndex++;
        }
    }

    /**
     * Resets jump animation state when character is back on ground or state changes.
     */
    resetJumpAnimation() {
        this.jumpFrameIndex = 0;
    }

    /**
     * Plays animation when character is on ground (running or standing)
     */
    handleGroundAnimation() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
            if (!isMuted) this.runningSound.play().catch(() => {});
        } else {
            this.runningSound.pause();
            const isSleeping = Date.now() - this.lastActionAt >= this.sleepThresholdMs;
            this.playAnimation(isSleeping ? this.IMAGES_SLEEPING : this.IMAGES_STILL);
        }
    }
}
