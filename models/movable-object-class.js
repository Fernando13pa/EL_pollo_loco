class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lasHit = 0;
    gravityInterval;

    /**
     * Applies gravity to the object - objects fall down when above ground
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (isPaused) return;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
        addInterval(this.gravityInterval);
    }

    /**
     * Checks if object is falling down (speedY negative)
     * @returns {boolean} true if falling
     */
    isOnWayDown() {
        return this.speedY < 0;
    }

    /**
     * Checks if object is above ground (y < 150) or a ThrowableObject
     * @returns {boolean} true if above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 150;
        }
    }

    /**
     * Checks if this object collides with another (AABB Bounding Box)
     * @param {MovableObject} movableObject - The other object
     * @returns {boolean} true on collision
     */
    isColliding(movableObject) {
        return this.x + this.width > movableObject.x &&
            this.x < movableObject.x + movableObject.width &&
            this.y + this.height > movableObject.y &&
            this.y < movableObject.y + movableObject.height;
    }

    /**
     * Gets collision bounds (hitbox) adjusted by character's body position
     * @returns {object} Bounding box with left, right, top, bottom
     */
    getCollisionBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    /**
     * Checks if collision is from above (character jumping on enemy)
     * @param {MovableObject} enemy - Object to check collision with
     * @returns {boolean} true if collision is from above
     */
    isCollidingFromAbove(enemy) {
        if (!this.isColliding(enemy)) return false;
        if (!this.isAboveGround()) return false;
        if (this.speedY >= 0) return false;
        const characterBottom = this.y + this.height;
        const enemyTop = enemy.y;
        const tolerance = enemy.height < 50 ? 20 : 35;
        return characterBottom >= enemyTop - 50 && characterBottom <= enemyTop + tolerance;
    }

    /**
     * Checks if collision is from the side (horizontal)
     * @param {MovableObject} enemy - Object to check collision with
     * @returns {boolean} true if collision is from side
     */
    isCollidingFromSide(enemy) {
        if (!this.isColliding(enemy)) return false;
        const characterBottom = this.y + this.height;
        const enemyTop = enemy.y;
        const tolerance = enemy.height < 50 ? 20 : 35;
        return characterBottom > enemyTop + tolerance;
    }

    /**
     * Reduces energy by 5 points and stores hit time
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lasHit = new Date().getTime();
        }
    }

    /**
     * Checks if object is falling down (speedY negative)
     * @returns {boolean} true if falling
     */
    isOnWayDown() {
        return this.speedY < 0;
    }

    /**
     * Checks if object is dead (no energy left)
     * @returns {boolean} true if energy = 0
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks if object is hurt (was hit less than 1 second ago)
     * @returns {boolean} true if hurt
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lasHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Plays animation by cycling through an image array
     * @param {Array} images - Array with image paths
     */
    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    /**
     * Moves the object to the right
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left, resets position if outside screen
     */
    moveLeft() {
        this.x -= this.speed;
        if (this.x < -this.width) {
            this.x = 800;
        }
    }

    /**
     * Lets the object jump by setting vertical velocity
     */
    jump() {
        this.speedY = 30;
    }
}
