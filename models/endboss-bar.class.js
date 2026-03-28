/**
 * Displays the endboss health with one image for each 20% step.
 */
class EndbossBar extends DrawableObject {
    IMAGES = [
        'img/7_Barras/2_barra_de_estado_jefe/azul/blue0.png',
        'img/7_Barras/2_barra_de_estado_jefe/azul/blue20.png',
        'img/7_Barras/2_barra_de_estado_jefe/azul/blue40.png',
        'img/7_Barras/2_barra_de_estado_jefe/azul/blue60.png',
        'img/7_Barras/2_barra_de_estado_jefe/azul/blue80.png',
        'img/7_Barras/2_barra_de_estado_jefe/azul/blue100.png'
    ];
    percent = 100;

    /**
     * Preloads the endboss bar images, positions the bar, and starts it at full health.
     */
    constructor() {
        super().loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.x = 500;
        this.y = 10;
        this.width = 200;
        this.height = 60;
        this.setPercent(100);
    }

    /**
     * Stores the endboss health percentage and swaps to the matching bar image.
     * @param {number} percent - The percentage (0-100)
     */
    setPercent(percent) {
        this.percent = percent;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Returns the image index that matches the current endboss health percentage.
     * @returns {number} Index of the image to display
     */
    resolveImageIndex() {
        const bounded = Math.max(0, Math.min(100, this.percent));
        return bounded === 0 ? 0 : Math.ceil(bounded / 20);
    }
}

