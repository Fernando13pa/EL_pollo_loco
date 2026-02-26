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
    endbossSoundStarted = false;
    isGameOver = false;
    gameWonShown = false;
    gameLoopInterval = null;
    isPaused = false;  // Paused state for settings menu
    bottleInFlight = false;  // Tracks if a bottle is currently in flight
    isActive = true;  // Flag to stop drawing loop on restart

    /**
     * Constructor - initializes the game world with canvas, keyboard and level
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

    /**
     * Initializes the counters for coins and bottles
     */
    initializeCounters() {
        this.coinsCollected = 0;
        this.bottlesCollected = 0;
        this.totalCoins = this.level.coins ? this.level.coins.length : 0;
        this.totalBottles = this.level.bottles ? this.level.bottles.length : 0;
    }

    /**
     * Sets up background sound and starts it if not muted
     */
    setupBackgroundSound() {
        this.backgroundSound.loop = true;
        this.backgroundSound.volume = 0.3;
        if (!isMuted) {
            this.backgroundSound.play().catch(() => {});
        }
    }

    /**
     * Sets world reference and starts all animations
     */
    setWorld() {
        this.character.world = this;
        this.character.animate();
        this.level.enemies.forEach((enemy) => {
            if (enemy.animate) enemy.animate();
        });
    }

    /**
     * Starts the game loop - checks collisions and events regularly
     */
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

    /**
     * Checks if bottles are thrown and removes finished bottles
     */
    checkThrowableObjects() {
        if (this.keyboard.D && this.bottleBar.percent > 0 && !this.bottleInFlight) {
            this.throwBottle();
        }
        this.removeFinishedBottles();
    }

    /**
     * Throws a new bottle
     */
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

    /**
     * Removes bottles that are finished with splash animation
     */
    removeFinishedBottles() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.shouldBeRemoved) {
                this.throwableObjects = this.throwableObjects.filter(b => b !== bottle);
                this.bottleInFlight = false;
            }
        });
    }

    /**
     * Checks if endboss should appear and starts his sound
     */
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

    /**
     * Activates the endboss when character is close enough
     */
    activateEndboss() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss) endboss.isCharacterNear = true;
    }



    /**
     * Hauptzeichenfunktion - wird kontinuierlich aufgerufen
     */
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

    /**
     * Fordert den nÃ¤chsten Frame an
     */
    requestNextFrame() {
        if (!this.isActive) return;
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Zeichnet alle Spielobjekte
     */
    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.drawStatusBars();
        this.drawLevelObjects();
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Zeichnet alle Status-Bars (fixiert auf Bildschirm)
     */
    drawStatusBars() {
        this.ctx.translate(-this.camera_x, 0);
        this.addtoMap(this.coinBar);
        this.addtoMap(this.statusBar);
        this.addtoMap(this.bottleBar);
        this.addtoMap(this.endbossBar);
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Zeichnet alle Level-Objekte (Character, Gegner, Items)
     */
    drawLevelObjects() {
        if (this.level.coins) this.addObjectsToMap(this.level.coins);
        if (this.level.bottles) this.addObjectsToMap(this.level.bottles);
        this.addtoMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * PrÃ¼ft ob das Spiel vorbei ist (Character tot oder Endboss besiegt)
     */
    checkGameEndConditions() {
        if (this.character.energy <= 0) {
            this.handleGameOver();
        }
        if (this.endboss && this.endboss.isDead && !this.gameWonShown) {
            this.handleGameWon();
        }
    }

    /**
     * Behandelt Game Over Zustand
     */
    handleGameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoopInterval);
        showGameOver();
    }

    /**
     * Behandelt Gewinn-Zustand
     */
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
     * FÃ¼gt ein Array von Objekten zur Map hinzu
     * @param {Array} objects - Array von zeichenbaren Objekten
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addtoMap(o);
        });
    }

    /**
     * FÃ¼gt ein einzelnes Objekt zur Map hinzu (mit Spiegelung wenn nÃ¶tig)
     * @param {MovableObject} movableObject - Das zu zeichnende Objekt
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
     * Spiegelt das Bild eines Objekts horizontal
     * @param {MovableObject} movableObject - Das zu spiegelnde Objekt
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = -movableObject.x * 1;
    }

    /**
     * Setzt die Spiegelung eines Objekts zurÃ¼ck
     * @param {MovableObject} movableObject - Das Objekt
     */
    flipImageBack(movableObject) {
        movableObject.x = -movableObject.x * 1;
        this.ctx.restore();
    }

}



