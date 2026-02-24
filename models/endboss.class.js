class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    speed = 5;
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
        if (this.isHurt) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAttacking) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.isRunning) {
            this.playAnimation(this.IMAGES_WALKING);
            this.moveLeft();
        } else {
            this.playAnimation(this.IMAGES_ALERT);
        }
    }

    /**
     * Initializes the attack cycle after first alert
     */
    initializeAttackCycle() {
        this.animateInterval2 = setInterval(() => {
            if (isPaused) return;
            if (this.isCharacterNear && !this.hasStartedAttacking && !this.isHurt && !this.isDead) {
                setTimeout(() => {
                    this.hasStartedAttacking = true;
                }, 1000);
            }
        }, 100);
        addInterval(this.animateInterval2);
    }

    /**
     * Executes the attack cycle (Alert → Attack → Walking)
     */
    runAttackCycle() {
        this.animateInterval3 = setInterval(() => {
            if (isPaused) return;
            if (this.isCharacterNear && this.hasStartedAttacking && !this.isHurt && !this.isDead) {
                this.executeAttackPhases();
            }
        }, 8000);
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
     * Phase 1: Alert animation (1 second)
     */
    startAlertPhase() {
        this.isAttacking = false;
        this.isRunning = false;
    }

    /**
     * Phase 2: Attack after 1 second
     */
    scheduleAttackPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isAttacking = true;
                this.isRunning = false;
            }
        }, 1000);
    }

    /**
     * Phase 3: Walking phase after 2 seconds (runs for 6 seconds)
     */
    scheduleWalkingPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isAttacking = false;
                this.isRunning = true;
                this.playWalkingSound();
            }
        }, 2000);
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
     * Phase 4: Stop walking after 8 seconds
     */
    scheduleEndPhase() {
        setTimeout(() => {
            if (!this.isHurt && !this.isDead) {
                this.isRunning = false;
            }
        }, 8000);
    }

    /**
     * Called when endboss is hit
     */
    getHurt() {
        this.isHurt = true;
        this.energy -= 10;
        if (this.energy <= 0) {
            this.die();
        } else {
            setTimeout(() => {
                this.isHurt = false;
            }, 1000);
        }
    }

    /**
     * Sets endboss to dead
     */
    die() {
        this.isDead = true;
        this.isRunning = false;
        this.isAttacking = false;
    }

    /**
     * Gibt die gesamte Dauer der Todesanimation in ms zurück
     */
    getDeathAnimationDurationMs() {
        return this.deathAnimationIntervalMs * this.IMAGES_DEAD.length * this.deadAnimationMaxLoops;
    }

}
