class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    collisionOffsets = { left: 42, right: 42, top: 70, bottom: 35 };
    baseSpeed = 19;
    runningAttackSpeed = 36;
    speed = 19;
    isCharacterNear = false;
    isRunning = false;
    isAttacking = false;
    isHurt = false;
    isDead = false;
    deadFrameIndex = 0;
    deadAnimationLoops = 0;
    deadAnimationMaxLoops = 3;
    deathAnimationIntervalMs = 300;
    elapsedTime = 0;
    energy = 100;
    hasStartedAttacking = false;
    chaseAfterHitDurationMs = 15000;
    chaseAfterHitUntil = 0;
    attackCycleIntervalMs = 950;
    attackPhaseDelayMs = 0;
    walkingPhaseDelayMs = 80;
    endPhaseDelayMs = 1100;

    IMAGES_ALERT = [
        'img/4_Enemigos_jefes/2_alerta/G5.png',
        'img/4_Enemigos_jefes/2_alerta/G6.png',
        'img/4_Enemigos_jefes/2_alerta/G7.png',
        'img/4_Enemigos_jefes/2_alerta/G8.png',
        'img/4_Enemigos_jefes/2_alerta/G9.png',
        'img/4_Enemigos_jefes/2_alerta/G10.png',
        'img/4_Enemigos_jefes/2_alerta/G11.png',
        'img/4_Enemigos_jefes/2_alerta/G12.png'
    ];

    IMAGES_WALKING = [
        'img/4_Enemigos_jefes/1_caminar/G1.png',
        'img/4_Enemigos_jefes/1_caminar/G2.png',
        'img/4_Enemigos_jefes/1_caminar/G3.png',
        'img/4_Enemigos_jefes/1_caminar/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_Enemigos_jefes/3_atacar/G13.png',
        'img/4_Enemigos_jefes/3_atacar/G14.png',
        'img/4_Enemigos_jefes/3_atacar/G15.png',
        'img/4_Enemigos_jefes/3_atacar/G16.png',
        'img/4_Enemigos_jefes/3_atacar/G17.png',
        'img/4_Enemigos_jefes/3_atacar/G18.png',
        'img/4_Enemigos_jefes/3_atacar/G19.png',
        'img/4_Enemigos_jefes/3_atacar/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_Enemigos_jefes/4_herida/G21.png',
        'img/4_Enemigos_jefes/4_herida/G22.png',
        'img/4_Enemigos_jefes/4_herida/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_Enemigos_jefes/5_muerta/G24.png',
        'img/4_Enemigos_jefes/5_muerta/G25.png',
        'img/4_Enemigos_jefes/5_muerta/G26.png'
    ];

    /** Loads all endboss sprites and places the boss at the far end of the level. */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 3800;
    }

    /** Launches all loops that control endboss animation and attack behavior. */
    animate() {
        this.animateStates();
        this.initializeAttackCycle();
        this.runAttackCycle();
    }

    /** Launches the loop that shows either death frames or the current active behavior animation. */
    animateStates() {
        this.animateInterval1 = setInterval(() => {
            if (isPaused) return;
            if (this.isDead) {
                this.playDeathAnimation();
            } else if (this.isCharacterNear) {
                this.playBehaviorAnimation();
            }
        }, this.deathAnimationIntervalMs);
        addInterval(this.animateInterval1);
    }

    /** Shows the death animation for the configured number of loops and then holds the final frame. */
    playDeathAnimation() {
        if (this.deadAnimationLoops >= this.deadAnimationMaxLoops) {
            this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
            return;
        }
        this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrameIndex]];
        this.deadFrameIndex++;
        if (this.deadFrameIndex >= this.IMAGES_DEAD.length) {
            this.deadAnimationLoops++;
            if (this.deadAnimationLoops < this.deadAnimationMaxLoops) {
                this.deadFrameIndex = 0;
            }
        }
    }

    /** Selects the correct endboss animation and movement behavior for the current state. */
    playBehaviorAnimation() {
        this.speed = this.baseSpeed;
        if (this.isHurt) return this.playHurtBehavior();
        if (this.shouldChaseAfterHit()) return this.playChaseBehavior();
        if (this.isAttacking) return this.playAnimation(this.IMAGES_ATTACK);
        if (this.isRunning) return this.playRunningBehavior();
        this.playAnimation(this.IMAGES_ALERT);
    }

    /** Plays the hurt animation while the endboss is in its hurt state. */
    playHurtBehavior() {
        this.playAnimation(this.IMAGES_HURT);
    }

    /** Plays the chase animation and moves the endboss toward the character. */
    playChaseBehavior() {
        this.playAnimation(this.IMAGES_WALKING);
        this.chaseCharacter();
    }

    /** Plays the running attack movement and increases movement speed. */
    playRunningBehavior() {
        this.speed = this.runningAttackSpeed;
        this.playAnimation(this.IMAGES_WALKING);
        this.moveLeft();
    }

    /** Launches the watcher that begins the attack cycle once the character reaches the boss area. */
    initializeAttackCycle() {
        this.animateInterval2 = setInterval(() => {
            if (isPaused) return;
            if (this.isCharacterNear && !this.hasStartedAttacking && !this.isHurt && !this.isDead) {
                this.hasStartedAttacking = true;
                this.executeAttackPhases();
            }
        }, 100);
        addInterval(this.animateInterval2);
    }

    /** Repeats the attack cycle while the endboss is active and able to act. */
    runAttackCycle() {
        this.animateInterval3 = setInterval(() => {
            if (isPaused) return;
            if (this.isCharacterNear && this.hasStartedAttacking && !this.isHurt && !this.isDead) {
                this.executeAttackPhases();
            }
        }, this.attackCycleIntervalMs);
        addInterval(this.animateInterval3);
    }

    /** Launches all timed phases of one complete attack cycle. */
    executeAttackPhases() {
        this.startAlertPhase();
        this.scheduleAttackPhase();
        this.scheduleWalkingPhase();
        this.scheduleEndPhase();
    }

    /** Resets the boss into its alert pose at the start of an attack cycle. */
    startAlertPhase() {
        this.isAttacking = false;
        this.isRunning = false;
    }

    /** Schedules the attacking phase after the alert phase delay. */
    scheduleAttackPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isAttacking = true;
                this.isRunning = false;
            }
        }, this.attackPhaseDelayMs);
    }

    /** Schedules the running phase and triggers the walking sound. */
    scheduleWalkingPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isAttacking = false;
                this.isRunning = true;
                this.playWalkingSound();
            }
        }, this.walkingPhaseDelayMs);
    }

    /** Plays the endboss walking sound effect if audio is enabled. */
    playWalkingSound() {
        if (!isMuted) {
            let walkingSound = new Audio('audio/audio_chicken-alarm.mp3');
            walkingSound.play().catch(() => {});
        }
    }

    /** Ends the timed attack cycle and keeps the boss active only if the character is still near. */
    scheduleEndPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isRunning = this.isCharacterNear;
            }
        }, this.endPhaseDelayMs);
    }

    /** Applies a hit to the endboss, switches to hurt behavior, and triggers death when health reaches zero. */
    getHurt() {
        if (this.isDead) return;
        this.prepareForHitReaction();
        if (this.energy <= 0) return this.die();
        this.scheduleHurtRecovery();
    }

    /** Prepares the endboss state changes that happen immediately after taking a hit. */
    prepareForHitReaction() {
        this.isCharacterNear = true;
        this.hasStartedAttacking = true;
        this.isAttacking = false;
        this.isRunning = false;
        this.isHurt = true;
        this.energy -= 10;
    }

    /** Ends the hurt phase after a delay and starts the temporary chase phase. */
    scheduleHurtRecovery() {
        setTimeout(() => {
            this.isHurt = false;
            this.chaseAfterHitUntil = Date.now() + this.chaseAfterHitDurationMs;
        }, 550);
    }

    /**
     * Returns whether the post-hit chase timer is still active.
     * @returns {boolean}
     */
    shouldChaseAfterHit() {
        return Date.now() < this.chaseAfterHitUntil;
    }

    /** Moves the endboss toward the character, or left by default if no target is available. */
    chaseCharacter() {
        if (!this.hasCharacterTarget()) return this.moveLeft();
        if (this.isCharacterLeftOfEndboss()) return this.moveTowardLeft();
        this.moveTowardRight();
    }

    /**
     * Returns whether the world currently provides a character target for chasing.
     * @returns {boolean}
     */
    hasCharacterTarget() {
        return this.world && this.world.character;
    }

    /**
     * Returns whether the character is currently left of the endboss center point.
     * @returns {boolean}
     */
    isCharacterLeftOfEndboss() {
        const characterCenterX = this.world.character.x + this.world.character.width / 2;
        const endbossCenterX = this.x + this.width / 2;
        return characterCenterX < endbossCenterX;
    }

    /** Turns the endboss left and moves it left. */
    moveTowardLeft() {
        this.otherDirection = false;
        this.moveLeft();
    }

    /** Turns the endboss right and moves it right. */
    moveTowardRight() {
        this.otherDirection = true;
        this.moveRight();
    }

    /** Switches the endboss into the dead state and stops all attack movement. */
    die() {
        this.isDead = true;
        this.isRunning = false;
        this.isAttacking = false;
        this.chaseAfterHitUntil = 0;
    }

    /** Returns the full duration of the configured death animation sequence in milliseconds. */
    getDeathAnimationDurationMs() {
        return this.deathAnimationIntervalMs * this.IMAGES_DEAD.length * this.deadAnimationMaxLoops;
    }

}
