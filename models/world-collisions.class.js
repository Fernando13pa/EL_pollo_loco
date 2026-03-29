Object.assign(World.prototype, {
    /** Runs all collision checks for the current frame and removes defeated enemies afterwards. */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollections();
        this.cleanupDeadEnemies();
    },

    /** Resolves character-enemy collisions and classifies each hit as top or side contact. */
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
     * Defeats a jumpable enemy and bounces the character back upward after a top collision.
     * @param {MovableObject} enemy - The enemy being jumped on.
     */
    handleJumpOnEnemy(enemy) {
        if (enemy.constructor.name !== 'Endboss') this.defeatEnemyFromTop(enemy);
        this.character.resetJumpAnimation();
        this.character.jump();
    },

    /**
     * Defeats an enemy after a top hit and triggers the squash sound effect.
     * @param {MovableObject} enemy - The enemy that was hit from above.
     */
    defeatEnemyFromTop(enemy) {
        if (typeof enemy.squash === 'function') enemy.squash();
        else enemy.hit();
        this.playSquashSound();
    },

    /** Plays the chicken squash sound if sound is enabled. */
    playSquashSound() {
        if (isMuted) return;
        let squashSound = new Audio('audio/audio_chicken-squash.mp3');
        squashSound.play().catch(() => {});
    },

    /**
     * Damages the character on a side collision, updates the health bar, and plays the hit sound.
     * @param {MovableObject} enemy - The enemy touching the character from the side.
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

    /** Removes defeated non-endboss enemies from the level after their death delay has passed. */
    cleanupDeadEnemies() {
        const removeDelayMs = 450;
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            if (!this.shouldRemoveEnemy(enemy, removeDelayMs)) continue;
            this.level.enemies.splice(i, 1);
        }
    },

    /**
     * Returns whether an enemy can already be removed from the level.
     * @param {MovableObject} enemy - The enemy to evaluate.
     * @param {number} removeDelayMs - Minimum delay after death before removal.
     * @returns {boolean} True when the enemy should be removed.
     */
    shouldRemoveEnemy(enemy, removeDelayMs) {
        if (enemy instanceof Endboss || enemy.energy != 0) return false;
        if (enemy.deadSince && Date.now() - enemy.deadSince < removeDelayMs) return false;
        return true;
    },

    /** Resolves thrown-bottle collisions against enemies before the bottle touches the ground. */
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
     * Applies the correct hit effect for a bottle collision and removes the bottle afterwards.
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

    /** Plays the glass breaking sound if sound is enabled. */
    playGlassSound() {
        if (!isMuted) {
            let glassSound = new Audio('audio/audio_glass.mp3');
            glassSound.play().catch(() => {});
        }
    },

    /**
     * Reduces the endboss health and refreshes the endboss health bar.
     * @param {Endboss} enemy - The endboss.
     */
    damageEndboss(enemy) {
        enemy.getHurt();
        this.playEndbossHitSound();
        let percent = (enemy.energy / 100) * 100;
        this.endbossBar.setPercent(percent);
    },

    /**
     * Removes a bottle from the active throwable objects and allows the next throw.
     * @param {ThrowableObject} bottle - The bottle to remove.
     */
    removeBottle(bottle) {
        this.throwableObjects = this.throwableObjects.filter((b) => b !== bottle);
        this.updateBottleThrowState();
    },

    /** Detects coin pickups for the current character position. */
    checkCoinCollisions() {
        if (!this.level.coins) return;
        this.level.coins.forEach((coin) => {
            if (this.isCharacterCollectingItem(coin)) {
                this.collectCoin(coin);
            }
        });
    },

    /**
     * Removes a collected coin, increases the counter, plays the sound, and updates the coin bar.
     * @param {Coin} coin - The collected coin.
     */
    collectCoin(coin) {
        this.coinsCollected++;
        this.level.coins = this.level.coins.filter((c) => c !== coin);
        this.playCoinSound();
        let percent = this.totalCoins > 0 ? Math.round((this.coinsCollected / this.totalCoins) * 100) : 0;
        this.setCoinBarPercent(percent);
    },

    /** Plays the coin collection sound if sound is enabled. */
    playCoinSound() {
        if (!isMuted) {
            let coinSound = new Audio('audio/audio_collect-coin.mp3');
            coinSound.play().catch(() => {});
        }
    },

    /** Detects bottle pickups for the current character position. */
    checkBottleCollections() {
        if (!this.level.bottles) return;
        this.level.bottles.forEach((bottle) => {
            if (this.isCharacterCollectingItem(bottle)) {
                this.collectBottle(bottle);
            }
        });
    },

    /**
     * Removes a collected bottle, increases the counter, plays the sound, and updates the bottle bar.
     * @param {Bottle} bottle - The collected bottle.
     */
    collectBottle(bottle) {
        this.bottlesCollected++;
        this.level.bottles = this.level.bottles.filter((b) => b !== bottle);
        this.playBottleSound();
        let percent = this.totalBottles > 0 ? Math.round((this.bottlesCollected / this.totalBottles) * 100) : 0;
        this.setBottleBarPercent(percent);
    },

    /** Plays the bottle collection sound if sound is enabled. */
    playBottleSound() {
        if (!isMuted) {
            let bottleSound = new Audio('audio/audio_throw-bottle.mp3');
            bottleSound.play().catch(() => {});
        }
    },

/**
     * Returns whether the character hitbox overlaps a collectible item hitbox.
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
     * Updates the coin bar to the given collection percentage.
     * @param {number} percent - The percentage.
     */
    setCoinBarPercent(percent) {
        this.coinBar.setPercent(percent);
    },

    /**
     * Updates the bottle bar to the given collection percentage.
     * @param {number} percent - The percentage.
     */
    setBottleBarPercent(percent) {
        this.bottleBar.setPercent(percent);
    }
});
