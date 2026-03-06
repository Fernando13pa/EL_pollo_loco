/**
 * Health bar (Status Bar) - displays character health in 6 levels
 */
class StatusBar extends DrawableObject {
    IMAGES = [
        'img/7_Barras/1_barra_de_estados/2_barra_de_vida/azul/0.png',
        'img/7_Barras/1_barra_de_estados/2_barra_de_vida/azul/20.png',
        'img/7_Barras/1_barra_de_estados/2_barra_de_vida/azul/40.png',
        'img/7_Barras/1_barra_de_estados/2_barra_de_vida/azul/60.png',
        'img/7_Barras/1_barra_de_estados/2_barra_de_vida/azul/80.png',
        'img/7_Barras/1_barra_de_estados/2_barra_de_vida/azul/100.png'
    ];
    percent = 100;

    /**
     * Constructor - loads images and sets position
     */
    constructor() {
        super().loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 55;
        this.width = 200;
        this.height = 60;
        this.setPercent(100);
    }

    /**
     * Sets the health percentage and updates the image
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
        const bounded = Math.max(0, Math.min(100, this.percent));
        return bounded === 0 ? 0 : Math.ceil(bounded / 20);
    }
}
