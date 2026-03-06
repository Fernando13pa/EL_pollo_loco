class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    collisionOffsets = { left: 42, right: 42, top: 70, bottom: 35 };
    baseSpeed = 14;
    runningAttackSpeed = 22;
    speed = 14;
    isCharacterNear = false;
    isRunning = false;
    isAttacking = false;
    isHurt = false;
    isDead = false;
    deadFrameIndex = 0;
    deadAnimationLoops = 0;
    deadAnimationMaxLoops = 3;
    deathAnimationIntervalMs = 200;
    elapsedTime = 0;
    energy = 100;
    hasStartedAttacking = false;
    chaseAfterHitDurationMs = 12000;
    chaseAfterHitUntil = 0;
    attackCycleIntervalMs = 1200;
    attackPhaseDelayMs = 0;
    walkingPhaseDelayMs = 120;
    endPhaseDelayMs = 1200;

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

    /**
     * Constructor - loads all images and sets position
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 3800;
    }

    /**
     * Starts all animation intervals for endboss behavior
     */
    animate() {
        this.animateStates();
        this.initializeAttackCycle();
        this.runAttackCycle();
    }

    /**
     * Animates the various states of the endboss
     */
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

    /**
     * Plays the death animation (only once)
     */
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

    /**
     * Plays the animation based on current behavior
     */
    playBehaviorAnimation() {
        this.speed = this.baseSpeed;
        if (this.isHurt) return this.playHurtBehavior();
        if (this.shouldChaseAfterHit()) return this.playChaseBehavior();
        if (this.isAttacking) return this.playAnimation(this.IMAGES_ATTACK);
        if (this.isRunning) return this.playRunningBehavior();
        this.playAnimation(this.IMAGES_ALERT);
    }

    playHurtBehavior() {
        this.playAnimation(this.IMAGES_HURT);
    }

    playChaseBehavior() {
        this.playAnimation(this.IMAGES_WALKING);
        this.chaseCharacter();
    }

    playRunningBehavior() {
        this.speed = this.runningAttackSpeed;
        this.playAnimation(this.IMAGES_WALKING);
        this.moveLeft();
    }

    /**
     * Initializes the attack cycle after first alert
     */
    initializeAttackCycle() {
        this.animateInterval2 = setInterval(() => {
            if (isPaused) return;
            if (this.isCharacterNear && !this.hasStartedAttacking && !this.isHurt && !this.isDead) {
                this.hasStartedAttacking = true;
                this.executeAttackPhases();
            }
        }, 50);
        addInterval(this.animateInterval2);
    }

    /**
     * Executes the attack cycle (Alert -> Attack -> Walking)
     */
    runAttackCycle() {
        this.animateInterval3 = setInterval(() => {
            if (isPaused) return;
            if (this.isCharacterNear && this.hasStartedAttacking && !this.isHurt && !this.isDead) {
                this.executeAttackPhases();
            }
        }, this.attackCycleIntervalMs);
        addInterval(this.animateInterval3);
    }

    /**
     * Executes the 4 phases of the attack
     */
    executeAttackPhases() {
        this.startAlertPhase();
        this.scheduleAttackPhase();
        this.scheduleWalkingPhase();
        this.scheduleEndPhase();
    }

    /**
     * Phase 1: Alert animation
     */
    startAlertPhase() {
        this.isAttacking = false;
        this.isRunning = false;
    }

    /**
     * Phase 2: Attack shortly after alert
     */
    scheduleAttackPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isAttacking = true;
                this.isRunning = false;
            }
        }, this.attackPhaseDelayMs);
    }

    /**
     * Phase 3: Walking phase shortly after attack
     */
    scheduleWalkingPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isAttacking = false;
                this.isRunning = true;
                this.playWalkingSound();
            }
        }, this.walkingPhaseDelayMs);
    }

    /**
     * Plays walking sound
     */
    playWalkingSound() {
        if (!isMuted) {
            let walkingSound = new Audio('audio/audio_chicken-alarm.mp3');
            walkingSound.play().catch(() => {});
        }
    }

    /**
     * Phase 4: Stop walking at the end of the cycle
     */
    scheduleEndPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isRunning = this.isCharacterNear;
            }
        }, this.endPhaseDelayMs);
    }

    /**
     * Called when endboss is hit
     */
    getHurt() {
        if (this.isDead) return;
        this.prepareForHitReaction();
        if (this.energy <= 0) return this.die();
        this.scheduleHurtRecovery();
    }

    prepareForHitReaction() {
        this.isCharacterNear = true;
        this.hasStartedAttacking = true;
        this.isAttacking = false;
        this.isRunning = false;
        this.isHurt = true;
        this.energy -= 10;
    }

    scheduleHurtRecovery() {
        setTimeout(() => {
            this.isHurt = false;
            this.chaseAfterHitUntil = Date.now() + this.chaseAfterHitDurationMs;
        }, 1000);
    }

    /**
     * Returns whether the endboss should currently rush the character
     * @returns {boolean}
     */
    shouldChaseAfterHit() {
        return Date.now() < this.chaseAfterHitUntil;
    }

    /**
     * Moves the endboss toward the character's current position
     */
    chaseCharacter() {
        if (!this.hasCharacterTarget()) return this.moveLeft();
        if (this.isCharacterLeftOfEndboss()) return this.moveTowardLeft();
        this.moveTowardRight();
    }

    hasCharacterTarget() {
        return this.world && this.world.character;
    }

    isCharacterLeftOfEndboss() {
        const characterCenterX = this.world.character.x + this.world.character.width / 2;
        const endbossCenterX = this.x + this.width / 2;
        return characterCenterX < endbossCenterX;
    }

    moveTowardLeft() {
        this.otherDirection = false;
        this.moveLeft();
    }

    moveTowardRight() {
        this.otherDirection = true;
        this.moveRight();
    }

    /**
     * Sets endboss to dead
     */
    die() {
        this.isDead = true;
        this.isRunning = false;
        this.isAttacking = false;
        this.chaseAfterHitUntil = 0;
    }

    /**
     * Returns the total death animation duration in ms
     */
    getDeathAnimationDurationMs() {
        return this.deathAnimationIntervalMs * this.IMAGES_DEAD.length * this.deadAnimationMaxLoops;
    }

}
