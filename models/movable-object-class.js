class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.25;
    energy = 100;
    lasHit = 0;
    gravityInterval;

    /** Launches the gravity loop that updates vertical movement while the object is airborne. */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (isPaused) return;
            this.applyGravityStep();
        }, 1000 / 50);
        addInterval(this.gravityInterval);
    }

    /** Applies one gravity step and clamps non-throwable objects back to the ground. */
    applyGravityStep() {
        if (!this.isAboveGround() && this.speedY <= 0) return;
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.clampToGround();
    }

    /** Prevents non-throwable objects from sinking below their ground level. */
    clampToGround() {
        if (this instanceof ThrowableObject) return;
        const groundLevelY = this.getGroundLevelY();
        if (this.y <= groundLevelY) return;
        this.y = groundLevelY;
        this.speedY = 0;
    }

    /**
     * Returns whether the object is currently moving downward.
     * @returns {boolean} true if falling
     */
    isOnWayDown() {
        return this.speedY < 0;
    }

    /**
     * Returns whether the object is still above its ground level or is a throwable object in flight.
     * @returns {boolean} true if above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < this.getGroundLevelY();
        }
    }

    /**
     * Returns the Y position that represents ground contact for this object.
     * @returns {number}
     */
    getGroundLevelY() {
        return 150;
    }

/**
     * Returns whether this object's hitbox overlaps another object's hitbox.
     * @param {MovableObject} movableObject - The other object
     * @returns {boolean} true on collision
     */
    isColliding(movableObject) {
        const a = this.getCollisionBounds();
        const b = movableObject.getCollisionBounds();
        return a.right > b.left &&
            a.left < b.right &&
            a.bottom > b.top &&
            a.top < b.bottom;
    }

    /**
     * Returns this object's current collision bounds.
     * @returns {object} Bounding box with left, right, top, bottom
     */
    getCollisionBounds() {
        return super.getCollisionBounds();
    }

/**
     * Returns whether the current collision hits the target from above while falling.
     * @param {MovableObject} enemy - Object to check collision with
     * @returns {boolean} true if collision is from above
     */
    isCollidingFromAbove(enemy) {
        if (!this.isColliding(enemy)) return false;
        if (!this.isAboveGround()) return false;
        if (this.speedY >= 0) return false;
        const characterBounds = this.getCollisionBounds();
        const enemyBounds = enemy.getCollisionBounds();
        const enemyHeight = enemyBounds.bottom - enemyBounds.top;
        const tolerance = enemyHeight < 50 ? 20 : 35;
        return characterBounds.bottom >= enemyBounds.top - 20 &&
            characterBounds.bottom <= enemyBounds.top + tolerance;
    }

/**
     * Returns whether the collision reaches deep enough into the target to count as a side hit.
     * @param {MovableObject} enemy - Object to check collision with
     * @returns {boolean} true if collision is from side
     */
    isCollidingFromSide(enemy) {
        if (!this.isColliding(enemy)) return false;
        const characterBounds = this.getCollisionBounds();
        const enemyBounds = enemy.getCollisionBounds();
        const enemyHeight = enemyBounds.bottom - enemyBounds.top;
        const tolerance = enemyHeight < 50 ? 20 : 35;
        return characterBounds.bottom > enemyBounds.top + tolerance;
    }

    /** Reduces the object's energy and stores the hit time for hurt-state checks. */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lasHit = new Date().getTime();
        }
    }

    /**
     * Returns whether the object is currently moving downward.
     * @returns {boolean} true if falling
     */
    isOnWayDown() {
        return this.speedY < 0;
    }

    /**
     * Returns whether the object has no energy left.
     * @returns {boolean} true if energy = 0
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Returns whether the object was hit within the last second.
     * @returns {boolean} true if hurt
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lasHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Advances to the next frame in the given animation image sequence.
     * @param {Array} images - Array with image paths
     */
    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    /** Moves the object to the right by its current speed. */
    moveRight() {
        this.x += this.speed;
    }

    /** Moves the object to the left and wraps it back when it leaves the screen. */
    moveLeft() {
        this.x -= this.speed;
        if (this.x < -this.width) {
            this.x = 800;
        }
    }

    /** Applies an upward jump impulse by assigning a positive vertical speed. */
    jump() {
        this.speedY = 16;
    }
}
