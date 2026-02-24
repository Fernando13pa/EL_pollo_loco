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
     * Main function for all collision checks
     */
    /**
     * Main collision check includes all collisions and cleanup
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollections();
        this.cleanupDeadEnemies();
    }

    /**
     * Checks collisions between character and enemies
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isColliding(enemy)) return;
            if (enemy.energy == 0) return;
            const isFromAbove = this.character.isCollidingFromAbove(enemy);
            if (isFromAbove) {
                this.handleJumpOnEnemy(enemy);
            } else {
                this.handleSideCollisionWithEnemy(enemy);
            }
        });
    }

    /**
     * Handles character jumping on enemy
     * @param {MovableObject} enemy - The enemy being jumped on
     */
    handleJumpOnEnemy(enemy) {
        if (enemy.constructor.name !== 'Endboss') {
            enemy.hit();  // Kill the enemy
            if (!isMuted) {
                let squashSound = new Audio('audio/audio_chicken-squash.mp3');
                squashSound.play().catch(() => {});
            }
        }
        this.character.jump();  // Bounce!
    }

    /**
     * Handles side collision with enemy
     * @param {MovableObject} enemy - The enemy colliding with
     */
    handleSideCollisionWithEnemy(enemy) {
        if (this.character.isHurt()) return;
        this.character.hit();
        this.statusBar.setPercent(this.character.energy);
        if (!isMuted) {
            let hitSound = new Audio('audio/audio_hit.mp3');
            hitSound.play().catch(() => {});
        }
    }

    /**
     * Removes all dead enemies from level
     */
    cleanupDeadEnemies() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            if (this.level.enemies[i] instanceof Endboss) {
                continue;
            }
            if (this.level.enemies[i].energy == 0) {
                this.level.enemies.splice(i, 1);
            }
        }
    }

    /**
     * Checks collisions between thrown bottles and enemies
     */
    checkBottleEnemyCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.hasHitGround) {
                    this.handleBottleHit(bottle, enemy);
                }
            });
        });
    }

    /**
     * Handles a bottle hit on an enemy
     * @param {ThrowableObject} bottle - The thrown bottle
     * @param {MovableObject} enemy - The hit enemy
     */
    handleBottleHit(bottle, enemy) {
        this.playGlassSound();
        if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
            enemy.energy = 0;
        } else if (enemy instanceof Endboss) {
            this.damageEndboss(enemy);
        }
        this.removeBottle(bottle);
    }

    /**
     * Plays glass breaking sound
     */
    playGlassSound() {
        if (!isMuted) {
            let glassSound = new Audio('audio/audio_glass.mp3');
            glassSound.play().catch(() => {});
        }
    }

    /**
     * Damages the endboss and updates his health bar
     * @param {Endboss} enemy - The endboss
     */
    damageEndboss(enemy) {
        enemy.getHurt();
        let percent = (enemy.energy / 100) * 100;
        this.endbossBar.setPercent(percent);
    }

    /**
     * Removes a bottle from the game
     * @param {ThrowableObject} bottle - The bottle to remove
     */
    removeBottle(bottle) {
        this.throwableObjects = this.throwableObjects.filter(b => b !== bottle);
        this.bottleInFlight = false;
    }

    /**
     * Prüft ob Character Münzen einsammelt
     */
    checkCoinCollisions() {
        if (!this.level.coins) return;
        this.level.coins.forEach((coin) => {
            if (this.isCharacterCollectingItem(coin)) {
                this.collectCoin(coin);
            }
        });
    }

    /**
     * Sammelt eine Münze ein und aktualisiert die Anzeige
     * @param {Coin} coin - Die eingesammelte Münze
     */
    collectCoin(coin) {
        this.coinsCollected++;
        this.level.coins = this.level.coins.filter(c => c !== coin);
        this.playCoinSound();
        let percent = this.totalCoins > 0 ? Math.round((this.coinsCollected / this.totalCoins) * 100) : 0;
        this.setCoinBarPercent(percent);
    }

    /**
     * Spielt Münzen-Sound ab
     */
    playCoinSound() {
        if (!isMuted) {
            let coinSound = new Audio('audio/audio_collect-coin.mp3');
            coinSound.play().catch(() => {});
        }
    }

    /**
     * Prüft ob Character Flaschen einsammelt
     */
    checkBottleCollections() {
        if (!this.level.bottles) return;
        this.level.bottles.forEach((bottle) => {
            if (this.isCharacterCollectingItem(bottle)) {
                this.collectBottle(bottle);
            }
        });
    }

    /**
     * Sammelt eine Flasche ein und aktualisiert die Anzeige
     * @param {Bottle} bottle - Die eingesammelte Flasche
     */
    collectBottle(bottle) {
        this.bottlesCollected++;
        this.level.bottles = this.level.bottles.filter(b => b !== bottle);
        this.playBottleSound();
        let percent = this.totalBottles > 0 ? Math.round((this.bottlesCollected / this.totalBottles) * 100) : 0;
        this.setBottleBarPercent(percent);
    }

    /**
     * Spielt Flaschen-Sound ab
     */
    playBottleSound() {
        if (!isMuted) {
            let bottleSound = new Audio('audio/audio_throw-bottle.mp3');
            bottleSound.play().catch(() => {});
        }
    }

    /**
     * Spezielle Kollision für das Sammeln - Kopf des Characters zählt nicht
     * @param {MovableObject} item - Das Item (Coin oder Bottle)
     * @returns {boolean} true wenn Character das Item einsammelt
     */
    isCharacterCollectingItem(item) {
        const characterBodyY = this.character.y + 120;
        const characterBodyHeight = this.character.height - 120;
        return this.character.x + this.character.width > item.x &&
            this.character.x < item.x + item.width &&
            characterBodyY + characterBodyHeight > item.y &&
            characterBodyY < item.y + item.height;
    }

    /**
     * Setzt den Prozentsatz der Münzen-Anzeige
     * @param {number} percent - Der Prozentsatz
     */
    setCoinBarPercent(percent) {
        this.coinBar.setPercent(percent);
    }

    /**
     * Setzt den Prozentsatz der Flaschen-Anzeige
     * @param {number} percent - Der Prozentsatz
     */
    setBottleBarPercent(percent) {
        this.bottleBar.setPercent(percent);
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
     * Fordert den nächsten Frame an
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
     * Prüft ob das Spiel vorbei ist (Character tot oder Endboss besiegt)
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
     * Fügt ein Array von Objekten zur Map hinzu
     * @param {Array} objects - Array von zeichenbaren Objekten
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addtoMap(o);
        });
    }

    /**
     * Fügt ein einzelnes Objekt zur Map hinzu (mit Spiegelung wenn nötig)
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
     * Setzt die Spiegelung eines Objekts zurück
     * @param {MovableObject} movableObject - Das Objekt
     */
    flipImageBack(movableObject) {
        movableObject.x = -movableObject.x * 1;
        this.ctx.restore();
    }

}
