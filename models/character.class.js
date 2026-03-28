class Character extends MovableObject {
    height = 280;
    y = 150;
    speed = 8;
    collisionOffsets = { left: 12, right: 12, top: 120 };
    jumpInputConsumed = false;
    jumpCooldownUntil = 0;
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
     * Preloads the character sprites, configures sounds, and starts gravity.
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
     * Launches the movement update loop and the animation state loop.
     */
    animate() {
        this.animateMovement();
        this.animateCharacterState();
    }

    /**
     * Updates movement, jump input, and camera position on every frame.
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
     * Processes horizontal movement and jump input for the current frame.
     */
    handleMovementInput() {
        this.handleHorizontalMovement();
        this.resetJumpInputWhenReleased();
        this.handleJumpInput();
    }

    /**
     * Moves the character left or right when the matching keys are pressed.
     */
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) this.moveCharacterRight();
        if (this.world.keyboard.LEFT && this.x > 0) this.moveCharacterLeft();
    }

    /**
     * Moves the character to the right, sets the facing direction, and refreshes the activity timer.
     */
    moveCharacterRight() {
        this.moveRight();
        this.otherDirection = false;
        this.lastActionAt = Date.now();
    }

    /**
     * Moves the character to the left, flips the facing direction, and refreshes the activity timer.
     */
    moveCharacterLeft() {
        this.moveLeft();
        this.otherDirection = true;
        this.lastActionAt = Date.now();
    }

    /**
     * Clears the consumed-jump flag once the jump key is released.
     */
    resetJumpInputWhenReleased() {
        if (!this.world.keyboard.SPACE) this.jumpInputConsumed = false;
    }

/**
     * Triggers a player jump when the key is pressed and the jump conditions are met.
     */
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
     * Returns whether the player can start a manual jump right now.
     * @returns {boolean}
     */
    canPerformPlayerJump() {
        return !this.isAboveGround() && Date.now() >= this.jumpCooldownUntil;
    }

/**
     * Launches the loop that chooses the correct animation for the current character state.
     */
    animateCharacterState() {
        this.animateInterval2 = setInterval(() => {
            if (isPaused) return;
            this.selectAndPlayAnimation();
        }, 90);
        addInterval(this.animateInterval2);
    }

    /**
     * Reduces the character's health and stores the hit timestamp for hurt logic.
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
     * Chooses the correct animation based on death, hurt, air, running, idle, or sleep state.
     */
    selectAndPlayAnimation() {
        if (this.playPriorityAnimation()) return;
        if (this.isAboveGround()) return this.playAirAnimation();
        this.resetJumpAnimation();
        this.handleGroundAnimation();
    }

/**
     * Prioritizes death or hurt animations and reports whether one was used.
     * @returns {boolean}
     */
    playPriorityAnimation() {
        if (this.isDead()) return this.playDeadAnimation();
        if (this.isHurt()) return this.playHurtAnimation();
        return false;
    }

/**
     * Shows the death animation and stops the running sound.
     * @returns {boolean}
     */
    playDeadAnimation() {
        this.resetJumpAnimation();
        this.playAnimation(this.IMAGES_DEAD);
        this.runningSound.pause();
        return true;
    }

/**
     * Shows the hurt animation sequence.
     * @returns {boolean}
     */
    playHurtAnimation() {
        this.resetJumpAnimation();
        this.playAnimation(this.IMAGES_HURT);
        return true;
    }

/**
     * Shows the jump animation while airborne and stops the running sound.
     * @returns {boolean}
     */
    playAirAnimation() {
        this.playJumpAnimation();
        this.runningSound.pause();
        return true;
    }

/**
     * Selects one jump frame from the current vertical speed while the character is airborne.
     */
    playJumpAnimation() {
        const frameIndex = this.resolveJumpFrameIndex();
        const path = this.IMAGES_JUMPING[frameIndex];
        this.img = this.imageCache[path];
    }

    resolveJumpFrameIndex() {
        const lastIndex = this.IMAGES_JUMPING.length - 1;
        if (this.speedY > 10) return 0;
        if (this.speedY > 7) return 1;
        if (this.speedY > 4) return 2;
        if (this.speedY > 2) return 3;
        if (this.speedY > -1) return 4;
        if (this.speedY > -4) return Math.min(5, lastIndex);
        if (this.speedY > -7) return Math.min(6, lastIndex);
        if (this.speedY > -10) return Math.min(7, lastIndex);
        return lastIndex;
    }

/**
     * Restores the default idle frame when the jump state ends or changes.
     */
    resetJumpAnimation() {
        this.img = this.imageCache[this.IMAGES_STILL[0]];
    }

/**
     * Shows the running animation on the ground, otherwise idle or sleeping frames.
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
