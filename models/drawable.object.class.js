class DrawableObject {
    x = 120;
    img;
    imageCache = {};
    currentImageIndex = 0;
    height = 150;
    width = 100;
    collisionOffsets = { left: 0, right: 0, top: 0, bottom: 0 };

    /**
     * Loads one image file and stores it as the current drawable image.
     * @param {string} path - The path to the image
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image at the object's position and size on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Placeholder for optional debug-frame rendering in subclasses.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawFrame(ctx) {
        return;
    }

    /**
     * Returns the hitbox boundaries after applying the configured collision offsets.
     * @returns {Object} Collision bounds with left, right, top, bottom
     */
    getCollisionBounds() {
        const leftOffset = Math.max(0, this.collisionOffsets?.left ?? 0);
        const rightOffset = Math.max(0, this.collisionOffsets?.right ?? 0);
        const topOffset = Math.max(0, this.collisionOffsets?.top ?? 0);
        const bottomOffset = Math.max(0, this.collisionOffsets?.bottom ?? 0);
        const left = this.x + leftOffset;
        const right = Math.max(left + 1, this.x + this.width - rightOffset);
        const top = this.y + topOffset;
        const bottom = Math.max(top + 1, this.y + this.height - bottomOffset);
        return { left, right, top, bottom };
    }

    /**
     * Preloads multiple images and stores them in the image cache for later animation use.
     * @param {Array} arr - Array with image paths
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
