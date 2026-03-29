class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    endbossBar = new EndbossBar();
    throwableObjects = [];
    backgroundSound = new Audio('audio/audio_background.mp3');
    chickenSquashSound = new Audio('audio/audio_chicken-squash.mp3');
    endbossSound = new Audio('audio/audio_endboss-sound.mp3');
    endbossHitSound = new Audio('audio/audio_hit.mp3');
    endbossSoundStarted = false;
    lastEndbossHitSoundAt = 0;
    endbossHitSoundCooldownMs = 700;
    isGameOver = false;
    gameWonShown = false;
    gameLoopInterval = null;
    isPaused = false;  // Paused state for settings menu
    bottleInFlight = false;  // Tracks if a bottle is currently in flight
    isActive = true;  // Flag to stop drawing loop on restart

    /**
     * Creates the game world, connects canvas and input, and starts rendering plus gameplay loops.
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {Keyboard} keyboard - The keyboard object
     * @param {Level} level - The current level
     */
    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.initializeCounters();
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        this.setupBackgroundSound();
        this.endbossSound.loop = true;
        this.draw();
        this.setWorld();
        this.run();
    }

    /** Resets the collected-item counters and stores the total number of coins and bottles in the level. */
    initializeCounters() {
        this.coinsCollected = 0;
        this.bottlesCollected = 0;
        this.totalCoins = this.level.coins ? this.level.coins.length : 0;
        this.totalBottles = this.level.bottles ? this.level.bottles.length : 0;
    }

    /** Configures the looping background music and starts playback when sound is enabled. */
    setupBackgroundSound() {
        this.backgroundSound.loop = true;
        this.backgroundSound.volume = 0.3;
        this.endbossHitSound.volume = 0.8;
        if (!isMuted) {
            this.backgroundSound.play().catch(() => {});
        }
    }

    /** Plays the endboss hit sound only when its cooldown has elapsed. */
    playEndbossHitSound() {
        if (isMuted) return;
        const now = Date.now();
        if (now - this.lastEndbossHitSoundAt < this.endbossHitSoundCooldownMs) return;
        if (!this.endbossHitSound.paused && !this.endbossHitSound.ended) return;
        this.lastEndbossHitSoundAt = now;
        this.endbossHitSound.play().catch(() => {});
    }

    /** Links the world instance to the character and enemies, then starts their animations. */
    setWorld() {
        this.character.world = this;
        this.character.animate();
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
            if (enemy.animate) enemy.animate();
        });
    }

    /** Launches the main update loop for collisions, throwing, and the endboss trigger. */
    run() {
        this.gameLoopInterval = setInterval(() => {
            if (!this.isGameOver) {
                this.checkCollisions();
                this.checkThrowableObjects();
                this.checkEndbossAppearance();
            }
        }, 1000 / 60);
        addInterval(this.gameLoopInterval);
    }

    /** Triggers a new bottle throw when allowed and removes bottles whose animation has finished. */
    checkThrowableObjects() {
        this.updateBottleThrowState();
        if (this.keyboard.D && this.bottleBar.percent > 0 && this.canThrowBottle()) {
            this.throwBottle();
        }
        this.removeFinishedBottles();
    }

    canThrowBottle() {
        return !this.bottleInFlight && !this.hasActiveThrowableBottle();
    }

    hasActiveThrowableBottle() {
        return this.throwableObjects.some((bottle) => !bottle.shouldBeRemoved);
    }

    updateBottleThrowState() {
        this.bottleInFlight = this.hasActiveThrowableBottle();
    }

    /** Creates a new throwable bottle in front of the character and updates the bottle counter. */
    throwBottle() {
        const throwDirection = this.character.otherDirection ? -1 : 1;
        const bottleOffsetX = throwDirection === 1 ? this.character.width : -20;
        const bottleX = this.character.x + bottleOffsetX;
        let bottle = new ThrowableObject(bottleX, this.character.y + 50, throwDirection);
        this.throwableObjects.push(bottle);
        this.bottleInFlight = true;
        this.bottlesCollected--;
        this.playBottleSound();
        let percent = this.totalBottles > 0 ? Math.round((this.bottlesCollected / this.totalBottles) * 100) : 0;
        this.setBottleBarPercent(percent);
    }

    /** Removes throwable bottles that have completed their splash animation. */
    removeFinishedBottles() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.shouldBeRemoved) {
                this.throwableObjects = this.throwableObjects.filter(b => b !== bottle);
            }
        });
        this.updateBottleThrowState();
    }

    /** Triggers the endboss encounter once the character reaches the trigger position. */
    checkEndbossAppearance() {
        if (this.character.x > 3000 && !this.endbossSoundStarted) {
            if (!isMuted) {
                this.endbossSound.play().catch(() => {});
            }
            this.endbossSoundStarted = true;
        }
        if (this.character.x > 3000) {
            this.activateEndboss();
        }
    }

    /** Marks the endboss as alerted so its behavior can switch into the active fight state. */
    activateEndboss() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss) endboss.isCharacterNear = true;
    }


    /** Renders one frame of the game and schedules the next frame while the world is active. */
    draw() {
        if (!this.isActive) return;
        if (this.isPaused) {
            this.requestNextFrame();
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGameObjects();
        this.checkGameEndConditions();
        this.requestNextFrame();
    }

    /** Requests the next animation frame and calls the draw loop again. */
    requestNextFrame() {
        if (!this.isActive) return;
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /** Draws the scrolling world contents and the fixed UI in the correct camera order. */
    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.drawStatusBars();
        this.drawLevelObjects();
        this.ctx.translate(-this.camera_x, 0);
    }

    /** Draws the status bars without camera movement so they stay fixed on the screen. */
    drawStatusBars() {
        this.ctx.translate(-this.camera_x, 0);
        this.addtoMap(this.coinBar);
        this.addtoMap(this.statusBar);
        this.addtoMap(this.bottleBar);
        this.addtoMap(this.endbossBar);
        this.ctx.translate(this.camera_x, 0);
    }

    /** Draws collectibles, the character, enemies, and active throwable objects. */
    drawLevelObjects() {
        if (this.level.coins) this.addObjectsToMap(this.level.coins);
        if (this.level.bottles) this.addObjectsToMap(this.level.bottles);
        this.addtoMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
    }

    /** Ends the round when the player loses or defeats the endboss. */
    checkGameEndConditions() {
        if (this.character.energy <= 0) {
            this.handleGameOver();
        }
        if (this.endboss && this.endboss.isDead && !this.gameWonShown) {
            this.handleGameWon();
        }
    }

    /** Stops the game loop and shows the game-over screen. */
    handleGameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoopInterval);
        showGameOver();
    }

    /** Stops gameplay after the endboss death animation and then shows the win screen. */
    handleGameWon() {
        this.gameWonShown = true;
        this.isGameOver = true;
        const deathAnimationDuration = this.endboss && this.endboss.getDeathAnimationDurationMs
            ? this.endboss.getDeathAnimationDurationMs()
            : 1200;
        setTimeout(() => {
            clearInterval(this.gameLoopInterval);
            showGameWon();
        }, deathAnimationDuration);
    }
    /**
     * Draws each object from an array by passing it to the single-object drawing helper.
     * @param {Array} objects - Array of drawable objects
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addtoMap(o);
        });
    }

    /**
     * Draws one object and mirrors it temporarily when it faces the opposite direction.
     * @param {MovableObject} movableObject - The object to draw
     */
    addtoMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);
        }
        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);
        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

    /**
     * Flips the canvas horizontally so an object can be drawn facing left.
     * @param {MovableObject} movableObject - The object to mirror
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = -movableObject.x * 1;
    }

    /**
     * Restores the normal canvas orientation after a mirrored draw call.
     * @param {MovableObject} movableObject - The object
     */
    flipImageBack(movableObject) {
        movableObject.x = -movableObject.x * 1;
        this.ctx.restore();
    }

}


