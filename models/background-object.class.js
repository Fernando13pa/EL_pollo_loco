class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Constructor - loads background image and sets position
     * @param {string} imgPath - Path to background image
     * @param {number} x - X position
     * @param {number} y - Y position (optional)
     */
    constructor(imgPath, x, y) {
        super().loadImage(imgPath, x, y);
        this.x = x;
        this.y = 480 - this.height;
    }
}