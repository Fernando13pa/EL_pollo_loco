/**
 * Endboss display (Endboss Bar) - shows endboss health in 6 levels
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
     * Constructor - loads images and sets position
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
     * Sets the endboss health percentage and updates the image
     * @param {number} percent - The percentage (0-100)
     */
    setPercent(percent) {
        this.percent = percent;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which image is displayed based on percentage
     * @returns {number} Index of the image to display
     */
    resolveImageIndex() {
        if (this.percent == 100) {
            return 5;
        } else if (this.percent >= 80) {
            return 4;
        } else if (this.percent >= 60) {
            return 3;
        } else if (this.percent >= 40) {
            return 2;
        } else if (this.percent >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
