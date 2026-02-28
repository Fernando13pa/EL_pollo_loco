Object.assign(World.prototype, {
    /**
     * Main collision check includes all collisions and cleanup.
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollections();
        this.cleanupDeadEnemies();
    },

    /**
     * Checks collisions between character and enemies.
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
    },

    /**
     * Handles character jumping on enemy.
     * @param {MovableObject} enemy - The enemy being jumped on.
     */
    handleJumpOnEnemy(enemy) {
        if (enemy.constructor.name !== 'Endboss') {
            if (typeof enemy.squash === 'function') {
                enemy.squash();
            } else {
                enemy.hit();
            }
            if (!isMuted) {
                let squashSound = new Audio('audio/audio_chicken-squash.mp3');
                squashSound.play().catch(() => {});
            }
        }
        this.character.jump();
    },

    /**
     * Handles side collision with enemy.
     * @param {MovableObject} enemy - The enemy colliding with.
     */
    handleSideCollisionWithEnemy(enemy) {
        if (this.character.isHurt()) return;
        this.character.hit();
        this.statusBar.setPercent(this.character.energy);
        if (!isMuted) {
            let hitSound = new Audio('audio/audio_hit.mp3');
            hitSound.play().catch(() => {});
        }
    },

    /**
     * Removes all dead enemies from level.
     */
    cleanupDeadEnemies() {
        const removeDelayMs = 450;
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            if (enemy instanceof Endboss) {
                continue;
            }
            if (enemy.energy == 0) {
                if (enemy.deadSince && Date.now() - enemy.deadSince < removeDelayMs) {
                    continue;
                }
                this.level.enemies.splice(i, 1);
            }
        }
    },

    /**
     * Checks collisions between thrown bottles and enemies.
     */
    checkBottleEnemyCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.hasHitGround) {
                    this.handleBottleHit(bottle, enemy);
                }
            });
        });
    },

    /**
     * Handles a bottle hit on an enemy.
     * @param {ThrowableObject} bottle - The thrown bottle.
     * @param {MovableObject} enemy - The hit enemy.
     */
    handleBottleHit(bottle, enemy) {
        this.playGlassSound();
        if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
            enemy.squash();
        } else if (enemy instanceof Endboss) {
            this.damageEndboss(enemy);
        }
        this.removeBottle(bottle);
    },

    /**
     * Plays glass breaking sound.
     */
    playGlassSound() {
        if (!isMuted) {
            let glassSound = new Audio('audio/audio_glass.mp3');
            glassSound.play().catch(() => {});
        }
    },

    /**
     * Damages the endboss and updates its health bar.
     * @param {Endboss} enemy - The endboss.
     */
    damageEndboss(enemy) {
        enemy.getHurt();
        let percent = (enemy.energy / 100) * 100;
        this.endbossBar.setPercent(percent);
    },

    /**
     * Removes a bottle from the game.
     * @param {ThrowableObject} bottle - The bottle to remove.
     */
    removeBottle(bottle) {
        this.throwableObjects = this.throwableObjects.filter((b) => b !== bottle);
        this.bottleInFlight = false;
    },

    /**
     * Checks if the character collects coins.
     */
    checkCoinCollisions() {
        if (!this.level.coins) return;
        this.level.coins.forEach((coin) => {
            if (this.isCharacterCollectingItem(coin)) {
                this.collectCoin(coin);
            }
        });
    },

    /**
     * Collects one coin and updates the UI.
     * @param {Coin} coin - The collected coin.
     */
    collectCoin(coin) {
        this.coinsCollected++;
        this.level.coins = this.level.coins.filter((c) => c !== coin);
        this.playCoinSound();
        let percent = this.totalCoins > 0 ? Math.round((this.coinsCollected / this.totalCoins) * 100) : 0;
        this.setCoinBarPercent(percent);
    },

    /**
     * Plays coin sound.
     */
    playCoinSound() {
        if (!isMuted) {
            let coinSound = new Audio('audio/audio_collect-coin.mp3');
            coinSound.play().catch(() => {});
        }
    },

    /**
     * Checks if the character collects bottles.
     */
    checkBottleCollections() {
        if (!this.level.bottles) return;
        this.level.bottles.forEach((bottle) => {
            if (this.isCharacterCollectingItem(bottle)) {
                this.collectBottle(bottle);
            }
        });
    },

    /**
     * Collects one bottle and updates the UI.
     * @param {Bottle} bottle - The collected bottle.
     */
    collectBottle(bottle) {
        this.bottlesCollected++;
        this.level.bottles = this.level.bottles.filter((b) => b !== bottle);
        this.playBottleSound();
        let percent = this.totalBottles > 0 ? Math.round((this.bottlesCollected / this.totalBottles) * 100) : 0;
        this.setBottleBarPercent(percent);
    },

    /**
     * Plays bottle sound.
     */
    playBottleSound() {
        if (!isMuted) {
            let bottleSound = new Audio('audio/audio_throw-bottle.mp3');
            bottleSound.play().catch(() => {});
        }
    },

    /**
     * Special collision for collecting items (ignores character head).
     * @param {MovableObject} item - The item (coin or bottle).
     * @returns {boolean} True if character collects the item.
     */
    isCharacterCollectingItem(item) {
        const characterBounds = this.character.getCollisionBounds();
        const itemBounds = item.getCollisionBounds();
        return characterBounds.right > itemBounds.left &&
            characterBounds.left < itemBounds.right &&
            characterBounds.bottom > itemBounds.top &&
            characterBounds.top < itemBounds.bottom;
    },

    /**
     * Sets coin bar percentage.
     * @param {number} percent - The percentage.
     */
    setCoinBarPercent(percent) {
        this.coinBar.setPercent(percent);
    },

    /**
     * Sets bottle bar percentage.
     * @param {number} percent - The percentage.
     */
    setBottleBarPercent(percent) {
        this.bottleBar.setPercent(percent);
    }
});
